'use client'

// @ts-expect-error minden tuti
import 'moment/locale/hu'
// @ts-expect-error minden tuti
import './calendar.css'

import { OpeningHour, SpecialOpeningHour, TOffDay } from '@prisma/client'
import moment from 'moment'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
  Calendar,
  EventProps,
  momentLocalizer,
  ToolbarProps,
  View,
  Views,
} from 'react-big-calendar'
import withDragAndDrop, {
  EventInteractionArgs,
} from 'react-big-calendar/lib/addons/dragAndDrop'

import {
  getCalendarDateKey,
  getDaySchedule,
  timeToMinutes,
} from '@/lib/guest-booking'

import { CalendarEvent } from '../../../types/calendarEvent.type'
import { getProgressString } from '../../utils/getProgressionString.util'
import { isOffDayOfNemTimi, isOffDayOfTimi } from '../../utils/offDay'
import { SelectedHairdresser } from '../bigCalendarContainer/BigCalendarContainer'
import BigCalendarDay from '../bigCalendarDay/BigalendarDay'
import BigCalendarToolbar from '../bigCalendarToolbar/BigCalendarToolbar'

const localizer = momentLocalizer(moment)

type BigCalendarProps = {
  bookingsByEmail: Record<string, number>
  onCreate?: (start: Date) => void
  focusDate?: Date
  calendarEvents: CalendarEvent[]
  // eslint-disable-next-line no-unused-vars
  onEventDrop: (dragEvent: EventInteractionArgs<CalendarEvent>) => void
  offDays: TOffDay[]
  openingHours: OpeningHour[]
  specialOpeningHours: SpecialOpeningHour[]
  selectedHairdresser: SelectedHairdresser
  setCalendarEvents: Dispatch<SetStateAction<CalendarEvent[]>>
}

const DndCalendar = withDragAndDrop<CalendarEvent>(Calendar)

const BigCalendar = ({
  bookingsByEmail,
  onCreate,
  focusDate,
  calendarEvents,
  onEventDrop,
  offDays,
  openingHours,
  specialOpeningHours,
  selectedHairdresser,
  setCalendarEvents,
}: BigCalendarProps) => {
  const [view, setView] = useState<View>(Views.WEEK)
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    if (focusDate) setDate(focusDate)
  }, [focusDate])

  const today = new Date()
  const hours = [...openingHours, ...specialOpeningHours].filter(
    (day) => day.isOpen
  )
  const firstMinute = hours.reduce(
    (minimum, day) =>
      Math.min(minimum, timeToMinutes(day.openingHour) ?? minimum),
    8 * 60
  )
  const lastMinute = hours.reduce(
    (maximum, day) =>
      Math.max(maximum, timeToMinutes(day.closingHour) ?? maximum),
    19 * 60
  )
  const earliestEvent = calendarEvents.reduce(
    (minimum, event) =>
      Math.min(
        minimum,
        event.start
          ? event.start.getHours() * 60 + event.start.getMinutes()
          : minimum
      ),
    firstMinute
  )
  const latestEvent = calendarEvents.reduce(
    (maximum, event) =>
      Math.max(
        maximum,
        event.end ? event.end.getHours() * 60 + event.end.getMinutes() : maximum
      ),
    lastMinute
  )
  const minCalendarStartTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    0,
    earliestEvent
  )
  const maxCalendarStartTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    0,
    Math.min(1439, latestEvent)
  )

  const eventStyleGetter = (calendarEvent: CalendarEvent) => {
    if (
      calendarEvent.start &&
      !getDaySchedule(
        getCalendarDateKey(calendarEvent.start),
        openingHours,
        specialOpeningHours
      )?.isOpen
    ) {
      return {
        style: {
          backgroundColor: 'lightgray',
          opacity: 0.5,
          cursor: 'pointer',
        },
      }
    }

    if (
      calendarEvent.hairdresser === 'Timi' &&
      isOffDayOfTimi(calendarEvent.start!, offDays)
    ) {
      return {
        style: {
          cursor: 'not-allowed',
        },
      }
    }

    if (
      calendarEvent.hairdresser === 'nem_Timi' &&
      isOffDayOfNemTimi(calendarEvent.start!, offDays)
    ) {
      return {
        style: {
          cursor: 'not-allowed',
        },
      }
    }

    return {}
  }

  const dayStyleGetter = (date: Date) => {
    if (
      !getDaySchedule(
        getCalendarDateKey(date),
        openingHours,
        specialOpeningHours
      )?.isOpen
    ) {
      return {
        style: {
          backgroundColor: 'lightgray',
          opacity: 0.5,
        },
      }
    }

    if (
      isOffDayOfNemTimi(date, offDays) &&
      isOffDayOfTimi(date, offDays) &&
      selectedHairdresser === 'all'
    ) {
      return {
        style: {
          backgroundColor: '#ffa60090',
        },
      }
    }

    if (isOffDayOfTimi(date, offDays) && selectedHairdresser !== 'nem_Timi') {
      return {
        style: {
          backgroundColor: '#ff000050',
        },
      }
    }

    if (isOffDayOfNemTimi(date, offDays) && selectedHairdresser !== 'Timi') {
      return {
        style: {
          backgroundColor: '#0000ff90',
        },
      }
    }

    return {}
  }

  return (
    <div>
      <DndCalendar
        localizer={localizer}
        events={calendarEvents}
        min={minCalendarStartTime}
        max={maxCalendarStartTime}
        selectable={Boolean(onCreate)}
        onSelectSlot={({ start }) => onCreate?.(new Date(start))}
        resizable={false}
        components={{
          event: (eventProps: EventProps<CalendarEvent>) => (
            <BigCalendarDay
              discountProgression={getProgressString(
                bookingsByEmail[eventProps.event.contactInfo.email] ?? 0
              )}
              calendarEvent={eventProps}
              offDays={offDays}
              openingHours={openingHours}
              specialOpeningHours={specialOpeningHours}
              setCalendarEvents={setCalendarEvents}
            />
          ),
          toolbar: (toolbarProps: ToolbarProps<CalendarEvent, object>) => (
            <BigCalendarToolbar {...toolbarProps} />
          ),
        }}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        defaultView={view}
        view={view}
        date={date}
        className="min-h-[80vh] w-[200vw] bg-black/60 md:w-full"
        eventPropGetter={eventStyleGetter}
        dayPropGetter={dayStyleGetter}
        draggableAccessor={(event) => !event.isLoaderEvent}
        onEventDrop={onEventDrop}
        onNavigate={(date) => {
          setDate(new Date(date))
        }}
        onView={(view) => setView(view)}
      />
    </div>
  )
}

export default BigCalendar
