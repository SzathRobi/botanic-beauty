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
  finalPrice: 0,
  dyeMaterialUsage: 0,
  bleachMaterialUsage: 0,
  extraHaircutPrice: 0,
  miracleBoosterPrice: 0,
  isFinanceDone: false,
  createdAt: createdAt,
  updatedAt: updatedAt,
})
