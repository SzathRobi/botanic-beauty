'use client'

import { SpecialOpeningHour } from '@prisma/client'
import { CalendarX } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

import SpecialOpeningHoursCardMobile from '../specialOpeningHoursCardMobile/SpecialOpeningHoursCardMobile'

type SpecialOpeningHoursContainerMobileProps = {
  hasActiveFilters?: boolean
  salonId: string
  specialOpeningHours: SpecialOpeningHour[]
  setSpecialOpeningHours: Dispatch<SetStateAction<SpecialOpeningHour[]>>
}

const SpecialOpeningHoursContainerMobile = ({
  hasActiveFilters,
  salonId,
  specialOpeningHours,
  setSpecialOpeningHours,
}: SpecialOpeningHoursContainerMobileProps) => {
  return specialOpeningHours.length > 0 ? (
    <div>
      <div>
        {specialOpeningHours.map((specialOpeningHour) => (
          <SpecialOpeningHoursCardMobile
            salonId={salonId}
            setSpecialOpeningHours={setSpecialOpeningHours}
            key={new Date(specialOpeningHour.date).toISOString()}
            specialOpeningHour={specialOpeningHour}
          />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2">
      <CalendarX className="size-16 text-muted-foreground" />
      <p className="text-center text-lg">
        {hasActiveFilters
          ? 'Nincs találat'
          : 'Jelenleg nincs speciális nyitvatartási idő'}
      </p>
    </div>
  )
}

export default SpecialOpeningHoursContainerMobile
