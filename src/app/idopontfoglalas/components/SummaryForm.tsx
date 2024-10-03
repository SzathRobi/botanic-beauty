'use client'

import { TService } from '@prisma/client'
import { Calendar, User } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import { IoColorPaletteOutline } from 'react-icons/io5'
import { PiHairDryer, PiScissors } from 'react-icons/pi'

import { Button } from '@/components/Button'
import { CONTACT_PHONE } from '@/constants/contact.constants'
import { HOME_ROUTE } from '@/constants/routes.constants'

type SummaryFormProps = {
  contactInfo: {
    name: string
    email: string
    phone: string
    otherInfo: string
  }
  selectedService: TService
  selectedExtraService: TService | null
  selectedHairdresser: 'Timi' | 'nem_Timi' | null
  selectedDate: Date
  selectedTimeSlot: string | null
  resetForm: () => void
}

const ICON_SIZE = 48

const SummaryForm = ({
  contactInfo,
  selectedHairdresser,
  selectedService,
  selectedExtraService,
  selectedDate,
  selectedTimeSlot,
  resetForm,
}: SummaryFormProps) => {
  const geServiceIconByCategory = (category: string) => {
    if (category === 'Hajvágás' || category === 'extra') {
      return (
        <PiScissors size={ICON_SIZE} className="min-w-10 text-emerald-600" />
      )
    }

    if (category === 'Festések') {
      return (
        <IoColorPaletteOutline
          size={ICON_SIZE}
          className="min-w-10 text-emerald-600"
        />
      )
    }

    return (
      <PiHairDryer size={ICON_SIZE} className="min-w-10 text-emerald-600" />
    )
  }

  const createCustomer = async () => {
    await fetch('/api/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: contactInfo.email,
        name: contactInfo.name,
        phone: contactInfo.phone,
        hairdressers: [selectedHairdresser],
      }),
    })
  }

  useEffect(() => {
    createCustomer()
  }, [])

  return (
    <div>
      <p className="mb-16 text-center text-2xl">
        Az időpontodat sikeresen felvettük!
      </p>

      <div className="mb-24 flex flex-col items-start justify-evenly gap-8 md:flex-row">
        <div>
          <div className="mb-4 flex gap-4">
            {geServiceIconByCategory(selectedService.category)}
            <div>
              <p>Szolgáltatás:</p>
              <p className="mb-2 max-w-xs text-lg font-medium">
                {selectedService.name} ({selectedService.duration} perc)
              </p>
            </div>
          </div>

          {selectedExtraService && (
            <div className="flex gap-4">
              {geServiceIconByCategory(selectedExtraService.category)}
              <div>
                <p>Extra Szolgáltatás:</p>
                <p className="mb-2 max-w-xs text-lg font-medium">
                  {selectedExtraService.name} ({selectedExtraService.duration}{' '}
                  perc)
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <User size={48} className="min-w-10 text-emerald-600" />
          <div>
            <p>Fordrász:</p>
            <p className="text-lg font-medium">{selectedHairdresser}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <Calendar size={48} className="min-w-10 text-emerald-600" />
          <div>
            <p>Időpont:</p>
            <p className="text-lg font-medium">
              {selectedDate.toLocaleDateString()} {selectedTimeSlot}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-24 flex flex-col items-center justify-center gap-4">
        <p className="text-center">
          Email címedre kiküldtünk egy visszaigazoló levelet.
        </p>
        <p className="font-medium">
          Ha mégse lenne jó az időpont, kérlek időben jelezd ezen az
          elérhetőségen:
        </p>
        <p>{CONTACT_PHONE}</p>
      </div>

      <div className="flex items-center justify-center gap-2">
        <Button variant="secondary" onClick={resetForm}>
          Új időpont
        </Button>
        <Button asChild>
          <Link href={HOME_ROUTE}>Vissza a főoldalra</Link>
        </Button>
      </div>
    </div>
  )
}

export default SummaryForm
