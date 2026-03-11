import { TOffDay } from '@prisma/client'

export const isOffDayOfTimi = (
  dateToCheck: Date,
  offDays: TOffDay[]
): boolean => {
  return offDays.some((offDay) => {
    const offDate = new Date(offDay.date)

    return (
      offDate.getFullYear() === dateToCheck.getFullYear() &&
      offDate.getMonth() === dateToCheck.getMonth() &&
      offDate.getDate() === dateToCheck.getDate() &&
      offDay.person === 'Timi'
    )
  })
}

export const isOffDayOfNemTimi = (
  dateToCheck: Date,
  offDays: TOffDay[]
): boolean => {
  return offDays.some((offDay) => {
    const offDate = new Date(offDay.date)

    return (
      offDate.getFullYear() === dateToCheck.getFullYear() &&
      offDate.getMonth() === dateToCheck.getMonth() &&
      offDate.getDate() === dateToCheck.getDate() &&
      offDay.person === 'nem_Timi'
    )
  })
}
