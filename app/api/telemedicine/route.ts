const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
const MODEL = "llama-3.3-70b-versatile"

const conversations = new Map<string, Array<{ role: string; content: string }>>()

const SYSTEM_PROMPT = `You are an empathetic and knowledgeable telemedicine doctor conducting a virtual consultation.

Guidelines:
- Be professional, caring, and thorough
- Ask relevant follow-up questions
- Provide clear medical advice
- Remember the conversation context
- Suggest when in-person care is needed
- Use simple language while being medically accurate
- Always include appropriate disclaimers`

export async function POST(req: Request) {
  try {
    const { message, sessionId, patientContext } = await req.json()

    if (!message || !sessionId) {
      return Response.json({ error: "Message and sessionId are required" }, { status: 400 })
    }

    const history = conversations.get(sessionId) || []

    if (history.length === 0 && patientContext) {
      history.push({
        role: "user",
        content: `Patient context for this session: ${JSON.stringify(patientContext)}`,
      })
      history.push({
        role: "assistant",
        content: "I have reviewed the patient context. How can I help you today?",
      })
    }

    history.push({ role: "user", content: message })

    const messages = [{ role: "system", content: SYSTEM_PROMPT }, ...history]

    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: MODEL, messages, stream: true }),
    })

    if (!res.ok) throw new Error(`Groq error ${res.status}: ${await res.text()}`)

    // Collect full text for history while streaming
    const [streamA, streamB] = res.body!.tee()

    ;(async () => {
      try {
        const reader = streamB.getReader()
        const decoder = new TextDecoder()
        let fullText = ""
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          for (const line of chunk.split("\n")) {
            if (!line.startsWith("data: ") || line === "data: [DONE]") continue
            try {
              const delta = JSON.parse(line.slice(6)).choices?.[0]?.delta?.content
              if (delta) fullText += delta
            } catch {}
          }
        }
        if (fullText) {
          history.push({ role: "assistant", content: fullText })
          conversations.set(sessionId, history)
        }
      } catch {}
    })()

    return new Response(streamA, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Telemedicine chat error:", error)
    return Response.json({ error: "Failed to process message" }, { status: 500 })
  }
}
