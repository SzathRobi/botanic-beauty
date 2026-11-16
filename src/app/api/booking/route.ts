import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { contactFormSchema } from '@/app/idopontfoglalas/schemas/contactForm.schema'
import { auth } from '@/auth'
import { SALON_ID } from '@/constants/salon.constants'
import {
  EXTRA_SERVICE_HAIRCUT,
  EXTRA_SERVICES,
  SERVICES,
} from '@/constants/services.constants'
import { updateAdminBooking } from '@/lib/admin-booking'
import prisma from '@/lib/db'
import {
  getAvailableTimeSlots,
  getBookingDateKey,
  getGuestServiceDuration,
} from '@/lib/guest-booking'
import { withGuestBookingLock } from '@/lib/guest-booking-lock'
import { notifyGuestBooking } from '@/lib/guest-booking-notifications'

const guestBookingSchema = z.object({
  service: z.object({ id: z.string() }),
  extraServices: z.array(z.object({ id: z.string() })).default([]),
  hairdresser: z.literal('Timi'),
  selectedDate: z.string().regex(/^\d{4}-\d{1,2}-\d{1,2}$/),
  selectedTimeSlot: z.string(),
  contactInfo: contactFormSchema.extend({ otherInfo: z.string().nullish() }),
})

export async function GET() {
  if (process.env.IS_BOOKING_AVAILABLE !== 'true') {
    return NextResponse.json({ error: true }, { status: 503 })
  }
  try {
    const bookings = await prisma.booking.findMany({
      select: { selectedDate: true, selectedTimeSlot: true, hairdresser: true },
    })
    return NextResponse.json(
      { success: true, data: bookings },
      {
        headers: { 'Cache-Control': 'no-store' },
      }
    )
  } catch {
    return NextResponse.json({ error: true }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (process.env.IS_BOOKING_AVAILABLE !== 'true') {
    return NextResponse.json(
      { error: true, message: 'Booking is not available' },
      { status: 503 }
    )
  }

  let input: z.infer<typeof guestBookingSchema>
  try {
    const parsed = guestBookingSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: true, message: 'Invalid data' },
        { status: 400 }
      )
    }
    input = parsed.data
  } catch {
    return NextResponse.json(
      { error: true, message: 'Invalid data' },
      { status: 400 }
    )
  }

  const dateKey = getBookingDateKey(input.selectedDate)
  const service = SERVICES.find((item) => item.id === input.service.id)
  const extraServices = input.extraServices.map((extra) =>
    EXTRA_SERVICES.find((item) => item.id === extra.id)
  )
  if (
    !dateKey ||
    !service ||
    extraServices.some((extra) => !extra) ||
    new Set(input.extraServices.map((extra) => extra.id)).size !==
      input.extraServices.length ||
    (service.category !== 'Festések' &&
      input.extraServices.some(
        (extra) => extra.id === EXTRA_SERVICE_HAIRCUT.id
      ))
  ) {
    return NextResponse.json(
      { error: true, message: 'Invalid data' },
      { status: 400 }
    )
  }
  const canonicalExtras = extraServices.filter(
    (extra): extra is NonNullable<typeof extra> => Boolean(extra)
  )

  try {
    const result = await withGuestBookingLock(
      dateKey + ':' + input.hairdresser,
      async () => {
        const [salon, schedule, bookings] = await Promise.all([
          prisma.salon.findUnique({ where: { id: SALON_ID } }),
          prisma.schedule.findFirst(),
          prisma.booking.findMany({
            select: {
              selectedDate: true,
              selectedTimeSlot: true,
              hairdresser: true,
            },
          }),
        ])
        if (!salon || !schedule)
          return { error: 'Booking is not available', status: 503 } as const

        const options = {
          openingHours: salon.openingHours,
          specialOpeningHours: salon.specialOpeningHours,
          offDays: schedule.offDays,
          hairdresser: input.hairdresser,
          duration: getGuestServiceDuration(service, canonicalExtras),
          now: new Date(),
        }
        if (
          !getAvailableTimeSlots(dateKey, {
            ...options,
            bookings: [],
          }).includes(input.selectedTimeSlot)
        ) {
          return { error: 'Time slot is not available', status: 400 } as const
        }
        if (
          !getAvailableTimeSlots(dateKey, { ...options, bookings }).includes(
            input.selectedTimeSlot
          )
        ) {
          return {
            error: 'Overlap with existing booking',
            status: 409,
          } as const
        }

        // Keep the date-only storage format already used by guest bookings.
        const [year, month, day] = dateKey.split('-').map(Number)
        const booking = await prisma.booking.create({
          data: {
            service,
            extraServices: canonicalExtras,
            hairdresser: input.hairdresser,
            selectedDate: year + '-' + month + '-' + day,
            selectedTimeSlot: input.selectedTimeSlot,
            contactInfo: {
              ...input.contactInfo,
              email: input.contactInfo.email.toLowerCase(),
              otherInfo: input.contactInfo.otherInfo || null,
            },
            isFinanceDone: false,
            bleachMaterialUsage: 0,
            dyeMaterialUsage: 0,
            finalPrice: 0,
          },
        })
        return { booking } as const
      }
    )

    if ('error' in result) {
      return NextResponse.json(
        { error: true, message: result.error },
        { status: result.status }
      )
    }
    // An email failure must never roll back an otherwise successful booking.
    const notifications = await notifyGuestBooking(result.booking).catch(
      (error) => {
        console.error('Guest booking notifications failed:', error)
        return { verificationEmailSent: false, reminderScheduled: false }
      }
    )
    return NextResponse.json({
      success: true,
      data: result.booking,
      notifications,
    })
  } catch (error) {
    console.error('Error creating guest booking:', error)
    return NextResponse.json(
      { error: true, message: 'Unable to create booking' },
      { status: 500 }
    )
  }
}

// Compatibility for already-open admin tabs using the former drag endpoint.
export async function PATCH(request: NextRequest) {
  const session = await auth()
  if (!session?.user)
    return NextResponse.json(
      { error: true, message: 'Unauthenticated' },
      { status: 401 }
    )
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: true, message: 'Invalid data' },
      { status: 400 }
    )
  }
  if (typeof body?.id !== 'string')
    return NextResponse.json(
      { error: true, message: 'Invalid data' },
      { status: 400 }
    )
  return updateAdminBooking(body.id, body)
}
