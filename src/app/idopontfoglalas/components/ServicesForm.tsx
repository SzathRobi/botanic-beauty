'use client'

import { TService } from '@prisma/client'

import { Button } from '@/components/Button'
import { SERVICES } from '@/constants/services.constants'

import ServiceCard from './ServiceCard'

type ServiceFormProps = {
  selectedDate: Date
  setSelectedDate: (date: Date) => void
  selectedTimeSlot: string | null
  setSelectedTimeSlot: (time: string | null) => void
  selectService: (service: TService) => void
  selectedService: TService | null
  incrementActiveStep: () => void
  selectExtraService: (service: TService | null) => void
}

const ServicesForm = ({
  selectedDate,
  setSelectedDate,
  selectedTimeSlot,
  setSelectedTimeSlot,
  selectService,
  selectedService,
  incrementActiveStep,
  selectExtraService,
}: ServiceFormProps) => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-12 flex-1">
        {SERVICES.map((service, index) => (
          <ServiceCard
            key={service.name}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTimeSlot={selectedTimeSlot}
            setSelectedTimeSlot={setSelectedTimeSlot}
            service={service}
            index={index}
            selectService={selectService}
            selectedService={selectedService}
            selectExtraService={selectExtraService}
          />
        ))}
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button disabled={!selectedService} onClick={incrementActiveStep}>
          Tovább
        </Button>
      </div>
    </div>
  )
}

export default ServicesForm
