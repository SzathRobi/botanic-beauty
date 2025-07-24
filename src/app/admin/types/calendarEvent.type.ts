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
  extraServices: TService[]
  createdAt: Date
  updatedAt: Date
  isLoaderEvent?: boolean
  isFinanceDone?: boolean
  finalPrice?: number
  isPaidWithCard?: boolean
  tips?: number
  discountPercentage?: number
  financeComment?: string
  dyeMaterialUsage?: number
  bleachMaterialUsage?: number
  extraHaircutPrice?: number
  miracleBoosterPrice?: number
  remindenEmailJobId?: string
}
