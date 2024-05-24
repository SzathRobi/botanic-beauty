import { Booking } from "@prisma/client";
import { parseISO, addHours, addMinutes } from "date-fns";
import { Event } from "react-big-calendar";
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

  const dateObject = parseISO(selectedDate);

  const [startHours, startMinutes] = startTime
    .split(":")
    .map((num) => parseInt(num));
  const startDateWithTime = addMinutes(
    addHours(dateObject, startHours),
    startMinutes
  );

  const [endHours, endMinutes] = endTime.split(":").map((num) => parseInt(num));
  const endDateWithTime = addMinutes(
    addHours(dateObject, endHours),
    endMinutes
  );

  return {
    id,
    title: services.map((service) => service.title).join(", "),
    start: startDateWithTime,
    end: endDateWithTime,
    hairdresser,
    contactInfo,
    createdAt,
    updatedAt,
  };
};
