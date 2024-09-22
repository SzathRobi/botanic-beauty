import { Hairdresser } from '@prisma/client'

export type SelectedDate = {
  date: Date
  displayMonth: Date
  person: Hairdresser
}
