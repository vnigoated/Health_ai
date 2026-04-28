import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const patients = await sql`SELECT * FROM patients ORDER BY full_name`
    return NextResponse.json(patients)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      full_name, email, phone, date_of_birth, gender, blood_group,
      address, emergency_contact, emergency_phone, allergies, medical_history,
    } = body

    const [patient] = await sql`
      INSERT INTO patients
        (full_name, email, phone, date_of_birth, gender, blood_group,
         address, emergency_contact, emergency_phone, allergies, medical_history)
      VALUES
        (${full_name}, ${email}, ${phone ?? null}, ${date_of_birth ?? null},
         ${gender ?? null}, ${blood_group ?? null}, ${address ?? null},
         ${emergency_contact ?? null}, ${emergency_phone ?? null},
         ${allergies ?? null}, ${medical_history ?? null})
      RETURNING *
    `
    return NextResponse.json(patient)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
