import { Booking, TContactInfo, TService } from '@prisma/client'

type MultistepFormdata = {
  selectedService: TService
  selectedExtraServices: TService[]
  selectedHairdresser: 'Timi' | 'nem_Timi'
  selectedDate: Date
  selectedTimeSlot: string
  contactInfo: TContactInfo
}

export const mapMultistepFormDataToBooking = ({
  selectedHairdresser,
  selectedService,
  selectedExtraServices,
  contactInfo,
  selectedDate,
  selectedTimeSlot,
}: MultistepFormdata): Omit<Booking, 'id' | 'createdAt' | 'updatedAt'> => ({
  service: selectedService,
  extraServices: selectedExtraServices,
  hairdresser: selectedHairdresser!,
  selectedDate: new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate()
  ).toString(),
  selectedTimeSlot: selectedTimeSlot!,
  contactInfo,
  finalPrice: 0,
  dyeMaterialUsage: 0,
  bleachMaterialUsage: 0,
  extraHaircutPrice: 0,
  miracleBoosterPrice: 0,
  isFinanceDone: false,
})
