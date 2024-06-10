import { Booking } from "@prisma/client";
import { addHours, addMinutes } from "date-fns";
import { CalendarEvent } from "../types/calendarEvent.type";

export const mapBookingToEvent = ({
  contactInfo,
  hairdresser,
  selectedDate,
  selectedTimeSlot,
  id,
  services,
  createdAt,
  updatedAt,
}: Booking): CalendarEvent => {
  const [startTime, endTime] = selectedTimeSlot.split(" - ");

  const [startHours, startMinutes] = startTime
    .split(":")
    .map((num) => parseInt(num));
  const startDateWithTime = addMinutes(
    addHours(selectedDate, startHours),
    startMinutes
  );

  const [endHours, endMinutes] = endTime.split(":").map((num) => parseInt(num));
  const endDateWithTime = addMinutes(
    addHours(selectedDate, endHours),
    endMinutes
  );

  return {
    id,
    title: services.map((service) => service.name).join(", "),
    start: startDateWithTime,
    end: endDateWithTime,
    hairdresser,
    contactInfo,
    services,
    createdAt,
    updatedAt,
  };
};
