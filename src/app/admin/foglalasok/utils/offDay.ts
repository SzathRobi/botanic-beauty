import { TOffDay } from '@prisma/client'

import { getBookingDateKey, getCalendarDateKey } from '@/lib/guest-booking'

export const isOffDayOfTimi = (date: Date, offDays: TOffDay[]): boolean =>
  offDays.some(
    (day) =>
      day.person === 'Timi' &&
      getBookingDateKey(day.date) === getCalendarDateKey(date)
  )

export const isOffDayOfNemTimi = (date: Date, offDays: TOffDay[]): boolean =>
  offDays.some(
    (day) =>
      day.person === 'nem_Timi' &&
      getBookingDateKey(day.date) === getCalendarDateKey(date)
  )
