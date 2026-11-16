'use client'

// @ts-expect-error Next.js loads this stylesheet.
import './AvailableDatesForm.override.css'

import {
  OpeningHour,
  SpecialOpeningHour,
  TOffDay,
  TService,
} from '@prisma/client'
import { hu } from 'date-fns/locale'
import { useEffect, useMemo, useRef, useState } from 'react'
import { DayPicker } from 'react-day-picker'

import { Button } from '@/components/Button'
import {
  BookingAvailability,
  dateFromCalendarKey,
  findNextAvailableDate,
  getAvailableTimeSlots,
  getBookingDateKey,
  getCalendarDateKey,
  getDaySchedule,
  getGuestServiceDuration,
} from '@/lib/guest-booking'

import TimeSlots from './TimeSlots'

type AvailableDatesFormProps = {
  bookings: BookingAvailability[]
  selectedDate: Date
  setSelectedDate: (date: Date) => void
  selectedTimeSlot: string | null
  setSelectedTimeSlot: (timeSlot: string | null) => void
  selectedService: TService
  selectedExtraServices: TService[]
  selectedHairdresser: 'Timi' | 'nem_Timi'
  schedule: { offDays: TOffDay[] }
  isBookingConfigured: boolean
  openingHours: OpeningHour[]
  specialOpeningHours: SpecialOpeningHour[]
  incrementActiveStep: () => void
  decrementActiveStep: () => void
}

const AvailableDatesForm = ({
  bookings,
  selectedDate,
  setSelectedDate,
  selectedTimeSlot,
  setSelectedTimeSlot,
  selectedService,
  selectedExtraServices,
  selectedHairdresser,
  schedule,
  isBookingConfigured,
  openingHours,
  specialOpeningHours,
  decrementActiveStep,
  incrementActiveStep,
}: AvailableDatesFormProps) => {
  const [now, setNow] = useState(() => new Date())
  const [month, setMonth] = useState(selectedDate)
  const initialized = useRef(false)
  const dateKey = getCalendarDateKey(selectedDate)
  const duration = getGuestServiceDuration(
    selectedService,
    selectedExtraServices
  )
  const options = useMemo(
    () => ({
      bookings,
      openingHours,
      specialOpeningHours,
      offDays: schedule.offDays,
      hairdresser: selectedHairdresser,
      duration,
      now,
    }),
    [
      bookings,
      openingHours,
      specialOpeningHours,
      schedule.offDays,
      selectedHairdresser,
      duration,
      now,
    ]
  )
  const timeSlots = useMemo(
    () => (isBookingConfigured ? getAvailableTimeSlots(dateKey, options) : []),
    [dateKey, options, isBookingConfigured]
  )
  const canContinue =
    selectedTimeSlot !== null && timeSlots.includes(selectedTimeSlot)

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (initialized.current || !isBookingConfigured) return
    initialized.current = true
    const today = getBookingDateKey(now)!
    const firstDate = findNextAvailableDate(
      dateKey < today ? today : dateKey,
      options
    )
    if (firstDate && firstDate !== dateKey) {
      setSelectedTimeSlot(null)
      setSelectedDate(dateFromCalendarKey(firstDate))
    }
  }, [
    dateKey,
    isBookingConfigured,
    now,
    options,
    setSelectedDate,
    setSelectedTimeSlot,
  ])

  useEffect(() => {
    setMonth(selectedDate)
  }, [selectedDate])

  useEffect(() => {
    if (selectedTimeSlot !== null && !timeSlots.includes(selectedTimeSlot)) {
      setSelectedTimeSlot(null)
    }
  }, [selectedTimeSlot, timeSlots, setSelectedTimeSlot])

  const handleSelect = (day: Date | undefined) => {
    if (day && getCalendarDateKey(day) !== dateKey) {
      setSelectedTimeSlot(null)
      setSelectedDate(day)
    }
  }

  return (
    <div className="mb-8">
      {!isBookingConfigured ? (
        <p role="status" className="mb-8">
          Az online foglalás jelenleg nem elérhető. Kérlek próbáld meg később.
        </p>
      ) : (
        <div className="mb-12 flex flex-col items-start justify-evenly gap-4 md:flex-row">
          <DayPicker
            className="dayPicker text-sm sm:text-base md:text-lg"
            mode="single"
            selected={selectedDate}
            month={month}
            onMonthChange={setMonth}
            weekStartsOn={1}
            locale={hu}
            disabled={(date) => {
              const key = getCalendarDateKey(date)
              return (
                key < getBookingDateKey(now)! ||
                !getDaySchedule(key, openingHours, specialOpeningHours)
                  ?.isOpen ||
                schedule.offDays.some(
                  (day) =>
                    day.person === selectedHairdresser &&
                    getBookingDateKey(day.date) === key
                )
              )
            }}
            onSelect={handleSelect}
          />
          <TimeSlots
            timeSlots={timeSlots}
            selectedTimeSlot={selectedTimeSlot}
            setSelectedTimeSlot={setSelectedTimeSlot}
          />
        </div>
      )}
      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="secondary" onClick={decrementActiveStep}>
          Vissza
        </Button>
        <Button
          disabled={!canContinue}
          onClick={() => {
            if (canContinue) incrementActiveStep()
          }}
        >
          Tovább
        </Button>
      </div>
    </div>
  )
}

export default AvailableDatesForm
