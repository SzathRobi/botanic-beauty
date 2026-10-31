import { z } from 'zod'

export const specialOpeningHoursFormSchema = z.array(
  z.object({
    date: z.date(),
    isOpen: z.boolean(),
    openingHour: z.string().min(1, 'A mező kitöltése kötelező'),
    closingHour: z.string().min(1, 'A mező kitöltése kötelező'),
  })
)
