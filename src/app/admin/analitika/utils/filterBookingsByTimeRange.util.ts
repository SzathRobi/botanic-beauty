import {
  addMonths,
  endOfMonth,
  endOfWeek,
  isToday,
  isWithinInterval,
  startOfMonth,
  startOfWeek,
} from 'date-fns'

import { TimeRange } from '../types/timeRange.type'

export const filterBookingsByTimeRange = (
  bookingDate: string,
  timeRange?: TimeRange
) => {
  const bookingDateObj = new Date(bookingDate)

  const now = new Date()

  switch (timeRange) {
    case 'day':
      return isToday(bookingDateObj)
    case 'week':
      return isWithinInterval(bookingDateObj, {
        start: startOfWeek(now),
        end: endOfWeek(now),
      })
    case 'month':
      return isWithinInterval(bookingDateObj, {
        start: startOfMonth(now),
        end: endOfMonth(now),
      })
    case '3month':
      return isWithinInterval(bookingDateObj, {
        start: startOfMonth(addMonths(now, -3)), // Három hónappal korábbi dátum
        end: endOfMonth(now),
      })
    default:
      return false
  }
}
