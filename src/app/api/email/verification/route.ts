import { NextResponse } from 'next/server'

// Compatibility for already-open guest tabs. Booking creation now sends the
// confirmation itself, after the booking has been saved. Never send twice here.
export async function POST() {
  return NextResponse.json({ success: true })
}
