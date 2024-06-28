import { Booking, TContactInfo, TService } from "@prisma/client";

type MultistepFormdata = {
  selectedService: TService;
  selectedExtraService: TService | null;
  selectedHairdresser: "Timi" | "nem_Timi";
  selectedDate: Date;
  selectedTimeSlot: string;
  contactInfo: TContactInfo;
};

export const mapMultistepFormDataToBooking = ({
  selectedHairdresser,
  selectedService,
  selectedExtraService,
  contactInfo,
  selectedDate,
  selectedTimeSlot,
}: MultistepFormdata): Omit<Booking, "id" | "createdAt" | "updatedAt"> => ({
  service: selectedService,
  extraService: selectedExtraService,
  hairdresser: selectedHairdresser!,
  selectedDate: new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate()
  ).toString(),
  selectedTimeSlot: selectedTimeSlot!,
  contactInfo,
});
