import type { Booking } from '@prisma/client'
import { Client } from '@upstash/qstash'
import { Resend } from 'resend'

import { generateGoogleCalendarLink } from '@/app/api/email/utils/generateGoogleCalendarLink.util'
import { CONTACT_EMAIL, EMAIL_SENDER } from '@/constants/contact.constants'
import { VerificationEmail } from '@/emails/VerificationEmail'
import prisma from '@/lib/db'

import { getBookingDateKey, getGuestReminderDelay } from './guest-booking'

export const notifyGuestBooking = async (booking: Booking) => {
  const emailBooking = {
    ...booking,
    selectedDate: getBookingDateKey(booking.selectedDate)!,
  }

  const sendVerification = async () => {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const result = await resend.emails.send({
        from:
          process.env.NODE_ENV === 'production'
            ? EMAIL_SENDER
            : 'Acme <onboarding@resend.dev>',
        to: booking.contactInfo.email,
        subject: 'Visszaigazolás',
        react: VerificationEmail({
          booking: emailBooking,
          googleCalendarLink: generateGoogleCalendarLink(emailBooking),
        }),
        reply_to: CONTACT_EMAIL,
      })
      if (result.error) throw new Error(result.error.message)
      return true
    } catch (error) {
      console.error('Guest booking confirmation failed:', error)
      return false
    }
  }

  const scheduleReminder = async () => {
    const delay = getGuestReminderDelay(booking)
    if (delay === null) return null
    try {
      const client = new Client({ token: process.env.QSTASH_TOKEN! })
      const result = await client.publishJSON({
        url: `${process.env.NODE_ENV === 'production' ? 'https://botanic-beauty.hu' : 'https://major-candles-fall.loca.lt'}/api/email/reminder`,
        body: emailBooking,
        delay,
      })
      try {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { remindenEmailJobId: result.messageId },
        })
      } catch (error) {
        // Do not leave an untracked reminder behind if saving its ID fails.
        await client.messages.delete(result.messageId).catch(() => undefined)
        throw error
      }
      return true
    } catch (error) {
      console.error('Guest booking reminder scheduling failed:', error)
      return false
    }
  }

  const [verificationEmailSent, reminderScheduled] = await Promise.all([
    sendVerification(),
    scheduleReminder(),
  ])
  return { verificationEmailSent, reminderScheduled }
}
