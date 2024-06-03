import { Hairdresser, TService } from "@prisma/client";
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
  services: TService[];
  createdAt: Date;
  updatedAt: Date;
};
