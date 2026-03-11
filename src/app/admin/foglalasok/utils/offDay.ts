import { TOffDay } from '@prisma/client'
import { format } from 'date-fns'

export const isOffDayOfTimi = (
  dateToCheck: Date,
  OffDays: TOffDay[]
): boolean => {
  return OffDays.some(
    (offDay) =>
      format(new Date(offDay.date), 'yyyy-MM-dd') ===
        format(dateToCheck, 'yyyy-MM-dd') && offDay.person === 'Timi'
  )
}

export const isOffDayOfNemTimi = (
  dateToCheck: Date,
  OffDays: TOffDay[]
): boolean => {
  return OffDays.some(
    (offDay) =>
      format(new Date(offDay.date), 'yyyy-MM-dd') ===
        format(dateToCheck, 'yyyy-MM-dd') && offDay.person === 'nem_Timi'
  )
}
