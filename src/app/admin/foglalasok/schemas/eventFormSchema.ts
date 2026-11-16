import { z } from 'zod'

const service = z.object({
  id: z.string(),
  name: z.string(),
  duration: z.number().nonnegative(),
  category: z.string(),
  price: z.number(),
})
export const eventFormSchema = z.object({
  hairdresser: z.enum(['Timi', 'nem_Timi']),
  service,
  extraServices: z.array(service),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, { message: 'Érvénytelen kezdési időpont' }),
  endTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, { message: 'Érvénytelen befejezési időpont' }),
  name: z.string().trim().min(1, { message: 'A mező kitöltése kötelező' }),
  email: z.string().trim().email({ message: 'Érvénytelen email cím' }),
  phone: z.string().trim().min(1, { message: 'A mező kitöltése kötelező' }),
  otherInfo: z.string().nullish(),
})
