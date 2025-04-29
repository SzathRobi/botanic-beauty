import { NextResponse } from 'next/server'
import { Resend } from 'resend'

import { auth } from '@/auth'
import { CONTACT_EMAIL, EMAIL_SENDER } from '@/constants/contact.constants'
import CancelEmail from '@/emails/CancelEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json(
      { error: true, message: 'Unauthenticated' },
      { status: 401 }
    )
  }

  const { booking } = await request.json()

  if (!booking.contactInfo.email || !booking.service) {
    return NextResponse.json(
      { error: true, message: 'Invalid data' },
      { status: 400 }
    )
  }

  try {
    await resend.emails.send({
      from:
        process.env.NODE_ENV === 'production'
          ? EMAIL_SENDER
          : 'Acme <onboarding@resend.dev>',
      to: booking.contactInfo.email,
      subject: 'Foglalás törlése',
      react: CancelEmail({ booking }),
      reply_to: CONTACT_EMAIL,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: true, message: error }, { status: 500 })
  }
}
