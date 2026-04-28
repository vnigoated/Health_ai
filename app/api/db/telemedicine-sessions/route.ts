import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { patient_id, doctor_id, conversation_history, status, session_end } = await req.json()

    const [row] = await sql`
      INSERT INTO telemedicine_sessions (patient_id, doctor_id, conversation_history, status, session_end)
      VALUES (
        ${patient_id}, ${doctor_id},
        ${JSON.stringify(conversation_history ?? [])}::jsonb,
        ${status ?? "completed"},
        ${session_end ?? null}
      )
      RETURNING *
    `
    return NextResponse.json(row)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
