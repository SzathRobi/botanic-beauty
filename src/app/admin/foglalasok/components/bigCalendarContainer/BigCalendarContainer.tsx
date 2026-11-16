'use client'

import {
  Booking,
  OpeningHour,
  SpecialOpeningHour,
  TOffDay,
} from '@prisma/client'
import { format } from 'date-fns'
import { useMemo, useRef, useState } from 'react'
import { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop'
import toast from 'react-hot-toast'

import { mapBookingToEvent } from '@/app/admin/mappers/mapBookingToEvent.mapper'
import { getCalendarDateKey } from '@/lib/guest-booking'

import { CalendarEvent } from '../../../types/calendarEvent.type'
import { getNotificationWarning, updateBooking } from '../../utils/bookingApi'
import BigCalendar from '../bigCalendar/BigCalendar'

type BigCalendarContainerProps = {
  offDays: TOffDay[]
  openingHours: OpeningHour[]
  specialOpeningHours: SpecialOpeningHour[]
  bookingsByEmail: Record<string, number>
  bookings: Booking[]
}

export type SelectedHairdresser = 'all' | 'Timi' | 'nem_Timi'

const BigCalendarContainer = ({
  offDays,
  openingHours,
  specialOpeningHours,
  bookingsByEmail,
  bookings,
}: BigCalendarContainerProps) => {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() =>
    bookings.map(mapBookingToEvent)
  )
  const [selectedHairdresser, setSelectedHairdresser] =
    useState<SelectedHairdresser>('all')
  const pending = useRef(new Set<string>())
  const visibleEvents = useMemo(
    () =>
      selectedHairdresser === 'all'
        ? calendarEvents
        : calendarEvents.filter(
            (event) => event.hairdresser === selectedHairdresser
          ),
    [calendarEvents, selectedHairdresser]
  )

  const handleHairdresserChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedHairdresser(event.target.value as SelectedHairdresser)
  }

  const onEventDrop = async ({
    event,
    start,
    end,
  }: EventInteractionArgs<CalendarEvent>) => {
    if (event.isLoaderEvent || pending.current.has(event.id)) return
    pending.current.add(event.id)
    setCalendarEvents((previous) =>
      previous.map((item) =>
        item.id === event.id ? { ...item, isLoaderEvent: true } : item
      )
    )
    try {
      const result = await updateBooking(event.id, {
        selectedDate: getCalendarDateKey(new Date(start)),
        selectedTimeSlot:
          format(new Date(start), 'HH:mm') +
          ' - ' +
          format(new Date(end), 'HH:mm'),
      })
      const saved = mapBookingToEvent(result.data)
      setCalendarEvents((previous) =>
        previous.map((item) => (item.id === event.id ? saved : item))
      )
      toast.success('Sikeres módosítás')
      const warning = getNotificationWarning(result.notifications)
      if (warning) toast.error(warning)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'A módosítás sikertelen.'
      )
    } finally {
      pending.current.delete(event.id)
      setCalendarEvents((previous) =>
        previous.map((item) =>
          item.id === event.id ? { ...item, isLoaderEvent: false } : item
        )
      )
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
            checked={selectedHairdresser === 'Timi'}
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
            checked={selectedHairdresser === 'nem_Timi'}
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
            checked={selectedHairdresser === 'all'}
            onChange={handleHairdresserChange}
          />

          <label htmlFor="hairdresser-all">mindenki</label>
        </div>
      </div>

      <BigCalendar
        calendarEvents={visibleEvents}
        setCalendarEvents={setCalendarEvents}
        onEventDrop={onEventDrop}
        offDays={offDays}
        openingHours={openingHours}
        specialOpeningHours={specialOpeningHours}
        selectedHairdresser={selectedHairdresser}
        bookingsByEmail={bookingsByEmail}
      />
    </div>
  )
}

export default BigCalendarContainer
