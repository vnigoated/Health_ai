import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const doctors = await sql`SELECT * FROM doctors ORDER BY full_name`
    return NextResponse.json(doctors)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { full_name, email, phone, specialization, license_number, years_of_experience } = await req.json()

    const [doctor] = await sql`
      INSERT INTO doctors (full_name, email, phone, specialization, license_number, years_of_experience)
      VALUES (
        ${full_name}, ${email}, ${phone ?? null}, ${specialization},
        ${license_number || null},
        ${years_of_experience ? parseInt(years_of_experience) : null}
      )
      RETURNING *
    `
    return NextResponse.json(doctor)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
