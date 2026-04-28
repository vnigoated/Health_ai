import { NextResponse } from "next/server"

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
const MODEL = "llama-3.3-70b-versatile"

export async function POST(req: Request) {
  try {
    const { age, weight, height, smoking, exercise, diet } = await req.json()

    const heightM = Number.parseInt(height) / 100
    const bmi = (Number.parseInt(weight) / (heightM * heightM)).toFixed(1)

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
            content: `Assess health risks for this patient:
Age: ${age}y | Weight: ${weight}kg | Height: ${height}cm | BMI: ${bmi}
Smoking: ${smoking} | Exercise: ${exercise} | Diet: ${diet}

Return JSON:
{
  "diabetes": number (0-100),
  "heartAttack": number (0-100),
  "stroke": number (0-100),
  "explanations": {
    "diabetes": "string",
    "heartAttack": "string",
    "stroke": "string"
  },
  "recommendations": ["string x5 minimum"]
}`,
          },
        ],
      }),
    })

    if (!res.ok) throw new Error(`Groq error ${res.status}`)
    const data = await res.json()
    const results = JSON.parse(data.choices[0].message.content)

    return NextResponse.json(results)
  } catch (error) {
    console.error("Health risk prediction error:", error)
    return NextResponse.json({ error: "Failed to calculate health risks" }, { status: 500 })
  }
}
