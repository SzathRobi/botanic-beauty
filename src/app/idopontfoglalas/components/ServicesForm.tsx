'use client'

import { TService } from '@prisma/client'
import { Info } from 'lucide-react'

import { Button } from '@/components/Button'
import { Alert, AlertDescription } from '@/components/ui/Alert'
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
  selectExtraService: (service: TService) => void
  removeExtraService: (service: TService) => void
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
  removeExtraService,
}: ServiceFormProps) => {
  return (
    <>
      <Alert className="dark -translate-y-16 transform" variant="info">
        <Info className="h-4 w-4 !text-blue-500" />
        <AlertDescription>
          Ha extrém hajszínt szeretnél (kék, zöld, lila, rózsaszín stb.), kérlek
          vedd fel a kapcsolatot a fodrásszal előzetes konzultáció céljából.
        </AlertDescription>
      </Alert>

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
              removeExtraService={removeExtraService}
            />
          ))}
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button disabled={!selectedService} onClick={incrementActiveStep}>
            Tovább
          </Button>
        </div>
      </div>
    </>
  )
}

export default ServicesForm
