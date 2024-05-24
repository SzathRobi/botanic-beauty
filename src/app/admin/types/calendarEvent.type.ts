import { Booking, Hairdresser } from "@prisma/client";
import { Event } from "react-big-calendar";

type CalendarEventContactInfo = {
  name: string;
  email: string;
  phone: string;
  otherInfo: string | null;
};

export type CalendarEvent = Event & {
  id: string;
  hairdresser: Hairdresser;
  contactInfo: CalendarEventContactInfo;
  createdAt: Date;
  updatedAt: Date;
};
