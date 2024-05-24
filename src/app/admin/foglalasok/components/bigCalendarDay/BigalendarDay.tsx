import { format } from "date-fns";
import { EventProps } from "react-big-calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Popover";

import { CalendarEvent } from "../../../types/calendarEvent.type";

type BigCalendarDayProps = {
  calendarEvent: EventProps<CalendarEvent>;
};

const BigCalendarDay = ({ calendarEvent }: BigCalendarDayProps) => {
  const {
    event: { contactInfo },
  } = calendarEvent;

  const startTime = format(calendarEvent.event.start!, "HH:mm");
  const endTime = format(calendarEvent.event.end!, "HH:mm");

  const eventColor =
    calendarEvent.event.hairdresser === "Timi" ? "bg-green-600" : "bg-blue-600";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className={`text-sm h-full p-2 ${eventColor}`}>
          <p className="mb-2">
            {startTime} - {endTime}
          </p>
          <p className="mb-2">{calendarEvent.event.title}</p>
          <p>{contactInfo.name}</p>
        </div>
      </PopoverTrigger>
      <PopoverContent side="right" className="bg-white">
        <div>
          <p>Extra adatok:</p>
          <p>{contactInfo.email}</p>
          <p>{contactInfo.phone}</p>
          {contactInfo.otherInfo && <p>{contactInfo.otherInfo}</p>}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default BigCalendarDay;
