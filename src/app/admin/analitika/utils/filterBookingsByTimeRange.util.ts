import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  isToday,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { DateRange } from 'react-day-picker'

import { TimeRange } from '../types/timeRange.type'

export const filterBookingsByTimeRange = (
  bookingDate: string,
  timeRange?: TimeRange,
  dateRange?: DateRange
) => {
  const bookingDateObj = new Date(bookingDate)
  const now = new Date()

  switch (timeRange) {
    case 'day':
      return isToday(bookingDateObj)

    case 'week':
      return isWithinInterval(bookingDateObj, {
        start: startOfWeek(now, { weekStartsOn: 1 }),
        end: endOfWeek(now, { weekStartsOn: 1 }),
      })

    case 'month':
      return isWithinInterval(bookingDateObj, {
        start: startOfMonth(now),
        end: endOfMonth(now),
      })

    case 'custom': {
      const { from, to } = dateRange || {}

      // ha nincs semmi -> mai nap
      if (!from && !to) {
        return isToday(bookingDateObj)
      }

      // ha csak from van -> to = from
      if (from && !to) {
        return isWithinInterval(bookingDateObj, {
          start: startOfDay(from),
          end: endOfDay(from),
        })
      }

      // ha from + to van
      if (from && to) {
        return isWithinInterval(bookingDateObj, {
          start: startOfDay(from),
          end: endOfDay(to),
        })
      }

      return false
    }

    default:
      return false
  }
}
