import { Booking } from '@prisma/client'
import { differenceInSeconds, parse, subHours } from 'date-fns'

export const getSecondsToDate = (
  booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>
): number => {
  // Kombináljuk a dátumot és az időt egy ISO formátumú dátum stringgé
  const dateStr =
    booking.selectedDate.split(' ')[1] +
    ' ' +
    booking.selectedDate.split(' ')[2] +
    ' ' +
    booking.selectedDate.split(' ')[3]
  const timeStr = booking.selectedTimeSlot.split(' - ')[0]
  const dateTimeStr = dateStr + ' ' + timeStr
  const targetDate = parse(dateTimeStr, 'MMM dd yyyy HH:mm', new Date())

  // Vonjunk le két órát az így kapott dátumból
  const modifiedTargetDate = subHours(targetDate, 2)

  // Határozzuk meg a jelenlegi időpontot
  const currentDate = new Date()

  // Számítsuk ki a különbséget másodpercekben
  const secondsDifference = differenceInSeconds(modifiedTargetDate, currentDate)

  return secondsDifference
}
