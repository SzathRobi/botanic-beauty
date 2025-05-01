'use client'

import { TService } from '@prisma/client'
import { ChangeEvent, useEffect, useRef } from 'react'
import { IoColorPaletteOutline } from 'react-icons/io5'
import { PiHairDryer, PiScissors } from 'react-icons/pi'

import {
  EXTRA_SERVICE_HAIRCUT,
  EXTRA_SERVICE_MIRACLE_BOOSTER,
} from '@/constants/services.constants'
import { formatDuration } from '@/lib/utils'

import ExtraServiceCard from './ExtraServiceCard'

type ServiceCardProps = {
  selectedDate: Date
  setSelectedDate: (date: Date) => void
  selectedTimeSlot: string | null
  setSelectedTimeSlot: (time: string | null) => void
  service: TService
  index: number
  selectService: (service: TService) => void
  selectedService: TService | null
  selectExtraService: (service: TService) => void
  removeExtraService: (service: TService) => void
}

const ICON_SIZE = 32

const ServiceCard = ({
  selectedDate,
  setSelectedDate,
  selectedTimeSlot,
  setSelectedTimeSlot,
  service,
  index,
  selectService,
  selectedService,
  selectExtraService,
  removeExtraService,
}: ServiceCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      selectService(service)

      if (selectedDate || selectedTimeSlot) {
        setSelectedTimeSlot(null)
        setSelectedDate(new Date(Date.now()))
      }
    }
  }

  const geServiceIcon = (category: string) => {
    if (category === 'Hajvágás') {
      return <PiScissors size={ICON_SIZE} />
    }

    if (category === 'Festések') {
      return <IoColorPaletteOutline size={ICON_SIZE} />
    }

    return <PiHairDryer size={ICON_SIZE} />
  }

  const isSelected = selectedService?.name === service.name

  useEffect(() => {
    if (selectedService?.name === service.name && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [selectedService, service])

  return (
    <div
      ref={cardRef}
      className={`${
        isSelected ? 'bg-emerald-600/30' : 'bg-black/30'
      } mb-4 rounded-md transition-colors`}
    >
      <label
        key={index}
        className="mb-2 flex cursor-pointer items-center gap-4 rounded-md px-4 py-2"
      >
        <div className="rounded-full bg-emerald-600 p-2">
          {geServiceIcon(service.category)}
        </div>
        <div className="flex-1">
          <h3>{service.name}</h3>
          <p className="text-sm text-gray-400">
            {formatDuration(service.duration)}
          </p>
        </div>
        <input
          type="radio"
          name="service"
          checked={isSelected}
          onChange={handleRadioChange}
          className="hidden"
        />
      </label>

      {isSelected && (
        <ExtraServiceCard
          extraService={EXTRA_SERVICE_MIRACLE_BOOSTER}
          selectExtraService={selectExtraService}
          removeExtraService={removeExtraService}
        />
      )}

      {isSelected && service.category === 'Festések' && (
        <ExtraServiceCard
          extraService={EXTRA_SERVICE_HAIRCUT}
          selectExtraService={selectExtraService}
          removeExtraService={removeExtraService}
        />
      )}
    </div>
  )
}

export default ServiceCard
