'use client'

// @ts-expect-error minden tuti
import 'moment/locale/hu'
// @ts-expect-error minden tuti
import './calendar.css'

import { OpeningHour, SpecialOpeningHour, TOffDay } from '@prisma/client'
import moment from 'moment'
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
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

import { CalendarEvent } from '../../../types/calendarEvent.type'
import { startCalendarAutoScroll } from '../../utils/calendarAutoScroll'
import {
  CALENDAR_STEP_MINUTES,
  createCalendarAppearanceGetters,
} from '../../utils/calendarAvailability'
import { getProgressString } from '../../utils/getProgressionString.util'
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
  const [view, setView] = useState<View>(Views.WORK_WEEK)
  const [date, setDate] = useState(() => focusDate ?? new Date())

  useEffect(() => {
    if (focusDate) setDate(focusDate)
  }, [focusDate])

  const today = new Date()
  const minCalendarTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    0,
    0,
    0,
    0
  )
  const maxCalendarTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,
    59,
    59,
    999
  )
  const rootRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!rootRef.current) return
    return startCalendarAutoScroll(rootRef.current, () => new Date())
  }, [])
  const appearance = useMemo(
    () =>
      createCalendarAppearanceGetters({
        openingHours,
        specialOpeningHours,
        offDays,
        selectedHairdresser,
      }),
    [openingHours, specialOpeningHours, offDays, selectedHairdresser]
  )

  return (
    <div className="booking-calendar" ref={rootRef}>
      <div
        className="mb-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-300"
        aria-label="Naptár jelmagyarázat"
      >
        <span className="flex items-center gap-2">
          <span className="booking-calendar-closed-swatch" aria-hidden="true" />
          Zárva / nincs elérhető fodrász
        </span>
        {selectedHairdresser === 'all' && (
          <span className="flex items-center gap-2">
            <span
              className="booking-calendar-partial-swatch"
              aria-hidden="true"
            />
            Egy fodrász szabadságon
          </span>
        )}
      </div>
      <DndCalendar
        localizer={localizer}
        culture="hu"
        events={calendarEvents}
        min={minCalendarTime}
        max={maxCalendarTime}
        step={CALENDAR_STEP_MINUTES}
        timeslots={4}
        enableAutoScroll={false}
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
        views={[Views.MONTH, Views.WORK_WEEK, Views.WEEK, Views.DAY]}
        defaultView={view}
        view={view}
        date={date}
        className={`w-[200vw] bg-black/60 md:w-full ${view === Views.MONTH ? 'booking-calendar-month' : 'booking-calendar-time-grid'}`}
        dayPropGetter={appearance.dayPropGetter}
        slotPropGetter={appearance.slotPropGetter}
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
