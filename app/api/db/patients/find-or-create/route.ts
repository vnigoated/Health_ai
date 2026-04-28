import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { first_name, last_name, full_name } = await req.json()
    const name = full_name ?? `${first_name ?? ""} ${last_name ?? ""}`.trim()

    const existing = await sql`
      SELECT * FROM patients WHERE LOWER(full_name) = LOWER(${name}) LIMIT 1
    `
    if (existing.length > 0) return NextResponse.json(existing[0])

    const fn = (first_name ?? name.split(" ")[0] ?? "unknown").toLowerCase()
    const ln = (last_name ?? (name.split(" ").slice(1).join(" ") || fn)).toLowerCase()

    const [patient] = await sql`
      INSERT INTO patients (full_name, email, phone, date_of_birth)
      VALUES (${name}, ${fn + "." + ln + "@temp.com"}, '0000000000', '2000-01-01')
      RETURNING *
    `
    return NextResponse.json(patient)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
