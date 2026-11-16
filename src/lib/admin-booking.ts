import { NextResponse } from 'next/server'
import { z } from 'zod'

import { EXTRA_SERVICES, SERVICES } from '@/constants/services.constants'
import prisma from '@/lib/db'

import {
  notifyAdminBookingChange,
  notifyAdminBookingCreation,
  notifyAdminBookingDeletion,
} from './admin-booking-notifications'
import {
  getBookingDateKey,
  getGuestServiceDuration,
  timeToMinutes,
} from './guest-booking'
import { withGuestBookingLock } from './guest-booking-lock'

const updateSchema = z.object({
  selectedDate: z.string(),
  selectedTimeSlot: z.string().regex(/^\d{2}:\d{2} - \d{2}:\d{2}$/),
  hairdresser: z.enum(['Timi', 'nem_Timi']).optional(),
  service: z.object({ id: z.string() }).optional(),
  extraServices: z.array(z.object({ id: z.string() })).optional(),
  contactInfo: z
    .object({
      name: z.string().trim().min(1),
      email: z.string().trim().email(),
      phone: z.string().trim().min(1),
      otherInfo: z.string().nullish(),
    })
    .optional(),
})

const failure = (message: string, status: number) =>
  NextResponse.json({ error: true, message }, { status })

const createSchema = updateSchema.required({
  hairdresser: true,
  service: true,
  extraServices: true,
  contactInfo: true,
})

