import { Booking } from "@prisma/client";
import { format } from "date-fns";

import { CalendarEvent } from "../types/calendarEvent.type";

export const mapEventToBooking = ({
  contactInfo,
  createdAt,
  hairdresser,
  id,
  service,
  extraService,
  updatedAt,
  start,
  end,
}: CalendarEvent): Booking => ({
  selectedDate:
    new Date(
      start!.getFullYear(),
      start!.getMonth(),
      start!.getDate()
    )?.toISOString() ?? "",
  contactInfo: contactInfo,
  hairdresser: hairdresser,
  service,
  extraService,
  selectedTimeSlot:
    `${format(start!, "HH:mm")} - ${format(end!, "HH:mm")}` ?? "",
  id,
  createdAt: createdAt,
  updatedAt: updatedAt,
});
