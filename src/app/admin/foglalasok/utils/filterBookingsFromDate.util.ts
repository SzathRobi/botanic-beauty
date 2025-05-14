import { Booking } from '@prisma/client'

export const filterBookingsFromDate = (
  bookings: Booking[],
  year: number = new Date().getFullYear(),
  month: number = new Date().getMonth() + 1, // Január = 0, ezért +1
  day: number = new Date().getDate()
): Booking[] => {
  // A megadott év, hónap, nap alapján létrehozunk egy Date objektumot
  const startDate = new Date(year, month - 1, day) // hónap - 1, mert 0-tól indexel

  return bookings.filter((booking) => {
    const bookingDate = new Date(booking.selectedDate)
    return bookingDate >= startDate // Csak a későbbi vagy ugyanazon a napon lévő foglalások
  })
}
