import { Booking, Service } from "@prisma/client";
import { format } from "date-fns";

import { CalendarEvent } from "../types/calendarEvent.type";

const getServiceDuration = (title: string): number => {
  if (title === "Hajvágás") {
    return 45;
  }
  return 240;
};

const mapTitleToServices = (title: string): Service => ({
  duration: getServiceDuration(title),
  title,
});

export const mapEventToBooking = ({
  contactInfo,
  createdAt,
  hairdresser,
  id,
  updatedAt,
  start,
  end,
  title,
}: CalendarEvent): Booking => ({
  selectedDate:
    new Date(
      start!.getFullYear(),
      start!.getMonth(),
      start!.getDate()
    )?.toISOString() ?? "",
  contactInfo: contactInfo,
  hairdresser: hairdresser,
  services: title!.toString().split(", ").map(mapTitleToServices),
  selectedTimeSlot:
    `${format(start!, "HH:mm")} - ${format(end!, "HH:mm")}` ?? "",
  id,
  createdAt: createdAt,
  updatedAt: updatedAt,
});
