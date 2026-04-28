import { NextResponse } from "next/server"

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
const MODEL = "llama-3.3-70b-versatile"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "You are a medical AI assistant. Always respond with valid JSON only.",
          },
          {
            role: "user",
            content: `Create structured clinical notes from a doctor-patient consultation and return a JSON object with exactly this structure:
{
  "patientName": "string",
  "date": "string",
  "chiefComplaint": "string",
  "symptoms": ["string"],
  "diagnosis": "string",
  "medications": ["string with dosage"],
  "followUp": "string"
}

Use today's date for the visit date. Use realistic placeholder values where specific details are unavailable.`,
          },
        ],
      }),
    })

    if (!res.ok) throw new Error(`Groq error ${res.status}: ${await res.text()}`)
    const data = await res.json()
    const transcription = JSON.parse(data.choices[0].message.content)

    return NextResponse.json(transcription)
  } catch (error) {
    console.error("Transcription error:", error)
    return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 })
  }
}
