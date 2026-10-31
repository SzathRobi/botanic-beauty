import { OpeningHour } from '@prisma/client'
import { z } from 'zod'

import { formSchema } from '../schemas/openingHours.schema'

export const mapOpeningHourFormValuesToOpeningHour = (
  values: z.infer<typeof formSchema>
): OpeningHour[] => {
  return Object.entries(values).map(([key, value]) => ({
    day: key,
    openingHour: value.startHour,
    closingHour: value.endHour,
    isOpen: value.isOpen,
  }))
}
