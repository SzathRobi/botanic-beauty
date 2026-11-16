import type {
  Hairdresser,
  OpeningHour,
  SpecialOpeningHour,
  TOffDay,
} from '@prisma/client'
import type { CSSProperties } from 'react'

import {
  getBookingDateKey,
  getCalendarDateKey,
  getDaySchedule,
  timeToMinutes,
} from '@/lib/guest-booking'

export type CalendarAvailabilityOptions = {
  openingHours: OpeningHour[]
  specialOpeningHours: SpecialOpeningHour[]
  offDays: TOffDay[]
  selectedHairdresser: Hairdresser | 'all'
}

export const CALENDAR_STEP_MINUTES = 15

export const getCalendarDayAvailability = (
  date: Date,
  options: CalendarAvailabilityOptions
) => {
  const dateKey = getCalendarDateKey(date)
  const hours = getDaySchedule(
    dateKey,
    options.openingHours,
    options.specialOpeningHours
  )
  const opening = hours ? timeToMinutes(hours.openingHour) : null
  const closing = hours ? timeToMinutes(hours.closingHour) : null
  const people: Hairdresser[] =
    options.selectedHairdresser === 'all'
      ? ['Timi', 'nem_Timi']
      : [options.selectedHairdresser]
  const absentCount = people.filter((person) =>
    options.offDays.some(
      (day) => day.person === person && getBookingDateKey(day.date) === dateKey
    )
  ).length
  const closed =
    !hours?.isOpen ||
    opening === null ||
    closing === null ||
    closing <= opening ||
    absentCount === people.length
  return {
    closed,
    partialStaffAbsence: !closed && absentCount > 0,
    opening,
    closing,
  }
}

type DayAvailability = ReturnType<typeof getCalendarDayAvailability>

const dayAppearance = (availability: DayAvailability) => ({
  className: availability.closed
    ? 'booking-calendar-closed-day'
    : availability.partialStaffAbsence
      ? 'booking-calendar-partial-day'
      : '',
})

export const getCalendarDayAppearance = (
  date: Date,
  options: CalendarAvailabilityOptions
) => dayAppearance(getCalendarDayAvailability(date, options))

const slotAppearance = (date: Date, availability: DayAvailability) => {
  const { closed, partialStaffAbsence, opening, closing } = availability
  const start = date.getHours() * 60 + date.getMinutes()
  const end = start + CALENDAR_STEP_MINUTES
  const fullClosed =
    closed ||
    opening === null ||
    closing === null ||
    end <= opening ||
    start >= closing
  const partialHours = !fullClosed && (start < opening! || end > closing!)
  let background = 'transparent'
  let className = ''
  if (fullClosed) {
    className = 'booking-calendar-closed-time'
    background = 'var(--booking-calendar-closed-bg)'
  } else {
    const staffBackground = partialStaffAbsence
      ? 'var(--booking-calendar-partial-bg)'
      : 'none'
    if (partialHours) {
      // Paint only the actual closed minutes when an opening boundary falls
      // between grid lines (e.g. opening 09:10 inside the 09:00–09:15 cell).
      const from = (Math.max(0, opening! - start) / CALENDAR_STEP_MINUTES) * 100
      const to =
        (Math.min(CALENDAR_STEP_MINUTES, closing! - start) /
          CALENDAR_STEP_MINUTES) *
        100
      background = `linear-gradient(to bottom, var(--booking-calendar-closed-bg) 0%, var(--booking-calendar-closed-bg) ${from}%, transparent ${from}%, transparent ${to}%, var(--booking-calendar-closed-bg) ${to}%, var(--booking-calendar-closed-bg) 100%), ${staffBackground}`
      className = 'booking-calendar-partial-time'
    } else if (partialStaffAbsence) {
      className = 'booking-calendar-partial-staff-time'
      background = staffBackground
    }
  }
  // The time gutter also receives slotPropGetter. Use a CSS variable, consumed
  // only inside day columns, so the clock labels never inherit a day's closure.
  return {
    className,
    style: { '--booking-calendar-slot-bg': background } as CSSProperties,
  }
}

export const getCalendarSlotAppearance = (
  date: Date,
  options: CalendarAvailabilityOptions
) => slotAppearance(date, getCalendarDayAvailability(date, options))

export const createCalendarAppearanceGetters = (
  options: CalendarAvailabilityOptions
) => {
  const days = new Map<string, DayAvailability>()
  const getDay = (date: Date) => {
    const key = getCalendarDateKey(date)
    let day = days.get(key)
    if (!day) {
      day = getCalendarDayAvailability(date, options)
      days.set(key, day)
    }
    return day
  }
  // A 24-hour week contains hundreds of cells, but each day's schedule/off days
  // need resolving only once. The component recreates this cache when props change.
  return {
    dayPropGetter: (date: Date) => dayAppearance(getDay(date)),
    slotPropGetter: (date: Date) => slotAppearance(date, getDay(date)),
  }
}
