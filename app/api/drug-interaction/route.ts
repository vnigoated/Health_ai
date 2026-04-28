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
    const { medications } = await req.json()
    if (!medications || medications.length < 2)
      return Response.json({ error: "At least 2 medications required" }, { status: 400 })

    const object = await groqJSON([
      {
        role: "system",
        content: "You are a clinical pharmacologist expert. Always respond with valid JSON only.",
      },
      {
        role: "user",
        content: `Analyze drug interactions between: ${medications.join(", ")}

Return a JSON object with exactly this structure:
{
  "hasInteraction": boolean,
  "severity": "none" | "mild" | "moderate" | "severe" | "contraindicated",
  "interactions": [
    {
      "drugs": ["string"],
      "type": "string",
      "mechanism": "string",
      "clinicalEffects": "string",
      "management": "string"
    }
  ],
  "recommendations": ["string"],
  "alternatives": ["string"],
  "monitoring": "string"
}

Be thorough and evidence-based. Include all clinically significant interactions.`,
      },
    ])

    return Response.json(object)
  } catch (error) {
    console.error("Drug interaction check error:", error)
    return Response.json({ error: "Failed to check drug interactions" }, { status: 500 })
  }
}
