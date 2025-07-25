import { Client } from '@upstash/qstash'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

import { auth } from '@/auth'
import { CONTACT_EMAIL, EMAIL_SENDER } from '@/constants/contact.constants'
import ModifierEmail from '@/emails/ModifierEmail'
import prisma from '@/lib/db'

const client = new Client({ token: process.env.QSTASH_TOKEN! })
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json(
      { error: true, message: 'Unauthenticated' },
      { status: 401 }
    )
  }

  const { booking, emailDelayInSeconds } = await request.json()

  if (
    !booking.contactInfo.email ||
    !booking.selectedDate ||
    !booking.selectedTimeSlot ||
    !booking.service
  ) {
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
      subject: 'Foglalás módosulása',
      react: ModifierEmail({ booking }),
      reply_to: CONTACT_EMAIL,
    })

    const result = await client.publishJSON({
      url: `https://${process.env.VERCEL_URL}/api/email/reminder`,
      body: booking,
      delay: 60, //emailDelayInSeconds,
    })

    await prisma.booking.update({
      where: {
        id: booking.id,
      },
      data: {
        remindenEmailJobId: result.messageId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: true, message: error }, { status: 500 })
  }
}
