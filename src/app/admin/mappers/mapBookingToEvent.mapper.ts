import { Booking } from '@prisma/client'

import { dateFromCalendarKey, getBookingDateKey } from '@/lib/guest-booking'

import { CalendarEvent } from '../types/calendarEvent.type'

export const mapBookingToEvent = (booking: Booking): CalendarEvent => {
  const key = getBookingDateKey(booking.selectedDate)
  if (!key) throw new Error('Invalid booking date')
  const [startText, endText] = booking.selectedTimeSlot.split(' - ')
  const createTime = (text: string) => {
    const date = dateFromCalendarKey(key)
    const [hours, minutes] = text.split(':').map(Number)
    date.setHours(hours, minutes, 0, 0)
    return date
  }
  return {
    id: booking.id,
    title: booking.service.name,
    start: createTime(startText),
    end: createTime(endText),
    hairdresser: booking.hairdresser,
    contactInfo: booking.contactInfo,
    service: booking.service,
    extraServices: booking.extraServices,
    createdAt: new Date(booking.createdAt),
    updatedAt: new Date(booking.updatedAt),
    bleachMaterialUsage: booking.bleachMaterialUsage ?? undefined,
    discountPercentage: booking.discountPercentage ?? undefined,
    dyeMaterialUsage: booking.dyeMaterialUsage ?? undefined,
    extraHaircutPrice: booking.extraHaircutPrice ?? undefined,
    finalPrice: booking.finalPrice ?? undefined,
    financeComment: booking.financeComment ?? undefined,
    isFinanceDone: booking.isFinanceDone ?? undefined,
    isPaidWithCard: booking.isPaidWithCard ?? undefined,
    miracleBoosterPrice: booking.miracleBoosterPrice ?? undefined,
    tips: booking.tips ?? undefined,
    remindenEmailJobId: booking.remindenEmailJobId ?? undefined,
  }
}
