import { TOffDay } from '@prisma/client'

const addThreeHours = (date: Date | string) => {
  const d = new Date(date)
  d.setHours(d.getHours() + 3)
  return d
}

export const isOffDayOfTimi = (
  dateToCheck: Date,
  offDays: TOffDay[]
): boolean => {
  const check = addThreeHours(dateToCheck).toLocaleDateString('hu-HU')

  return offDays.some((offDay) => {
    const offDate = addThreeHours(offDay.date).toLocaleDateString('hu-HU')

    return offDate === check && offDay.person === 'Timi'
  })
}

export const isOffDayOfNemTimi = (
  dateToCheck: Date,
  offDays: TOffDay[]
): boolean => {
  const check = addThreeHours(dateToCheck).toLocaleDateString('hu-HU')

  return offDays.some((offDay) => {
    const offDate = addThreeHours(offDay.date).toLocaleDateString('hu-HU')

    return offDate === check && offDay.person === 'nem_Timi'
  })
}
