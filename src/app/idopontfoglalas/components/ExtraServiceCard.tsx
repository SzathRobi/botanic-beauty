'use client'

import { TService } from '@prisma/client'
import { ChangeEvent, useState } from 'react'
import { PiScissors } from 'react-icons/pi'

import { EXTRA_SERVICE } from '@/constants/services.constants'
import { formatDuration } from '@/lib/utils'

type ExtraServiceCardProps = {
  selectExtraService: (service: TService | null) => void
}

const ICON_SIZE = 32

const ExtraServiceCard = ({ selectExtraService }: ExtraServiceCardProps) => {
  const [isExtraServiceSelected, setIsExtraServiceSelected] = useState(false)

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsExtraServiceSelected(event.target.checked)

    if (event.target.checked) {
      selectExtraService(EXTRA_SERVICE)
      return
    }

    selectExtraService(null)
  }

  return (
    <div
      className={`${
        isExtraServiceSelected ? 'bg-emerald-600/10' : 'bg-black/30'
      } mb-4 rounded-md transition-colors`}
    >
      <label className="mb-2 flex cursor-pointer items-center gap-4 rounded-md px-4 py-2 pl-16">
        <div className="rounded-full bg-emerald-600 p-2">
          <PiScissors size={ICON_SIZE / 2} />
        </div>
        <div className="flex-1">
          <h3>{EXTRA_SERVICE.name}</h3>
          <p className="text-sm text-gray-400">{formatDuration(30)}</p>
        </div>
        <input
          type="checkbox"
          checked={isExtraServiceSelected}
          onChange={handleCheckboxChange}
          className="hidden"
        />
      </label>
    </div>
  )
}

export default ExtraServiceCard
