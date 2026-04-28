import { NextResponse } from "next/server"

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
const MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString("base64")
    const mimeType = file.type

    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `You are a medical AI assistant. Analyze this medical report image and respond with ONLY a valid JSON object — no markdown, no explanation, just raw JSON — using exactly this structure:
{
  "patientName": "string or Not specified",
  "date": "string",
  "keyFindings": ["string"],
  "diagnosis": "string",
  "medications": ["string"],
  "recommendations": ["string"]
}

Extract patient name, report date, key findings, diagnosis, medications, and recommendations. Use plain patient-friendly language. Use "Not specified" when information is unavailable.`,
              },
              {
                type: "image_url",
                image_url: { url: `data:${mimeType};base64,${base64}` },
              },
            ],
          },
        ],
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error("Groq API error:", res.status, errText)
      throw new Error(`Groq error ${res.status}`)
    }

    const data = await res.json()
    const raw = data.choices[0].message.content as string

    const jsonStr = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim()
    const summary = JSON.parse(jsonStr)

    return NextResponse.json(summary)
  } catch (error) {
    console.error("Report summarization error:", error)
    return NextResponse.json({ error: "Failed to summarize report" }, { status: 500 })
  }
}
