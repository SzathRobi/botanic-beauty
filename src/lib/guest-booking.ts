import type {
  Booking,
  Hairdresser,
  OpeningHour,
  SpecialOpeningHour,
  TOffDay,
  TService,
} from '@prisma/client'

export type BookingAvailability = Pick<
  Booking,
  'selectedDate' | 'selectedTimeSlot' | 'hairdresser'
>

const salonDateFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Budapest',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
})

const getSalonParts = (date: Date) =>
  Object.fromEntries(
    salonDateFormatter
      .formatToParts(date)
      .map(({ type, value }) => [type, value])
  )

export const getCalendarDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

export const getBookingDateKey = (value: string | Date): string | null => {
  if (typeof value === 'string' && /^\d{4}-\d{1,2}-\d{1,2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number)
    const date = new Date(Date.UTC(year, month - 1, day))
    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      return null
    }
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  // Existing admin bookings can contain ISO strings or Date.toString() values.
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) return null
  const parts = getSalonParts(date)
  return `${parts.year}-${parts.month}-${parts.day}`
}

export const dateFromCalendarKey = (key: string) => {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export const timeToMinutes = (time: string): number | null => {
  if (!/^\d{1,2}:\d{2}$/.test(time)) return null
  const [hours, minutes] = time.split(':').map(Number)
  return hours < 24 && minutes < 60 ? hours * 60 + minutes : null
}

const formatTime = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`

export const getDaySchedule = (
  dateKey: string,
  openingHours: OpeningHour[],
  specialOpeningHours: SpecialOpeningHour[]
) => {
  const special = specialOpeningHours.find(
    (hours) => getBookingDateKey(hours.date) === dateKey
  )
  if (special) return special

  const weekdays = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ]
  const weekday = weekdays[new Date(`${dateKey}T12:00:00Z`).getUTCDay()]
  return openingHours.find((hours) => hours.day.toLowerCase() === weekday)
}

export const getGuestServiceDuration = (
  service: TService,
  extraServices: TService[]
) =>
  service.duration +
  extraServices.reduce((sum, extra) => sum + extra.duration, 0)

export type AvailabilityOptions = {
  bookings: BookingAvailability[]
  openingHours: OpeningHour[]
  specialOpeningHours: SpecialOpeningHour[]
  offDays: TOffDay[]
  hairdresser: Hairdresser
  duration: number
  now: Date
}

export const getAvailableTimeSlots = (
  dateKey: string,
  options: AvailabilityOptions
): string[] => {
  const {
    bookings,
    openingHours,
    specialOpeningHours,
    offDays,
    hairdresser,
    duration,
    now,
  } = options
  const today = getBookingDateKey(now)
  if (
    !today ||
    getBookingDateKey(dateKey) !== dateKey ||
    dateKey < today ||
    !Number.isFinite(duration) ||
    duration <= 0 ||
    offDays.some(
      (day) =>
        day.person === hairdresser && getBookingDateKey(day.date) === dateKey
    )
  )
    return []

  const schedule = getDaySchedule(dateKey, openingHours, specialOpeningHours)
  if (!schedule?.isOpen) return []
  const opening = timeToMinutes(schedule.openingHour)
  const closing = timeToMinutes(schedule.closingHour)
  if (opening === null || closing === null || closing <= opening) return []

  const nowParts = getSalonParts(now)
  const earliest =
    dateKey === today
      ? Number(nowParts.hour) * 60 +
        Number(nowParts.minute) +
        Number(nowParts.second) / 60 +
        now.getMilliseconds() / 60000 +
        120
      : 0
  const dayBookings = bookings.filter(
    (booking) =>
      booking.hairdresser === hairdresser &&
      getBookingDateKey(booking.selectedDate) === dateKey
  )
  const slots: string[] = []
  for (
    let start = Math.ceil(Math.max(opening, earliest) / 15) * 15;
    start + duration <= closing;
    start += 15
  ) {
    const end = start + duration
    const overlaps = dayBookings.some((booking) => {
      const [startTime, endTime] = booking.selectedTimeSlot.split(' - ')
      const existingStart = timeToMinutes(startTime ?? '')
      const existingEnd = timeToMinutes(endTime ?? '')
      return (
        existingStart !== null &&
        existingEnd !== null &&
        start < existingEnd &&
        end > existingStart
      )
    })
    if (!overlaps) slots.push(`${formatTime(start)} - ${formatTime(end)}`)
  }
  return slots
}

export const findNextAvailableDate = (
  fromDate: string,
  options: AvailabilityOptions,
  maxDays = 366
): string | null => {
  if (getBookingDateKey(fromDate) !== fromDate) return null
  const date = new Date(`${fromDate}T12:00:00Z`)
  for (let day = 0; day < maxDays; day++) {
    const key = date.toISOString().slice(0, 10)
    if (getAvailableTimeSlots(key, options).length > 0) return key
    date.setUTCDate(date.getUTCDate() + 1)
  }
  return null
}

export const getGuestBookingStart = (
  booking: BookingAvailability
): Date | null => {
  const dateKey = getBookingDateKey(booking.selectedDate)
  const startMinutes = timeToMinutes(booking.selectedTimeSlot.split(' - ')[0])
  if (!dateKey || startMinutes === null) return null
  const [year, month, day] = dateKey.split('-').map(Number)
  const target = Date.UTC(
    year,
    month - 1,
    day,
    Math.floor(startMinutes / 60),
    startMinutes % 60
  )
  let instant = target
  // Resolve the Budapest offset for both summer and winter time without a new dependency.
  for (let attempt = 0; attempt < 2; attempt++) {
    const parts = getSalonParts(new Date(instant))
    const local = Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      Number(parts.hour),
      Number(parts.minute),
      Number(parts.second)
    )
    instant += target - local
  }
  return new Date(instant)
}

export const getGuestReminderDelay = (
  booking: BookingAvailability,
  now = new Date()
): number | null => {
  const start = getGuestBookingStart(booking)
  if (!start) return null
  const delay =
    Math.floor((start.getTime() - now.getTime()) / 1000) - 2 * 60 * 60
  // Keep the existing minimum notice period for guest reminders.
  return delay >= 4 * 60 * 60 ? delay : null
}
