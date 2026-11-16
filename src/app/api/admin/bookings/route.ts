import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/auth'
import { createAdminBooking } from '@/lib/admin-booking'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json(
      { error: true, message: 'Unauthenticated' },
      { status: 401 }
    )
  }
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: true, message: 'Invalid data' },
      { status: 400 }
    )
  }
  return createAdminBooking(body)
}
