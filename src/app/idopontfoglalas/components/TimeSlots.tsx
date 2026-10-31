'use client'

import { Booking } from '@prisma/client'
import {
  addDays,
  addMinutes,
  format,
  isSameDay,
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
  closingTime: Date
  isDayOpen: boolean
  interval: number
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
  closingTime,
  isDayOpen,
  interval,
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
    !isDayOpen ||
    isSelectedHairdresserOffDay ||
    (isToday(selectedDate) && isClosedForToday)

  const bookingsForSelectedDay = useMemo(() => {
    return bookings.filter((booking) =>
      isSameDay(booking.selectedDate, selectedDate)
    )
  }, [bookings, selectedDate])

  // Elérhető időpontok kiszámolása
  const availableTimeSlots = useMemo(() => {
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
          (startDate >= start && startDate < end) ||
          (endDate > start && endDate <= end) ||
          (startDate <= start && endDate >= end)
        )
      })
    }

    const slots: string[] = []
    let currentTime = roundUpToNearestQuarter(startTime)

    while (currentTime < closingTime) {
      const endTimeSlot = addMinutes(currentTime, interval)

      if (endTimeSlot > closingTime) {
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
    closingTime,
    interval,
    selectedDate,
    isInvalidDate,
    bookingsForSelectedDay,
  ])

  // Mellékhatások kezelése
  useEffect(() => {
    if (isInvalidDate) {
      setSelectedDate(addDays(selectedDate, 1))
      return
    }

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
            className={`p-2 ${
              selectedTimeSlot === timeSlotText
                ? 'bg-emerald-600/40'
                : 'bg-black/50'
            } transition`}
          >
            {timeSlotText}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TimeSlots
