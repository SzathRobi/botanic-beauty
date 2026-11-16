import { z } from 'zod'

const phoneRegex = /^\+?[0-9\s\-().]{7,20}$/

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, { message: 'A mező kitöltése kötelező' }),
  email: z
    .string()
    .trim()
    .min(1, { message: 'A mező kitöltése kötelező' })
    .email({ message: 'Érvénytelen email cím' }),
  phone: z
    .string()
    .trim()
    .min(1, { message: 'A mező kitöltése kötelező' })
    .regex(phoneRegex, { message: 'Érvénytelen telefonszám formátum' }),
  otherInfo: z.string().optional(),
})
