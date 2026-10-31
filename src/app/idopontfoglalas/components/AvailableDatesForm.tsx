'use client'

// @ts-expect-error minden tuti
import './AvailableDatesForm.override.css'

import {
  Booking,
  OpeningHour,
  Schedule,
  SpecialOpeningHour,
  TOffDay,
  TService,
} from '@prisma/client'
import {
  addDays,
  addMinutes,
  isBefore,
  isSameDay,
  isToday,
  max,
  setHours,
  setMinutes,
  startOfDay,
} from 'date-fns'
import { hu } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import { DayPicker } from 'react-day-picker'

import { Button } from '@/components/Button'
import { EXTRA_SERVICES_IDS_WITHOUT_DURATION } from '@/constants/services.constants'

import TimeSlots from './TimeSlots'

type AvailableDatesFormProps = {
  bookings: Booking[]
  selectedDate: Date
  setSelectedDate: (date: Date) => void
  selectedTimeSlot: string | null
  setSelectedTimeSlot: (timeSlot: string | null) => void
  selectedService: TService
  selectedExtraServices: TService[]
  selectedHairdresser: 'Timi' | 'nem_Timi'
  schedule: Schedule
  openingHours: OpeningHour[]
  specialOpeningHours: SpecialOpeningHour[]
  incrementActiveStep: () => void
  decrementActiveStep: () => void
}

// Segédfüggvény a nap nyitvatartásának lekérésére (speciális felülírja a normált)
export const getDaySchedule = (
  date: Date,
  openingHours: OpeningHour[],
  specialOpeningHours: SpecialOpeningHour[]
) => {
  const special = specialOpeningHours.find((s) =>
    isSameDay(new Date(s.date), date)
  )
  if (special) {
    return {
      isOpen: special.isOpen,
      openingHour: special.openingHour,
      closingHour: special.closingHour,
    }
  }

  const dayNames = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ]
  const dayName = dayNames[date.getDay()]

  const regular = openingHours.find((oh) => oh.day.toLowerCase() === dayName)
  if (regular) {
    return {
      isOpen: regular.isOpen,
      openingHour: regular.openingHour,
      closingHour: regular.closingHour,
    }
  }

  return { isOpen: false, openingHour: '10:00', closingHour: '19:00' }
}

const roundUpToNearestQuarter = (date: Date): Date => {
  const minutes = date.getMinutes()
  const remainder = minutes % 15
  if (remainder !== 0) {
    date = addMinutes(date, 15 - remainder)
  }
  return date
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
  openingHours,
  specialOpeningHours,
  decrementActiveStep,
  incrementActiveStep,
}: AvailableDatesFormProps) => {
  const now = new Date()
  const tPlus2Hours = roundUpToNearestQuarter(addMinutes(now, 120))

  const servicesWithDuration = selectedExtraServices.filter(
    (extraservice) =>
      !EXTRA_SERVICES_IDS_WITHOUT_DURATION.includes(extraservice.id)
  )

  const serviceDuration = servicesWithDuration.reduce(
    (acc, extraservice) => acc + extraservice.duration,
    selectedService.duration
  )

  const [
    datesWithNoTimeForSelectedService,
    setDatesWithNoTimeForSelectedService,
  ] = useState<Date[]>([])

  const hairdresserOffDays: Date[] = schedule.offDays
    .filter((offDay: TOffDay) => offDay.person === selectedHairdresser)
    .map((offDay: TOffDay) => offDay.date)

  const currentDaySchedule = getDaySchedule(
    selectedDate,
    openingHours,
    specialOpeningHours
  )

  const [closingH, closingM] = currentDaySchedule.closingHour
    .split(':')
    .map(Number)
  const closingTimeForToday = setMinutes(
    setHours(startOfDay(selectedDate), closingH),
    closingM
  )

  const isClosedForToday = isToday(selectedDate) && now.getHours() >= closingH

  const handleSelect = (day: Date | undefined) => {
    if (day) {
      setSelectedDate(day)
    }
  }

  const getFirstAvailableDate = (): Date => {
    let firstAvailableDate = selectedDate

    while (
      !getDaySchedule(firstAvailableDate, openingHours, specialOpeningHours)
        .isOpen ||
      hairdresserOffDays.some(
        (offDay) =>
          isSameDay(offDay, firstAvailableDate) ||
          (isClosedForToday && isToday(firstAvailableDate))
      )
    ) {
      firstAvailableDate = addDays(firstAvailableDate, 1)
    }

    return firstAvailableDate
  }

  useEffect(() => {
    setSelectedDate(getFirstAvailableDate())
  }, [])

  useEffect(() => {
    const scheduleInfo = getDaySchedule(
      selectedDate,
      openingHours,
      specialOpeningHours
    )
    if (!scheduleInfo.isOpen) {
      setSelectedDate(addDays(selectedDate, 1))
    }
  }, [selectedDate, openingHours, specialOpeningHours])

  const [openingH, openingM] = currentDaySchedule.openingHour
    .split(':')
    .map(Number)
  const openingHourForToday = setMinutes(
    setHours(startOfDay(selectedDate), openingH),
    openingM
  )

  return (
    <div className="mb-8">
      <div className="mb-12 flex flex-col items-start justify-evenly gap-4 md:flex-row">
        <DayPicker
          className="dayPicker text-sm sm:text-base md:text-lg"
          mode="single"
          selected={selectedDate}
          defaultMonth={selectedDate}
          weekStartsOn={1}
          locale={hu}
          disabled={(date) => {
            const daySchedule = getDaySchedule(
              date,
              openingHours,
              specialOpeningHours
            )
            return (
              isBefore(date, new Date(Date.now())) ||
              !daySchedule.isOpen ||
              hairdresserOffDays.some((offDay) => isSameDay(offDay, date)) ||
              datesWithNoTimeForSelectedService.some((datesWithNoTime) =>
                isSameDay(datesWithNoTime, date)
              )
            )
          }}
          onSelect={handleSelect}
        />

        <TimeSlots
          bookings={bookings}
          startTime={
            isToday(selectedDate)
              ? max([tPlus2Hours, openingHourForToday])
              : openingHourForToday
          }
          closingTime={closingTimeForToday}
          isDayOpen={currentDaySchedule.isOpen}
          interval={serviceDuration}
          isClosedForToday={isClosedForToday}
          selectedTimeSlot={selectedTimeSlot}
          setSelectedTimeSlot={setSelectedTimeSlot}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          setDatesWithNoTimeForSelectedService={
            setDatesWithNoTimeForSelectedService
          }
          isSelectedHairdresserOffDay={hairdresserOffDays.some((offDay) =>
            isSameDay(offDay, selectedDate)
          )}
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="secondary" onClick={decrementActiveStep}>
          Vissza
        </Button>
        <Button
          disabled={selectedTimeSlot === null}
          onClick={incrementActiveStep}
        >
          Tovább
        </Button>
      </div>
    </div>
  )
}

export default AvailableDatesForm
