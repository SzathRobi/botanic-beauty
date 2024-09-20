import { Booking } from '@prisma/client'

export type BookingWithoutSensitiveData = Omit<
  Booking,
  'contactInfo' | 'createdAt' | 'updatedAt'
>[]
