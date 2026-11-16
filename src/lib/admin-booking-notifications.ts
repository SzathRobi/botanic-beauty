import type { Booking } from '@prisma/client'
import { Client } from '@upstash/qstash'
import { Resend } from 'resend'

import { CONTACT_EMAIL, EMAIL_SENDER } from '@/constants/contact.constants'
import CancelEmail from '@/emails/CancelEmail'
import ModifierEmail from '@/emails/ModifierEmail'
import prisma from '@/lib/db'

import { getBookingDateKey, getGuestReminderDelay } from './guest-booking'
import { notifyGuestBooking } from './guest-booking-notifications'

export const notifyAdminBookingCreation = async (booking: Booking) => {
  const result = await notifyGuestBooking(booking)
  const saved = await prisma.booking
    .findUnique({ where: { id: booking.id } })
    .catch(() => null)
  return {
    booking: saved ?? booking,
    notifications: {
      emailSent: result.verificationEmailSent,
      reminderUpdated: result.reminderScheduled,
    },
  }
}

const emailBooking = (booking: Booking) => ({
  ...booking,
  selectedDate: getBookingDateKey(booking.selectedDate)!,
})

const sendEmail = async (booking: Booking, cancelled: boolean) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const result = await resend.emails.send({
      from:
        process.env.NODE_ENV === 'production'
          ? EMAIL_SENDER
          : 'Acme <onboarding@resend.dev>',
      to: booking.contactInfo.email,
      subject: cancelled ? 'Foglalás törlése' : 'Foglalás módosulása',
      react: cancelled
        ? CancelEmail({ booking: emailBooking(booking) })
        : ModifierEmail({ booking: emailBooking(booking) }),
      reply_to: CONTACT_EMAIL,
    })
    if (result.error) throw new Error(result.error.message)
    return true
  } catch (error) {
    console.error('Admin booking email failed:', error)
    return false
  }
}

const cancelReminder = async (booking: Booking) => {
  if (!booking.remindenEmailJobId) return true
  try {
    const client = new Client({ token: process.env.QSTASH_TOKEN! })
    await client.messages.delete(booking.remindenEmailJobId)
    return true
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'status' in error &&
      error.status === 404
    )
      return true
    console.error('Admin booking reminder cancellation failed:', error)
    return false
  }
}

export const notifyAdminBookingChange = async (
  previous: Booking,
  booking: Booking
) => {
  const changed =
    getBookingDateKey(previous.selectedDate) !==
      getBookingDateKey(booking.selectedDate) ||
    previous.selectedTimeSlot !== booking.selectedTimeSlot ||
    JSON.stringify(previous.service) !== JSON.stringify(booking.service) ||
    JSON.stringify(previous.extraServices) !==
      JSON.stringify(booking.extraServices) ||
    previous.hairdresser !== booking.hairdresser ||
    previous.contactInfo.email !== booking.contactInfo.email
  if (!changed)
    return {
      booking,
      notifications: { emailSent: null, reminderUpdated: null },
    }

  let latestBooking = booking
  const updateReminder = async () => {
    if (!(await cancelReminder(previous))) return { booking, updated: false }
    let current = await prisma.booking.update({
      where: { id: booking.id },
      data: { remindenEmailJobId: null },
    })
    latestBooking = current
    const delay = getGuestReminderDelay(booking)
    if (delay === null) return { booking: current, updated: true }
    const client = new Client({ token: process.env.QSTASH_TOKEN! })
    const result = await client.publishJSON({
      url: `${process.env.NODE_ENV === 'production' ? 'https://botanic-beauty.hu' : 'https://major-candles-fall.loca.lt'}/api/email/reminder`,
      body: emailBooking(booking),
      delay,
    })
    try {
      current = await prisma.booking.update({
        where: { id: booking.id },
        data: { remindenEmailJobId: result.messageId },
      })
    } catch (error) {
      await client.messages.delete(result.messageId).catch(() => undefined)
      throw error
    }
    latestBooking = current
    return { booking: current, updated: true }
  }

  const [emailSent, reminder] = await Promise.all([
    sendEmail(booking, false),
    updateReminder().catch((error) => {
      console.error('Admin booking reminder rescheduling failed:', error)
      return { booking: latestBooking, updated: false }
    }),
  ])
  return {
    booking: reminder.booking,
    notifications: { emailSent, reminderUpdated: reminder.updated },
  }
}

export const notifyAdminBookingDeletion = async (booking: Booking) => {
  const [emailSent, reminderUpdated] = await Promise.all([
    sendEmail(booking, true),
    cancelReminder(booking),
  ])
  return { emailSent, reminderUpdated }
}
