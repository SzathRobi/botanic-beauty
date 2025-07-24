import { Booking } from '@prisma/client'
import { verifySignatureAppRouter } from '@upstash/qstash/nextjs'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

import { CONTACT_EMAIL, EMAIL_SENDER } from '@/constants/contact.constants'
import ReminderEmail from '@/emails/ReminderEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

export const POST = verifySignatureAppRouter(async (req: Request) => {
  const booking: Booking = await req.json()

  if (!booking) {
    return NextResponse.json({ error: true, message: 'Invalid data' })
  }

  try {
    await resend.emails.send({
      from:
        process.env.NODE_ENV === 'production'
          ? EMAIL_SENDER
          : 'Acme <onboarding@resend.dev>',
      to: booking.contactInfo.email,
      subject: 'Emlékeztető',
      react: ReminderEmail({ booking }),
      reply_to: CONTACT_EMAIL,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: true, message: error }, { status: 500 })
  }
})
