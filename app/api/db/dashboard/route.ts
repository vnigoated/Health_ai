import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const today = new Date().toISOString().split("T")[0]
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

    const [
      patientsCountRes,
      todayApptRes,
      activeCasesRes,
      criticalRes,
      patientsRes,
      weeklyApptsRes,
      historyRes,
      recentConsultRes,
    ] = await Promise.all([
      sql`SELECT COUNT(*)::int AS count FROM patients`,
      sql`SELECT COUNT(*)::int AS count FROM appointments WHERE appointment_date = ${today}`,
      sql`SELECT COUNT(*)::int AS count FROM consultations`,
      sql`SELECT COUNT(*)::int AS count FROM appointments WHERE status = 'urgent'`,
      sql`SELECT created_at FROM patients ORDER BY created_at ASC`,
      sql`SELECT appointment_date FROM appointments WHERE appointment_date >= ${sevenDaysAgo} ORDER BY appointment_date ASC`,
      sql`SELECT medical_history FROM patients WHERE medical_history IS NOT NULL`,
      sql`
        SELECT c.id, c.created_at, c.chief_complaint AS status, p.full_name AS patient_name
        FROM consultations c
        LEFT JOIN patients p ON c.patient_id = p.id
        ORDER BY c.created_at DESC
        LIMIT 4
      `,
    ])

    return NextResponse.json({
      stats: {
        totalPatients: patientsCountRes[0].count,
        appointmentsToday: todayApptRes[0].count,
        activeCases: activeCasesRes[0].count,
        criticalAlerts: criticalRes[0].count,
      },
      patients: patientsRes,
      weeklyAppts: weeklyApptsRes,
      patientsWithHistory: historyRes,
      recentConsultations: recentConsultRes,
    })
  } catch (error: any) {
    console.error("Dashboard API error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
