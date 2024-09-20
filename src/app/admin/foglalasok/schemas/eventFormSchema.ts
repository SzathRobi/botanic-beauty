import { z } from 'zod'

export const eventFormSchema = z.object({
  hairdresser: z.enum(['Timi', 'nem_Timi'], {
    message: 'A mező kitöltése kötelező',
  }),
  service: z.object({
    name: z.string(),
    duration: z.number(),
  }),
  extraService: z
    .object({
      name: z.string(),
      duration: z.number(),
    })
    .nullable(),
  startTime: z.string().min(1, { message: 'A mező kitöltése kötelező' }),
  endTime: z.string().min(1, { message: 'A mező kitöltése kötelező' }),
  name: z.string().min(1, { message: 'A mező kitöltése kötelező' }),
  email: z.string().min(1, { message: 'A mező kitöltése kötelező' }),
  phone: z.string().min(1, { message: 'A mező kitöltése kötelező' }),
  otherInfo: z.string().nullable(),
})
