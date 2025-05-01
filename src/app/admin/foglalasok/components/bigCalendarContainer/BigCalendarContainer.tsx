'use client'

import { TOffDay } from '@prisma/client'
import { format, isSunday } from 'date-fns'
import { useState } from 'react'
import { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop'
import toast from 'react-hot-toast'

import { getSecondsToDate } from '@/app/idopontfoglalas/utils/getSecondsToDate'

import { mapEventToBooking } from '../../../mappers/mapEventToBooking.mapper'
import { CalendarEvent } from '../../../types/calendarEvent.type'
import { isOffDayOfNemTimi, isOffDayOfTimi } from '../../utils/offDay'
import BigCalendar from '../bigCalendar/BigCalendar'

type BigCalendarContainerProps = {
  events: CalendarEvent[]
  offDays: TOffDay[]
  bookingsByEmail: Record<string, number>
}

export type SelectedHairdresser = 'all' | 'Timi' | 'nem_Timi'

const BigCalendarContainer = ({
  events,
  offDays,
  bookingsByEmail,
}: BigCalendarContainerProps) => {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(events)
  const [calendarEventsBackup, setCalendarEventsBackup] =
    useState<CalendarEvent[]>(events)
  const [selectedHairdresser, setSelectedHairdresser] =
    useState<SelectedHairdresser>('all')

  const handleHairdresserChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value as SelectedHairdresser
    setSelectedHairdresser(value)
    if (value === 'all') {
      setCalendarEvents(calendarEventsBackup)
    } else if (value === 'nem_Timi') {
      setCalendarEvents(
        calendarEventsBackup.filter(
          (calendarEvent) => calendarEvent.hairdresser !== 'Timi'
        )
      )
    } else if (value === 'Timi') {
      setCalendarEvents(
        calendarEventsBackup.filter(
          (calendarEvent) => calendarEvent.hairdresser === 'Timi'
        )
      )
    }
  }

  const updateEvent = async (event: CalendarEvent) => {
    const booking = mapEventToBooking(event)

    try {
      const response = await fetch('/api/booking', {
        method: 'PATCH',
        body: JSON.stringify(booking),
      })
      const data = await response.json()

      const emailResponse = await fetch('/api/email/modifier', {
        method: 'POST',
        body: JSON.stringify({
          booking: {
            ...booking,
            selectedDate: format(booking.selectedDate, 'yyyy-MM-dd'),
          },
        }),
      })

      const emailDelayInMiliseconds = getSecondsToDate(booking) * 1000

      const emailScheduleResponse = await fetch('/api/email/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking: {
            ...booking,
            selectedDate: format(booking.selectedDate, 'yyyy-MM-dd'),
          },
          emailDelayInMiliseconds,
        }),
      })

      if (!emailResponse.ok) {
        toast.error('A módosító email nem ment ki')
      }

      return { data, success: true }
    } catch (error) {
      toast.error('Hiba történt, a módosítás sikertelen')
      return { data: null, error: true }
    }
  }

  const onEventDrop = (dragEvent: EventInteractionArgs<CalendarEvent>) => {
    const { end, event, start } = dragEvent

    if (
      isSunday(start) ||
      (isOffDayOfNemTimi(new Date(start), offDays) &&
        event.hairdresser === 'nem_Timi') ||
      (isOffDayOfTimi(new Date(start), offDays) && event.hairdresser === 'Timi')
    ) {
      return
    }

    let modifiedEvent: CalendarEvent | undefined

    const modifiedEvents: CalendarEvent[] = calendarEvents.map(
      (calendarEvent: CalendarEvent) => {
        if (calendarEvent.id === event.id) {
          modifiedEvent = { ...calendarEvent, start, end } as CalendarEvent

          return modifiedEvent
        }

        return calendarEvent
      }
    )

    if (modifiedEvent) {
      const loaderEvent = { ...modifiedEvent, isLoaderEvent: true }
      setCalendarEvents([...modifiedEvents, loaderEvent])
      updateEvent(modifiedEvent)
        .then((response) => {
          if (!response.success) {
            return
          }

          const calendarEvents = modifiedEvents.filter(
            (calendarEvent) => calendarEvent.isLoaderEvent !== true
          )

          setCalendarEvents(calendarEvents)
          setCalendarEventsBackup(calendarEvents)
        })
        .catch(() => {
          toast.error('Hiba történt, a módosítás sikertelen')

          const calendarEvents = modifiedEvents.filter(
            (calendarEvent) => calendarEvent.isLoaderEvent !== true
          )

          setCalendarEvents(calendarEvents)
          setCalendarEventsBackup(calendarEvents)
        })
    }
  }

  return (
    <div className="max-w-[100vw] overflow-scroll md:overflow-hidden">
      <div className="mb-8 flex gap-4">
        <div>
          <input
            type="radio"
            name="hairdresser"
            value="Timi"
            id="hairdresser-timi"
            defaultChecked={selectedHairdresser === 'Timi'}
            onChange={handleHairdresserChange}
          />

          <label htmlFor="hairdresser-timi">Timi</label>
        </div>
        <div>
          <input
            type="radio"
            name="hairdresser"
            value="nem_Timi"
            id="hairdresser-nem-timi"
            defaultChecked={selectedHairdresser === 'nem_Timi'}
            onChange={handleHairdresserChange}
          />

          <label htmlFor="hairdresser-nem-timi">nem Timi</label>
        </div>
        <div>
          <input
            type="radio"
            name="hairdresser"
            value="all"
            id="hairdresser-all"
            defaultChecked={selectedHairdresser === 'all'}
            onChange={handleHairdresserChange}
          />

          <label htmlFor="hairdresser-all">mindenki</label>
        </div>
      </div>

      <BigCalendar
        calendarEvents={calendarEvents}
        setCalendarEvents={setCalendarEvents}
        onEventDrop={onEventDrop}
        offDays={offDays}
        selectedHairdresser={selectedHairdresser}
        bookingsByEmail={bookingsByEmail}
      />
    </div>
  )
}

export default BigCalendarContainer
