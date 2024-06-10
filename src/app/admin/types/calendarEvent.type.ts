import { Hairdresser, Service } from "@prisma/client";
import { Event } from "react-big-calendar";

type CalendarEventContactInfo = {
  name: string;
  email: string;
  phone: string;
  otherInfo: string | null;
};

// TODO: Service már máshogy néz ki
export type CalendarEvent = Event & {
  id: string;
  hairdresser: Hairdresser;
  contactInfo: CalendarEventContactInfo;
  services: Service[];
  createdAt: Date;
  updatedAt: Date;
};
