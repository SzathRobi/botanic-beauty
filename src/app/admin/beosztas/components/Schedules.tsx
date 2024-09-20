'use client'

import { Hairdresser, Schedule } from '@prisma/client'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'
import { ChangeEvent, useEffect, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import toast from 'react-hot-toast'

import { modifySchedule } from '@/actions/schedule'
import { Button } from '@/components/Button'

import { SelectedDate } from '../types/selectedDate.type'
import Day from './Day'

type ScheduleProps = {
  schedule: Schedule | null
}

const Schedules = ({ schedule }: ScheduleProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [requestError, setRequestError] = useState<string | null>(null)

  const [selectedDates, setSelectedDates] = useState<SelectedDate[]>([])
  const [selectedPerson, setSelectedPerson] = useState<Hairdresser>('Timi')

  const dateCounts = selectedDates.reduce(
    (acc, curr) => {
      const dateString = new Date(curr.date).toISOString() // Dátum string formátumra alakítása
      acc[dateString] = (acc[dateString] || 0) + 1 // Ha még nem létezik a dátum a számoló objektumban, akkor inicializáljuk 0-val, majd hozzáadunk 1-et
      return acc
    },
    {} as { [key: string]: number }
  )

  // Kiválasztjuk azokat a dátumokat, amelyek kétszer szerepelnek a selectedDates tömbben
  const datesAppearingTwice = Object.keys(dateCounts)
    .filter((dateString) => dateCounts[dateString] === 2)
    .map((dateString) => new Date(dateString))

  const handleDayClick = (day: any) => {
    const isSelected =
      selectedDates.length &&
      selectedDates.some(
        (date) =>
          new Date(date.date).getTime() === day.date.getTime() &&
          date.person === selectedPerson
      )

    if (isSelected) {
      setSelectedDates((prevSelectedDates) =>
        prevSelectedDates.filter(
          (date) =>
            new Date(date.date).getTime() !== day.date.getTime() ||
            date.person !== selectedPerson
        )
      )
    } else {
      setSelectedDates([
        ...selectedDates,
        {
          date: day.date,
          displayMonth: day.displayMonth,
          person: selectedPerson,
        },
      ])
    }
  }

  useEffect(() => {
    setSelectedDates(schedule?.offDays ?? [])
  }, [schedule])

  const onSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()

    setRequestError(null)
    setIsLoading(true)

    try {
      await modifySchedule(selectedDates, schedule?.id ?? '')

      toast.success('A beosztás sikeresen mentve')
    } catch (error) {
      setRequestError('Failed to modify schedule')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePersonChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedPerson(event.target.value as Hairdresser)
  }

  return (
    <div>
      <DayPicker
        mode="multiple"
        selected={selectedDates.map((date) => date.date)}
        onDayClick={handleDayClick}
        numberOfMonths={3}
        weekStartsOn={1}
        components={{
          Day: (day) => (
            <Day
              day={day}
              selectedDates={selectedDates}
              selectedPerson={selectedPerson}
              handleDayClick={handleDayClick}
              datesAppearingTwice={datesAppearingTwice}
            />
          ),
        }}
        locale={hu}
        formatters={{
          formatCaption: (month, options) =>
            format(month, 'LLLL yyyy', { locale: hu }),
          formatDay: (day, options) => format(day, 'd', { locale: hu }),
          formatWeekdayName: (weekday, options) =>
            format(weekday, 'EEEEEE', { locale: hu }),
        }}
      />
      <div className="mb-8 flex gap-2">
        <input
          type="radio"
          id="Timi"
          name="person"
          value="Timi"
          checked={selectedPerson === 'Timi'}
          onChange={handlePersonChange}
        />
        <label htmlFor="Timi">Timi</label>

        <input
          type="radio"
          id="nem_Timi"
          name="person"
          value="nem_Timi"
          checked={selectedPerson === 'nem_Timi'}
          onChange={handlePersonChange}
        />
        <label htmlFor="nem_Timi">nem_Timi</label>
      </div>

      <form onSubmit={onSubmit}>
        <Button type="submit" isLoading={isLoading}>
          Mentés
        </Button>
      </form>
      {requestError && <p className="mt-4 text-red-500">{requestError}</p>}
    </div>
  )
}

export default Schedules
