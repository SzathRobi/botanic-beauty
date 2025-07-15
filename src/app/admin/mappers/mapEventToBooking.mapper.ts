import { Booking } from '@prisma/client'
import { format } from 'date-fns'

import { CalendarEvent } from '../types/calendarEvent.type'

export const mapEventToBooking = ({
  contactInfo,
  createdAt,
  hairdresser,
  id,
  service,
  extraServices,
  updatedAt,
  start,
  end,
  finalPrice,
  isFinanceDone,
  discountPercentage,
  tips,
  isPaidWithCard,
  financeComment,
  bleachMaterialUsage,
  dyeMaterialUsage,
  extraHaircutPrice,
  miracleBoosterPrice,
}: CalendarEvent): Booking => ({
  selectedDate:
    new Date(
      start!.getFullYear(),
      start!.getMonth(),
      start!.getDate()
    )?.toISOString() ?? '',
  contactInfo: contactInfo,
  hairdresser: hairdresser,
  service,
  extraServices,
  selectedTimeSlot: `${format(start!, 'HH:mm')} - ${format(end!, 'HH:mm')}`,
  id,
  finalPrice: finalPrice ?? null,
  dyeMaterialUsage: dyeMaterialUsage ?? null,
  bleachMaterialUsage: bleachMaterialUsage ?? null,
  extraHaircutPrice: extraHaircutPrice ?? null,
  miracleBoosterPrice: miracleBoosterPrice ?? null,
  isFinanceDone: isFinanceDone ?? false,
  createdAt: createdAt,
  updatedAt: updatedAt,
  financeComment: financeComment ?? null,
  isPaidWithCard: isPaidWithCard ?? null,
  discountPercentage: discountPercentage ?? null,
  tips: tips ?? null,
})
