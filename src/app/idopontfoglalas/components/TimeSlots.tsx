'use client'

import { Booking } from '@prisma/client'
import {
  addDays,
  addMinutes,
  format,
  isSameDay,
  isSunday,
  isToday,
  setDate,
  setHours,
  setMinutes,
  startOfDay,
} from 'date-fns'
import { useEffect, useMemo } from 'react'

type TimeSlotsProps = {
  bookings: Booking[]
  startTime: Date
  endTime: number
  interval: number
  isClosedDay: boolean
  isClosedForToday: boolean
  selectedTimeSlot: string | null
  setSelectedTimeSlot: (timeSlot: string) => void
  selectedDate: Date
  setDatesWithNoTimeForSelectedService: (stuff: any) => any
  setSelectedDate: (date: Date) => void
  isSelectedHairdresserOffDay: boolean
}

const getBookingStartAndEndDate = (
  selectedDate: string | Date,
  selectedTimeSlot: string
): {
  start: Date
  end: Date
} => {
  const baseDate = startOfDay(selectedDate)

  const [startTime, endTime] = selectedTimeSlot.split(' - ')
  const [startHour, startMinute] = startTime.split(':').map(Number)
  const [endHour, endMinute] = endTime.split(':').map(Number)

  const start = setMinutes(setHours(baseDate, startHour), startMinute)
  const end = setMinutes(setHours(baseDate, endHour), endMinute)

  return { start, end }
}

const roundUpToNearestQuarter = (date: Date): Date => {
  const minutes = date.getMinutes()
  const remainder = minutes % 15
  if (remainder !== 0) {
    date = addMinutes(date, 15 - remainder)
  }
  return date
}

const TimeSlots = ({
  startTime,
  endTime,
  interval,
  isClosedDay,
  isClosedForToday,
  selectedTimeSlot,
  setSelectedTimeSlot,
  selectedDate,
  setDatesWithNoTimeForSelectedService,
  setSelectedDate,
  bookings,
  isSelectedHairdresserOffDay,
}: TimeSlotsProps) => {
  const isInvalidDate =
    isSunday(selectedDate) ||
    isSelectedHairdresserOffDay ||
    isClosedDay ||
    (isToday(selectedDate) && isClosedForToday)

  const bookingsForSelectedDay = useMemo(() => {
    return bookings.filter((booking) =>
      isSameDay(booking.selectedDate, selectedDate)
    )
  }, [bookings, selectedDate])

  // 3. Elérhető időpontok kiszámolása (render-biztos módon)
  const availableTimeSlots = useMemo(() => {
    // Ha a nap alapból zárva van, ne is számoljunk időpontokat
    if (isInvalidDate) return []

    const isOverlappingDate = (time: Date): boolean => {
      const startDate = setDate(time, selectedDate.getDate())
      const endDate = addMinutes(startDate, interval)

      return bookingsForSelectedDay.some((booking) => {
        const { start, end } = getBookingStartAndEndDate(
          booking.selectedDate,
          booking.selectedTimeSlot
        )

        return (
          (startDate >= start && startDate < end) || // Új kezdete ütközik
          (endDate > start && endDate <= end) || // Új vége ütközik
          (startDate <= start && endDate >= end) // Új lefedi a meglévőt
        )
      })
    }

    const slots: string[] = []
    let currentTime = roundUpToNearestQuarter(startTime)
    const endOfDay = setHours(startOfDay(selectedDate), endTime)

    while (currentTime < endOfDay) {
      const endTimeSlot = addMinutes(currentTime, interval)

      if (endTimeSlot > endOfDay) {
        break
      }

      if (!isOverlappingDate(currentTime)) {
        const timeSlotText = `${format(currentTime, 'HH:mm')} - ${format(
          endTimeSlot,
          'HH:mm'
        )}`
        slots.push(timeSlotText)
      }

      currentTime = addMinutes(currentTime, 15)
    }

    return slots
  }, [
    startTime,
    endTime,
    interval,
    selectedDate,
    isInvalidDate,
    bookingsForSelectedDay,
  ])

  // 4. A mellékhatások (state módosítások, nap ugratása) biztonságos helyen
  useEffect(() => {
    if (isInvalidDate) {
      setSelectedDate(addDays(selectedDate, 1))
      return
    }

    // Ha nincs isInvalidDate, de az adott napra már elfogyott minden időpont
    if (availableTimeSlots.length === 0) {
      setDatesWithNoTimeForSelectedService((prevDates: any) => [
        ...prevDates,
        selectedDate,
      ])
      setSelectedDate(addDays(selectedDate, 1))
    }
  }, [
    isInvalidDate,
    availableTimeSlots.length,
    selectedDate,
    setSelectedDate,
    setDatesWithNoTimeForSelectedService,
  ])

  return (
    <div>
      <div className="mb-2 h-6 opacity-0" />
      <div className="time-slots-container grid grid-cols-3 gap-4">
        {availableTimeSlots.map((timeSlotText) => (
          <button
            key={timeSlotText}
            onClick={() => setSelectedTimeSlot(timeSlotText)}
            // Javítva egy apró css bug: az eredetiben a "false" kiíródhatott a classnevek közé
            className={`p-2 ${isClosedDay ? 'cursor-not-allowed opacity-50' : ''} ${
              selectedTimeSlot === timeSlotText
                ? 'bg-emerald-600/40'
                : 'bg-black/50'
            } transition`}
            disabled={isClosedDay}
          >
            {timeSlotText}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TimeSlots
