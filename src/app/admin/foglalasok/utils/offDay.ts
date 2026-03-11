import { TOffDay } from '@prisma/client'

export const isOffDayOfTimi = (
  dateToCheck: Date,
  offDays: TOffDay[]
): boolean => {
  const check = dateToCheck.toLocaleDateString('hu-HU')

  return offDays.some((offDay) => {
    const offDate = new Date(offDay.date).toLocaleDateString('hu-HU')

    return offDate === check && offDay.person === 'Timi'
  })
}

export const isOffDayOfNemTimi = (
  dateToCheck: Date,
  offDays: TOffDay[]
): boolean => {
  const check = dateToCheck.toLocaleDateString('hu-HU')

  return offDays.some((offDay) => {
    const offDate = new Date(offDay.date).toLocaleDateString('hu-HU')

    return offDate === check && offDay.person === 'nem_Timi'
  })
}
