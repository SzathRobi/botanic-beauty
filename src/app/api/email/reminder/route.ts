import { verifySignatureAppRouter } from '@upstash/qstash/nextjs'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

import { CONTACT_EMAIL, EMAIL_SENDER } from '@/constants/contact.constants'
import ReminderEmail from '@/emails/ReminderEmail'
import prisma from '@/lib/db'
import { getBookingDateKey } from '@/lib/guest-booking'

export const POST = verifySignatureAppRouter(async (req: Request) => {
  try {
    const scheduled = await req.json()
    if (typeof scheduled?.id !== 'string')
      return NextResponse.json(
        { error: true, message: 'Invalid data' },
        { status: 400 }
      )
    const booking = await prisma.booking.findUnique({
      where: { id: scheduled.id },
    })
    // A cancelled/moved appointment must not receive an old queued reminder,
    // even if cancellation at the email provider previously failed.
    if (
      !booking ||
      getBookingDateKey(booking.selectedDate) !==
        getBookingDateKey(scheduled.selectedDate) ||
      booking.selectedTimeSlot !== scheduled.selectedTimeSlot ||
      booking.contactInfo.email !== scheduled.contactInfo?.email
    ) {
      return NextResponse.json({ success: true, skipped: true })
    }
    const resend = new Resend(process.env.RESEND_API_KEY)
    const result = await resend.emails.send({
      from:
        process.env.NODE_ENV === 'production'
          ? EMAIL_SENDER
          : 'Acme <onboarding@resend.dev>',
      to: booking.contactInfo.email,
      subject: 'Emlékeztető',
      react: ReminderEmail({
        booking: {
          ...booking,
          selectedDate: getBookingDateKey(booking.selectedDate)!,
        },
      }),
      reply_to: CONTACT_EMAIL,
    })
    if (result.error) throw new Error(result.error.message)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Booking reminder failed:', error)
    return NextResponse.json(
      { error: true, message: 'Unable to send reminder' },
      { status: 500 }
    )
  }
})
