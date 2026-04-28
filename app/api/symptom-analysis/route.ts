const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
const MODEL = "llama-3.3-70b-versatile"

async function groqJSON(messages: object[]) {
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: MODEL, messages, response_format: { type: "json_object" } }),
  })
  if (!res.ok) throw new Error(`Groq error ${res.status}: ${await res.text()}`)
  const data = await res.json()
  return JSON.parse(data.choices[0].message.content)
}

export async function POST(req: Request) {
  try {
    const { symptoms } = await req.json()
    if (!symptoms) return Response.json({ error: "Symptoms are required" }, { status: 400 })

    const object = await groqJSON([
      {
        role: "system",
        content: "You are an expert medical AI assistant. Always respond with valid JSON only.",
      },
      {
        role: "user",
        content: `Analyze these symptoms and return a JSON object with exactly this structure:
{
  "conditions": [
    {
      "condition": "string",
      "probability": number (0-100),
      "severity": "low" | "medium" | "high",
      "description": "string",
      "recommendations": ["string"]
    }
  ],
  "urgencyLevel": "routine" | "soon" | "urgent" | "emergency",
  "generalAdvice": "string"
}

Symptoms: ${symptoms}

Provide top 5 possible conditions. Be accurate, evidence-based, and include medical disclaimers.`,
      },
    ])

    return Response.json(object)
  } catch (error) {
    console.error("Symptom analysis error:", error)
    return Response.json({ error: "Failed to analyze symptoms" }, { status: 500 })
  }
}
