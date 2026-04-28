import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const today = new Date().toISOString().split("T")[0]
    const rows = await sql`
      SELECT a.*, p.full_name AS patient_name, d.full_name AS doctor_name
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN doctors d ON a.doctor_id = d.id
      WHERE a.appointment_date = ${today}
      ORDER BY a.appointment_time
    `
    return NextResponse.json(rows)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { patient_id, doctor_id, appointment_date, appointment_time, reason, status } = await req.json()

    const [row] = await sql`
      INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status)
      VALUES (${patient_id}, ${doctor_id}, ${appointment_date}, ${appointment_time},
              ${reason ?? null}, ${status ?? "scheduled"})
      RETURNING *
    `
    return NextResponse.json(row)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
