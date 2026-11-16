import { NextResponse } from 'next/server'

// Compatibility for already-open guest tabs. The booking POST now schedules
// reminders from the persisted booking, without trusting a client-provided delay.
export async function POST() {
  return NextResponse.json({ success: true })
}
