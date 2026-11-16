import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/auth'
import { deleteAdminBooking, updateAdminBooking } from '@/lib/admin-booking'

type BookingContext = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: BookingContext) {
  const session = await auth()
  if (!session?.user)
    return NextResponse.json(
      { error: true, message: 'Unauthenticated' },
      { status: 401 }
    )
  const { id } = await params
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: true, message: 'Invalid data' },
      { status: 400 }
    )
  }
  return updateAdminBooking(id, body)
}

export async function DELETE(_: NextRequest, { params }: BookingContext) {
  const session = await auth()
  if (!session?.user)
    return NextResponse.json(
      { error: true, message: 'Unauthenticated' },
      { status: 401 }
    )
  const { id } = await params
  return deleteAdminBooking(id)
}
