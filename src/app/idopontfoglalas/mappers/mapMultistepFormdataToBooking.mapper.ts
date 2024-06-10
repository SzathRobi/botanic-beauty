import { Booking, ContactInfo, Service } from "@prisma/client";

type MultistepFormdata = {
  choosenServices: Service[];
  choosenHairdresser: "Timi" | "nem_Timi";
  selectedDate: Date;
  selectedTimeSlot: string;
  contactInfo: ContactInfo;
};

export const mapMultistepFormDataToBooking = ({
  choosenHairdresser,
  choosenServices,
  contactInfo,
  selectedDate,
  selectedTimeSlot,
}: MultistepFormdata): Omit<Booking, "id" | "createdAt" | "updatedAt"> => ({
  services: choosenServices,
  hairdresser: choosenHairdresser!,
  selectedDate: new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate()
  ).toString(),
  selectedTimeSlot: selectedTimeSlot!,
  contactInfo,
});
