"use client";

import { format } from "date-fns";
import { EventProps } from "react-big-calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Popover";

import { CalendarEvent } from "../../../types/calendarEvent.type";
import { Button } from "@/components/Button";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import BigCalendarEventForm from "../bigCalendarEventForm/BigCalendarEventForm";

type BigCalendarDayProps = {
  calendarEvent: EventProps<CalendarEvent>;
  setCalendarEvents: Dispatch<SetStateAction<CalendarEvent[]>>;
};

const BigCalendarDay = ({
  calendarEvent,
  setCalendarEvents,
}: BigCalendarDayProps) => {
  const {
    event: { contactInfo, hairdresser, service, start, end, title, id },
  } = calendarEvent;

  const startTime = format(start!, "HH:mm");
  const endTime = format(end!, "HH:mm");

  const eventColor =
    calendarEvent.event.hairdresser === "Timi" ? "bg-green-600" : "bg-blue-600";

  const [isLoading, setIsLoading] = useState(false);

  console.log("salalalalalalalalallalalalalalal");

  const deleteBooking = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/booking/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!data.success) {
        toast.error("Hiba történt, a módosítás sikertelen");
        return;
      }

      setCalendarEvents((prev) => prev.filter((event) => event.id !== id));
    } catch (error) {
      toast.error("Hiba történt, a módosítás sikertelen");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className={`text-sm h-full p-2 ${eventColor}`}>
          <p className="mb-2">
            {startTime} - {endTime}
          </p>
          <p className="mb-2">{title}</p>
          <p>{contactInfo.name}</p>
        </div>
      </PopoverTrigger>
      <PopoverContent side="right" className="bg-white">
        <p>Foglalási adatok:</p>
        <div className={`text-sm h-full p-2 ${eventColor}`}>
          <p className="mb-2">
            {startTime} - {endTime}
          </p>
          <p className="mb-2">{title}</p>
          <p>{contactInfo.name}</p>
        </div>
        <div>
          <p>{contactInfo.email}</p>
          <p>{contactInfo.phone}</p>
          {contactInfo.otherInfo && <p>{contactInfo.otherInfo}</p>}
        </div>
        <div>
          <Button
            size="sm"
            variant="destructive"
            isLoading={isLoading}
            onClick={() => deleteBooking(id)}
          >
            Törlés
          </Button>
          <DialogTrigger asChild>
            <Button size="sm" variant="secondary">
              Módosítás
            </Button>
          </DialogTrigger>
        </div>
      </PopoverContent>

      <DialogContent>
        <BigCalendarEventForm calendarEvent={calendarEvent} />
      </DialogContent>
    </Popover>
  );
};

export default BigCalendarDay;
