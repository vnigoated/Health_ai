const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
const MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"

export async function POST(req: Request) {
  try {
    const { image, imageType } = await req.json()

    if (!image) {
      return Response.json({ error: "Image is required" }, { status: 400 })
    }

    const dataUrl = image.startsWith("data:") ? image : `data:${imageType || "image/jpeg"};base64,${image}`

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
                text: `You are an expert radiologist. Analyze this medical image (${imageType || "X-ray/CT/MRI"}) and respond with ONLY a valid JSON object — no markdown, no explanation, just raw JSON — using exactly this structure:
{
  "diagnosis": "string",
  "confidence": <number 0-100>,
  "severity": "Mild" or "Moderate" or "Severe" or "Critical",
  "findings": [
    { "finding": "string", "location": "string", "significance": "string" }
  ],
  "recommendations": ["string"],
  "followUp": "string",
  "differentialDiagnosis": ["string"]
}`,
              },
              {
                type: "image_url",
                image_url: { url: dataUrl },
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

    // Strip markdown fences if present
    const jsonStr = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim()
    const object = JSON.parse(jsonStr)

    return Response.json(object)
  } catch (error) {
    console.error("Disease detection error:", error)
    return Response.json({ error: "Failed to analyze medical image" }, { status: 500 })
  }
}
