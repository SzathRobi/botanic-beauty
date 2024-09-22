import { z } from 'zod'

export const serviceFormSchema = z.object({
  category: z.string().min(1, { message: 'A mező kitöltése kötelező' }),
  duration: z.number().min(1, { message: 'A mező kitöltése kötelező' }),
  price: z.number().min(1, { message: 'A mező kitöltése kötelező' }),
  name: z.string().min(1, { message: 'A mező kitöltése kötelező' }),
})
