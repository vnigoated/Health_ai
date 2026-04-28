import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const rows = await sql`
      SELECT c.*, p.full_name AS patient_name, d.full_name AS doctor_name
      FROM consultations c
      LEFT JOIN patients p ON c.patient_id = p.id
      LEFT JOIN doctors d ON c.doctor_id = d.id
      ORDER BY c.created_at DESC
      LIMIT 10
    `
    return NextResponse.json(rows)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { patient_id, doctor_id, chief_complaint, symptoms, diagnosis, treatment_plan } = await req.json()

    const [row] = await sql`
      INSERT INTO consultations (patient_id, doctor_id, chief_complaint, symptoms, diagnosis, treatment_plan)
      VALUES (${patient_id}, ${doctor_id}, ${chief_complaint},
              ${symptoms ?? null}, ${diagnosis ?? null}, ${treatment_plan ?? null})
      RETURNING *
    `
    return NextResponse.json(row)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
