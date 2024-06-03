import { Booking, TService } from "@prisma/client";
import { format } from "date-fns";

import { CalendarEvent } from "../types/calendarEvent.type";

const getServiceDuration = (title: string): number => {
  if (title === "Hajvágás") {
    return 45;
  }
  return 240;
};

export const mapEventToBooking = ({
  contactInfo,
  createdAt,
  hairdresser,
  id,
  services,
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
  services,
  selectedTimeSlot:
    `${format(start!, "HH:mm")} - ${format(end!, "HH:mm")}` ?? "",
  id,
  createdAt: createdAt,
  updatedAt: updatedAt,
});
