import { Booking } from '@prisma/client'
import { addHours, addMinutes } from 'date-fns'

import { CalendarEvent } from '../types/calendarEvent.type'

export const mapBookingToEvent = ({
  contactInfo,
  hairdresser,
  selectedDate,
  selectedTimeSlot,
  id,
  service,
  extraServices,
  createdAt,
  updatedAt,
  bleachMaterialUsage,
  discountPercentage,
  dyeMaterialUsage,
  extraHaircutPrice,
  finalPrice,
  financeComment,
  isFinanceDone,
  isPaidWithCard,
  miracleBoosterPrice,
  tips,
  remindenEmailJobId,
}: Booking): Omit<CalendarEvent, 'start' | 'end'> & {
  start: string
  end: string
} => {
  const [startTime, endTime] = selectedTimeSlot.split(' - ')

  const [startHours, startMinutes] = startTime
    .split(':')
    .map((num) => parseInt(num))

  const start = new Date(selectedDate)

  start.setHours(startHours)
  start.setMinutes(startMinutes)
  start.setSeconds(0)
  start.setMilliseconds(0)

  const [endHours, endMinutes] = endTime.split(':').map((num) => parseInt(num))

  const end = new Date(selectedDate)

  end.setHours(endHours)
  end.setMinutes(endMinutes)
  end.setSeconds(0)
  end.setMilliseconds(0)

  return {
    id,
    title: service.name,
    start: start.toString(),
    end: end.toString(),
    hairdresser,
    contactInfo,
    service,
    extraServices,
    createdAt,
    updatedAt,
    bleachMaterialUsage: bleachMaterialUsage || undefined,
    discountPercentage: discountPercentage || undefined,
    dyeMaterialUsage: dyeMaterialUsage || undefined,
    extraHaircutPrice: extraHaircutPrice || undefined,
    finalPrice: finalPrice || undefined,
    financeComment: financeComment || undefined,
    isFinanceDone: isFinanceDone || undefined,
    isPaidWithCard: isPaidWithCard || undefined,
    miracleBoosterPrice: miracleBoosterPrice || undefined,
    tips: tips || undefined,
    remindenEmailJobId: remindenEmailJobId || undefined,
  }
}
