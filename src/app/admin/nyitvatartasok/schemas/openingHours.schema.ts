import { z } from 'zod'

export const formSchema = z.object({
  monday: z.object({
    startHour: z.string().min(1, 'A mező kitöltése kötelező'),
    endHour: z.string().min(1, 'A mező kitöltése kötelező'),
    isOpen: z.boolean(),
  }),
  tuesday: z.object({
    startHour: z.string().min(1, 'A mező kitöltése kötelező'),
    endHour: z.string().min(1, 'A mező kitöltése kötelező'),
    isOpen: z.boolean(),
  }),
  wednesday: z.object({
    startHour: z.string().min(1, 'A mező kitöltése kötelező'),
    endHour: z.string().min(1, 'A mező kitöltése kötelező'),
    isOpen: z.boolean(),
  }),
  thursday: z.object({
    startHour: z.string().min(1, 'A mező kitöltése kötelező'),
    endHour: z.string().min(1, 'A mező kitöltése kötelező'),
    isOpen: z.boolean(),
  }),
  friday: z.object({
    startHour: z.string().min(1, 'A mező kitöltése kötelező'),
    endHour: z.string().min(1, 'A mező kitöltése kötelező'),
    isOpen: z.boolean(),
  }),
  saturday: z.object({
    startHour: z.string().min(1, 'A mező kitöltése kötelező'),
    endHour: z.string().min(1, 'A mező kitöltése kötelező'),
    isOpen: z.boolean(),
  }),
  sunday: z.object({
    startHour: z.string().min(1, 'A mező kitöltése kötelező'),
    endHour: z.string().min(1, 'A mező kitöltése kötelező'),
    isOpen: z.boolean(),
  }),
})
