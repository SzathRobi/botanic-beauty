import { OpeningHour } from '@prisma/client'

import prisma from '@/lib/db'

const weekdays: string[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

export const createInitialOpeningHours = async (
  salonId: string
): Promise<OpeningHour[]> => {
  const openingHours: OpeningHour[] = weekdays.map((day) => ({
    day,
    isOpen: day === 'Sunday' || day === 'Saturday' ? false : true,
    closingHour: '18:00',
    openingHour: '10:00',
  }))

  await prisma.salon.update({
    where: { id: salonId },
    data: { openingHours },
  })

  return openingHours
}
