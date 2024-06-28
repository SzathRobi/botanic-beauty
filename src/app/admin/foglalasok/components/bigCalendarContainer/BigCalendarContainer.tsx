"use client";

import { isSunday } from "date-fns";
import { useState } from "react";
import { CalendarEvent } from "../../../types/calendarEvent.type";
import BigCalendar from "../bigCalendar/BigCalendar";
import { EventInteractionArgs } from "react-big-calendar/lib/addons/dragAndDrop";
import { mapEventToBooking } from "../../../mappers/mapEventToBooking.mapper";
import { TOffDay } from "@prisma/client";
import { isOffDayOfNemTimi, isOffDayOfTimi } from "../../utils/offDay";
import toast from "react-hot-toast";
import { Dialog } from "@/components/ui/Dialog";

type BigCalendarContainerProps = {
  events: CalendarEvent[];
  offDays: TOffDay[];
};

export type SelectedHairdresser = "all" | "Timi" | "nem_Timi";

const BigCalendarContainer = ({
  events,
  offDays,
}: BigCalendarContainerProps) => {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(events);
  const [calendarEventsBackup, setCalendarEventsBackup] =
    useState<CalendarEvent[]>(events);
  const [selectedHairdresser, setSelectedHairdresser] =
    useState<SelectedHairdresser>("all");

  const handleHairdresserChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value as SelectedHairdresser;
    setSelectedHairdresser(value);
    if (value === "all") {
      setCalendarEvents(calendarEventsBackup);
    } else if (value === "nem_Timi") {
      setCalendarEvents(
        calendarEventsBackup.filter(
          (calendarEvent) => calendarEvent.hairdresser !== "Timi"
        )
      );
    } else if (value === "Timi") {
      setCalendarEvents(
        calendarEventsBackup.filter(
          (calendarEvent) => calendarEvent.hairdresser === "Timi"
        )
      );
    }
  };

  const updateEvent = async (event: CalendarEvent) => {
    try {
      const response = await fetch("/api/booking", {
        method: "PATCH",
        body: JSON.stringify(mapEventToBooking(event)),
      });
      const data = await response.json();
      return { data, success: true };
    } catch (error) {
      toast.error("Hiba történt, a módosítás sikertelen");
      return { data: null, error: true };
    }
  };

  const onEventDrop = (dragEvent: EventInteractionArgs<CalendarEvent>) => {
    const { end, event, start } = dragEvent;

    if (
      isSunday(start) ||
      (isOffDayOfNemTimi(new Date(start), offDays) &&
        event.hairdresser === "nem_Timi") ||
      (isOffDayOfTimi(new Date(start), offDays) && event.hairdresser === "Timi")
    ) {
      return;
    }

    let modifiedEvent: CalendarEvent | undefined;

    const modifiedEvents: CalendarEvent[] = calendarEvents.map(
      (calendarEvent: CalendarEvent) => {
        if (calendarEvent.id === event.id) {
          modifiedEvent = { ...calendarEvent, start, end } as CalendarEvent;

          return modifiedEvent;
        }

        return calendarEvent;
      }
    );

    if (modifiedEvent) {
      updateEvent(modifiedEvent).then((response) => {
        if (!response.success) {
          return;
        }

        setCalendarEvents(modifiedEvents);
        setCalendarEventsBackup(modifiedEvents);
      });
    }
  };

  return (
    <Dialog>
      <div className="max-w-[100vw] overflow-scroll md:overflow-hidden">
        <div className="flex gap-4 mb-8">
          <div>
            <input
              type="radio"
              name="hairdresser"
              value="Timi"
              id="hairdresser-timi"
              defaultChecked={selectedHairdresser === "Timi"}
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
              defaultChecked={selectedHairdresser === "nem_Timi"}
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
              defaultChecked={selectedHairdresser === "all"}
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
        />
      </div>
    </Dialog>
  );
};

export default BigCalendarContainer;
