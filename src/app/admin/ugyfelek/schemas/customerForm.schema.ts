import { z } from 'zod'

export const customerFormSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string(),
  otherInfo: z.string().optional(),
})
