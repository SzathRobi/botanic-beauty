import { NextResponse } from 'next/server'
import { Resend } from 'resend'

import { CONTACT_EMAIL, EMAIL_SENDER } from '@/constants/contact.constants'
import { VerificationEmail } from '@/emails/VerificationEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const { booking, googleCalendarLink } = await request.json()

  if (!googleCalendarLink) {
    return NextResponse.json({
      error: true,
      message: 'no google calendar link',
    })
  }

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
      subject: 'Visszaigazolás',
      react: VerificationEmail({ booking, googleCalendarLink }),
      reply_to: CONTACT_EMAIL,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: true, message: error }, { status: 500 })
  }
}
