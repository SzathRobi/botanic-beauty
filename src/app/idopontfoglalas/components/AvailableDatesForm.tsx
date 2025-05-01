'use client'

import './AvailableDatesForm.override.css'

import { Booking, Schedule, TOffDay, TService } from '@prisma/client'
import {
  addDays,
  addMinutes,
  isBefore,
  isSameDay,
  isSaturday,
  isSunday,
  isToday,
  setHours,
  setMinutes,
  startOfDay,
} from 'date-fns'
import { hu } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import { DayPicker } from 'react-day-picker'

import { Button } from '@/components/Button'
import { EXTRA_SERVICES_IDS_WITHOUT_DURATION } from '@/constants/services.constants'

import {
  CLOSING_HOUR,
  LAST_BOOKING_HOUR,
  OPENING_HOUR,
} from '../constants/openingHours.constants'
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
  incrementActiveStep: () => void
  decrementActiveStep: () => void
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
  decrementActiveStep,
  incrementActiveStep,
}: AvailableDatesFormProps) => {
  const now = new Date()
  const tPlus2Hours = roundUpToNearestQuarter(addMinutes(now, 120))
  // TODO: ide kell majd az új extra service is
  // const serviceDuration = selectedExtraServices
  //   ? selectedExtraServices[0].duration + selectedService.duration
  //   : selectedService.duration

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
  const isClosedForToday = selectedDate.getHours() >= LAST_BOOKING_HOUR

  const [isClosedDay, setIsClosedDay] = useState<boolean>(false)

  const handleSelect = (day: Date | undefined) => {
    if (day) {
      setSelectedDate(day)
    }
  }

  const getFirstAvailableDate = (): Date => {
    let firstAvailableDate = selectedDate

    while (
      isSunday(firstAvailableDate) ||
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
    if (isClosedDay) {
      setSelectedTimeSlot(null)
    }
  }, [isClosedDay])

  useEffect(() => {
    setSelectedDate(getFirstAvailableDate())
  }, [])

  const getOpeningHour = () => {
    const date = startOfDay(selectedDate)
    return setMinutes(setHours(date, OPENING_HOUR), 0)
  }

  return (
    <div className="mb-8">
      <div className="mb-12 flex flex-col items-start justify-evenly gap-4 md:flex-row">
        <DayPicker
          className="dayPicker text-sm sm:text-base md:text-lg"
          mode="single"
          selected={selectedDate}
          // TODO / high: change to selectedDate
          defaultMonth={selectedDate}
          weekStartsOn={1}
          locale={hu}
          disabled={(date) =>
            isBefore(date, new Date(Date.now())) ||
            // isBeforeAug1(date) ||
            isClosedDay ||
            isSunday(date) ||
            isSaturday(date) ||
            hairdresserOffDays.some((offDay) => isSameDay(offDay, date)) ||
            datesWithNoTimeForSelectedService.some((datesWithNoTime) =>
              isSameDay(datesWithNoTime, date)
            )
          }
          onSelect={handleSelect}
        />
        <TimeSlots
          bookings={bookings}
          startTime={isToday(selectedDate) ? tPlus2Hours : getOpeningHour()}
          endTime={CLOSING_HOUR}
          interval={serviceDuration}
          isClosedDay={isClosedDay}
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
