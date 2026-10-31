'use client'

import { OpeningHour } from '@prisma/client'
import { HandHelping } from 'lucide-react'

import OpeningHoursCardMobile from '../openingHoursCardMobile/OpeningHoursCardMobile'

type OpeningHoursContainerMobileProps = {
  openingHours: OpeningHour[]
}

const OpeningHoursContainerMobile = ({
  openingHours,
}: OpeningHoursContainerMobileProps) => {
  return openingHours.length > 0 ? (
    <div>
      <div>
        {openingHours.map((openingHour) => (
          <OpeningHoursCardMobile
            key={openingHour.day}
            openingHour={openingHour}
          />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2">
      <HandHelping className="size-16 text-muted-foreground" />
      <p className="text-center text-lg">Jelenleg nincs nyitvatartási idő</p>
    </div>
  )
}

export default OpeningHoursContainerMobile
