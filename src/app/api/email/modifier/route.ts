import { NextResponse } from 'next/server'

import { auth } from '@/auth'

// Compatibility for old admin tabs. The booking mutation now owns notifications;
// a separate request must never send an email for an unsuccessful mutation.
export async function POST() {
  const session = await auth()
  if (!session?.user)
    return NextResponse.json(
      { error: true, message: 'Unauthenticated' },
      { status: 401 }
    )
  return NextResponse.json({ success: true })
}
