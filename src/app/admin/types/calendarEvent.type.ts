import { Hairdresser, TService } from '@prisma/client'
import { Event } from 'react-big-calendar'

type CalendarEventContactInfo = {
  name: string
  email: string
  phone: string
  otherInfo: string | null
}

export type CalendarEvent = Event & {
  id: string
  hairdresser: Hairdresser
  contactInfo: CalendarEventContactInfo
  service: TService
  extraService: TService | null
  createdAt: Date
  updatedAt: Date
  isLoaderEvent?: boolean
}
