"use client";

import { isSunday } from "date-fns";
import moment from "moment";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Calendar,
  EventProps,
  ToolbarProps,
  View,
  Views,
  momentLocalizer,
} from "react-big-calendar";
import withDragAndDrop, {
  EventInteractionArgs,
} from "react-big-calendar/lib/addons/dragAndDrop";

import { CalendarEvent } from "../../../types/calendarEvent.type";
import BigCalendarDay from "../bigCalendarDay/BigalendarDay";

import "moment/locale/hu";
import "./calendar.css";
import { TOffDay } from "@prisma/client";
import { SelectedHairdresser } from "../bigCalendarContainer/BigCalendarContainer";
import { isOffDayOfNemTimi, isOffDayOfTimi } from "../../utils/offDay";
import BigCalendarToolbar from "../bigCalendarToolbar/BigCalendarToolbar";

const localizer = momentLocalizer(moment);

type BigCalendarProps = {
  calendarEvents: CalendarEvent[];
  onEventDrop: (dragEvent: EventInteractionArgs<CalendarEvent>) => void;
  offDays: TOffDay[];
  selectedHairdresser: SelectedHairdresser;
  setCalendarEvents: Dispatch<SetStateAction<CalendarEvent[]>>;
};

const DndCalendar = withDragAndDrop<CalendarEvent>(Calendar);

const BigCalendar = ({
  calendarEvents,
  onEventDrop,
  offDays,
  selectedHairdresser,
  setCalendarEvents,
}: BigCalendarProps) => {
  const [view, setView] = useState<View>(Views.WEEK);
  const [date, setDate] = useState(new Date());

  const today = new Date();
  const minCalendarStartTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    8
  );
  const maxCalendarStartTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    19
  );

  const eventStyleGetter = (calendarEvent: CalendarEvent) => {
    if (calendarEvent.start && isSunday(calendarEvent.start)) {
      return {
        style: {
          backgroundColor: "lightgray",
          opacity: 0.5,
          cursor: "not-allowed",
        },
      };
    }

    if (
      calendarEvent.hairdresser === "Timi" &&
      isOffDayOfTimi(calendarEvent.start!, offDays)
    ) {
      return {
        style: {
          cursor: "not-allowed",
        },
      };
    }

    if (
      calendarEvent.hairdresser === "nem_Timi" &&
      isOffDayOfNemTimi(calendarEvent.start!, offDays)
    ) {
      return {
        style: {
          cursor: "not-allowed",
        },
      };
    }

    return {};
  };

  const dayStyleGetter = (date: Date) => {
    if (isSunday(date)) {
      return {
        style: {
          backgroundColor: "lightgray",
          opacity: 0.5,
        },
      };
    }

    if (
      isOffDayOfNemTimi(date, offDays) &&
      isOffDayOfTimi(date, offDays) &&
      selectedHairdresser === "all"
    ) {
      return {
        style: {
          backgroundColor: "#ffa60090",
        },
      };
    }

    if (isOffDayOfTimi(date, offDays) && selectedHairdresser !== "nem_Timi") {
      return {
        style: {
          backgroundColor: "#ff000050",
        },
      };
    }

    if (isOffDayOfNemTimi(date, offDays) && selectedHairdresser !== "Timi") {
      return {
        style: {
          backgroundColor: "#0000ff90",
        },
      };
    }

    return {};
  };

  return (
    <div>
      <DndCalendar
        localizer={localizer}
        events={calendarEvents}
        min={minCalendarStartTime}
        max={maxCalendarStartTime}
        selectable={true}
        resizable={true}
        components={{
          event: (eventProps: EventProps<CalendarEvent>) => (
            <BigCalendarDay
              calendarEvent={eventProps}
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
        style={{ minHeight: "80vh", backgroundColor: "#00000060" }}
        eventPropGetter={eventStyleGetter}
        dayPropGetter={dayStyleGetter}
        onEventDrop={onEventDrop}
        onNavigate={(date) => {
          setDate(new Date(date));
        }}
        onView={(view) => setView(view)}
      />
    </div>
  );
};

export default BigCalendar;
