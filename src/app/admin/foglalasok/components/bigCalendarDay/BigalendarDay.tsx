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
import { mapEventToBooking } from "@/app/admin/mappers/mapEventToBooking.mapper";

type BigCalendarDayProps = {
  calendarEvent: EventProps<CalendarEvent>;
  setCalendarEvents: Dispatch<SetStateAction<CalendarEvent[]>>;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
};

const BigCalendarDay = ({
  calendarEvent,
  setCalendarEvents,
  setIsDialogOpen,
}: BigCalendarDayProps) => {
  const {
    event: {
      contactInfo,
      extraService,
      hairdresser,
      service,
      start,
      end,
      title,
      id,
    },
  } = calendarEvent;

  const startTime = format(start!, "HH:mm");
  const endTime = format(end!, "HH:mm");

  const eventColor =
    calendarEvent.event.hairdresser === "Timi" ? "bg-green-600" : "bg-blue-600";

  const [isLoading, setIsLoading] = useState(false);

  const deleteBooking = async (id: string) => {
    setIsLoading(true);
    try {
      const bookingResponse = await fetch(`/api/booking/${id}`, {
        method: "DELETE",
      });

      const cancelEamilResponse = await fetch("/api/email/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          booking: mapEventToBooking(calendarEvent.event),
        }),
      });

      if (!cancelEamilResponse.ok) {
        toast.error("A foglalás törlő email küldése sikertelen!");
      }

      const data = await bookingResponse.json();

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
          <p className="hidden md:block mb-2">{title}</p>
          <p className="hidden md:block">{contactInfo.name}</p>
        </div>
      </PopoverTrigger>
      <PopoverContent side="right" className="bg-white max-w-60">
        <p>Foglalási adatok:</p>
        {/* ${eventColor} */}
        <div className={`text-sm h-full`}>
          <p className="mb-2">
            {startTime} - {endTime}
          </p>

          <p className="mb-2">{title}</p>

          {extraService && (
            <p className="mb-2 font-medium">Extra hajvágással</p>
          )}
        </div>

        <div className="text-sm space-y-1 mb-8">
          <p>{contactInfo.name}</p>

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
        <BigCalendarEventForm
          calendarEvent={calendarEvent}
          setCalendarEvents={setCalendarEvents}
          setIsDialogOpen={setIsDialogOpen}
        />
      </DialogContent>
    </Popover>
  );
};

export default BigCalendarDay;