export const createAdminBooking = async (body: unknown) => {
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return failure('Invalid data', 400)
  const input = parsed.data
  const dateKey = getBookingDateKey(input.selectedDate)
  const [start, end] = input.selectedTimeSlot.split(' - ').map(timeToMinutes)
  const service = SERVICES.find((item) => item.id === input.service.id)
  const extras = input.extraServices.map((extra) =>
    EXTRA_SERVICES.find((item) => item.id === extra.id)
  )
  if (
    !dateKey ||
    !service ||
    extras.some((extra) => !extra) ||
    new Set(input.extraServices.map((extra) => extra.id)).size !== extras.length
  ) {
    return failure('Invalid data', 400)
  }
  const extraServices = extras.filter(
    (extra): extra is NonNullable<typeof extra> => Boolean(extra)
  )
  if (
    start === null ||
    end === null ||
    end <= start ||
    end - start !== getGuestServiceDuration(service, extraServices)
  ) {
    return failure('Invalid booking duration', 400)
  }
  try {
    const saved = await withGuestBookingLock(
      dateKey + ':' + input.hairdresser,
      async () => {
        const [schedule, bookings] = await Promise.all([
          prisma.schedule.findFirst(),
          prisma.booking.findMany({
            select: {
              selectedDate: true,
              selectedTimeSlot: true,
              hairdresser: true,
            },
          }),
        ])
        // Admin creation follows the same exceptions as admin moves: no opening-hour
        // or two-hour guest limit, but no staff off days, past dates or collisions.
        if (
          dateKey < getBookingDateKey(new Date())! ||
          schedule?.offDays.some(
            (day) =>
              day.person === input.hairdresser &&
              getBookingDateKey(day.date) === dateKey
          )
        ) {
          return {
            ok: false,
            error: 'Time slot is not available',
            status: 400,
          } as const
        }
        const overlaps = bookings.some((booking) => {
          if (
            booking.hairdresser !== input.hairdresser ||
            getBookingDateKey(booking.selectedDate) !== dateKey
          )
            return false
          const [existingStart, existingEnd] = booking.selectedTimeSlot
            .split(' - ')
            .map(timeToMinutes)
          return (
            existingStart !== null &&
            existingEnd !== null &&
            start < existingEnd &&
            end > existingStart
          )
        })
        if (overlaps)
          return {
            ok: false,
            error: 'Overlap with existing booking',
            status: 409,
          } as const
        const [year, month, day] = dateKey.split('-').map(Number)
        const contactInfo = {
          ...input.contactInfo,
          email: input.contactInfo.email.toLowerCase(),
          otherInfo: input.contactInfo.otherInfo || null,
        }
        const booking = await prisma.$transaction(async (tx) => {
          const customer = await tx.customer.upsert({
            where: { email: contactInfo.email },
            update: {},
            create: {
              name: contactInfo.name,
              email: contactInfo.email,
              phone: contactInfo.phone,
              hairdressers: [input.hairdresser],
            },
          })
          if (!customer.hairdressers.includes(input.hairdresser)) {
            await tx.customer.update({
              where: { id: customer.id },
              data: { hairdressers: { push: input.hairdresser } },
            })
          }
          return tx.booking.create({
            data: {
              selectedDate: `${year}-${month}-${day}`,
              selectedTimeSlot: input.selectedTimeSlot,
              hairdresser: input.hairdresser,
              service,
              extraServices,
              contactInfo,
              isFinanceDone: false,
              finalPrice: 0,
              bleachMaterialUsage: 0,
              dyeMaterialUsage: 0,
            },
          })
        })
        return { ok: true, booking } as const
      }
    )
    if (!saved.ok) return failure(saved.error, saved.status)
    const result = await notifyAdminBookingCreation(saved.booking).catch(
      (error) => {
        console.error('Admin booking creation notifications failed:', error)
        return {
          booking: saved.booking,
          notifications: { emailSent: false, reminderUpdated: false },
        }
      }
    )
    return NextResponse.json(
      {
        success: true,
        data: result.booking,
        notifications: result.notifications,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Admin booking creation failed:', error)
    return failure('Unable to create booking', 500)
  }
}

export const updateAdminBooking = async (id: string, body: unknown) => {
  const parsed = updateSchema.safeParse(body)
  if (!id || !parsed.success) return failure('Invalid data', 400)
  const input = parsed.data
  const dateKey = getBookingDateKey(input.selectedDate)
  const [startText, endText] = input.selectedTimeSlot.split(' - ')
  const start = timeToMinutes(startText)
  const end = timeToMinutes(endText)
  if (!dateKey || start === null || end === null || end <= start)
    return failure('Invalid booking time', 400)

  try {
    const result = await withGuestBookingLock('booking:' + id, async () => {
      const existing = await prisma.booking.findUnique({ where: { id } })
      if (!existing)
        return { ok: false, error: 'Booking not found', status: 404 } as const
      const hairdresser = input.hairdresser ?? existing.hairdresser
      const saved = await withGuestBookingLock(
        dateKey + ':' + hairdresser,
        async () => {
          const service =
            !input.service || input.service.id === existing.service.id
              ? existing.service
              : SERVICES.find((item) => item.id === input.service!.id)
          const extras =
            input.extraServices?.map(
              (extra) =>
                existing.extraServices.find((item) => item.id === extra.id) ??
                EXTRA_SERVICES.find((item) => item.id === extra.id)
            ) ?? existing.extraServices
          if (
            !service ||
            extras.some((extra) => !extra) ||
            new Set(extras.map((extra) => extra?.id)).size !== extras.length
          ) {
            return { ok: false, error: 'Invalid data', status: 400 } as const
          }
          const extraServices = extras.filter(
            (extra): extra is NonNullable<typeof extra> => Boolean(extra)
          )
          const duration = getGuestServiceDuration(service, extraServices)
          const [oldStart, oldEnd] = existing.selectedTimeSlot
            .split(' - ')
            .map(timeToMinutes)
          const oldDuration =
            oldStart !== null && oldEnd !== null ? oldEnd - oldStart : null
          const servicesChanged =
            service.id !== existing.service.id ||
            extraServices
              .map((extra) => extra.id)
              .sort()
              .join(',') !==
              existing.extraServices
                .map((extra) => extra.id)
                .sort()
                .join(',')
          // Preserve historical custom-length appointments while keeping new service durations consistent.
          if (
            end - start !== duration &&
            (servicesChanged || end - start !== oldDuration)
          ) {
            return {
              ok: false,
              error: 'Invalid booking duration',
              status: 400,
            } as const
          }
          const scheduleChanged =
            dateKey !== getBookingDateKey(existing.selectedDate) ||
            input.selectedTimeSlot !== existing.selectedTimeSlot ||
            hairdresser !== existing.hairdresser
          if (scheduleChanged) {
            const [schedule, bookings] = await Promise.all([
              prisma.schedule.findFirst(),
              prisma.booking.findMany({
                select: {
                  id: true,
                  selectedDate: true,
                  selectedTimeSlot: true,
                  hairdresser: true,
                },
              }),
            ])
            // Admins can override regular/special opening hours. Staff off days
            // and past-date restrictions are independent of salon opening hours.
            if (
              dateKey < getBookingDateKey(new Date())! ||
              schedule?.offDays.some(
                (day) =>
                  day.person === hairdresser &&
                  getBookingDateKey(day.date) === dateKey
              )
            ) {
              return {
                ok: false,
                error: 'Time slot is not available',
                status: 400,
              } as const
            }
            const overlaps = bookings.some((booking) => {
              if (
                booking.id === id ||
                booking.hairdresser !== hairdresser ||
                getBookingDateKey(booking.selectedDate) !== dateKey
              )
                return false
              const [existingStart, existingEnd] = booking.selectedTimeSlot
                .split(' - ')
                .map(timeToMinutes)
              return (
                existingStart !== null &&
                existingEnd !== null &&
                start < existingEnd &&
                end > existingStart
              )
            })
            if (overlaps)
              return {
                error: 'Overlap with existing booking',
                status: 409,
              } as const
          }
          const [year, month, day] = dateKey.split('-').map(Number)
          const booking = await prisma.booking.update({
            where: { id },
            data: {
              selectedDate: `${year}-${month}-${day}`,
              selectedTimeSlot: input.selectedTimeSlot,
              hairdresser,
              service,
              extraServices,
              ...(input.contactInfo
                ? {
                    contactInfo: {
                      ...input.contactInfo,
                      email: input.contactInfo.email.toLowerCase(),
                      otherInfo: input.contactInfo.otherInfo || null,
                    },
                  }
                : {}),
            },
          })
          return { ok: true, booking } as const
        }
      )
      if (!saved.ok) return saved
      // Release the date lock before contacting email services; retain the booking
      // lock so a later edit cannot race with reminder bookkeeping for this one.
      const notification = await notifyAdminBookingChange(
        existing,
        saved.booking
      ).catch((error) => {
        console.error('Admin booking notifications failed:', error)
        return {
          booking: saved.booking,
          notifications: { emailSent: false, reminderUpdated: false },
        }
      })
      return { ok: true, ...notification } as const
    })
    if (!result.ok) return failure(result.error, result.status)
    return NextResponse.json({
      success: true,
      id: result.booking.id,
      data: result.booking,
      message: result.booking,
      notifications: result.notifications,
    })
  } catch (error) {
    console.error('Admin booking update failed:', error)
    return failure('Unable to update booking', 500)
  }
}

export const deleteAdminBooking = async (id: string) => {
  if (!id) return failure('Invalid data', 400)
  try {
    return await withGuestBookingLock('booking:' + id, async () => {
      const booking = await prisma.booking.findUnique({ where: { id } })
      if (!booking) return failure('Booking not found', 404)
      await prisma.booking.delete({ where: { id } })
      const notifications = await notifyAdminBookingDeletion(booking).catch(
        (error) => {
          console.error(
            'Admin booking cancellation notifications failed:',
            error
          )
          return { emailSent: false, reminderUpdated: false }
        }
      )
      return NextResponse.json({ success: true, notifications })
    })
  } catch (error) {
    console.error('Admin booking deletion failed:', error)
    return failure('Unable to delete booking', 500)
  }
}
