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
}: Booking): CalendarEvent => {
  const [startTime, endTime] = selectedTimeSlot.split(' - ')

  const [startHours, startMinutes] = startTime
    .split(':')
    .map((num) => parseInt(num))

  const startDateWithTime = addMinutes(
    addHours(selectedDate, startHours),
    startMinutes
  )

  const [endHours, endMinutes] = endTime.split(':').map((num) => parseInt(num))

  const endDateWithTime = addMinutes(
    addHours(selectedDate, endHours),
    endMinutes
  )

  return {
    id,
    title: service.name,
    start: startDateWithTime,
    end: endDateWithTime,
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
  }
}
