import { NextResponse } from 'next/server'
import { z } from 'zod'

import { SALON_ID } from '@/constants/salon.constants'
import { EXTRA_SERVICES, SERVICES } from '@/constants/services.constants'
import prisma from '@/lib/db'

import {
  notifyAdminBookingChange,
  notifyAdminBookingDeletion,
} from './admin-booking-notifications'
import {
  getBookingDateKey,
  getDaySchedule,
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
            const [salon, schedule, bookings] = await Promise.all([
              prisma.salon.findUnique({ where: { id: SALON_ID } }),
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
            const hours =
              salon &&
              getDaySchedule(
                dateKey,
                salon.openingHours,
                salon.specialOpeningHours
              )
            const opening = hours && timeToMinutes(hours.openingHour)
            const closing = hours && timeToMinutes(hours.closingHour)
            if (
              !hours?.isOpen ||
              !schedule ||
              opening == null ||
              closing == null ||
              start < opening ||
              end > closing ||
              dateKey < getBookingDateKey(new Date())! ||
              schedule.offDays.some(
                (day) =>
                  day.person === hairdresser &&
                  getBookingDateKey(day.date) === dateKey
              )
            ) {
              return {
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
