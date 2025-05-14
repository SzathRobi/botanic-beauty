import { Booking } from '@prisma/client'

export const filterBookingsFromYear = (
  bookings: Booking[],
  year: number = new Date().getFullYear()
): Booking[] => {
  return bookings.filter((booking) => {
    const bookingDate = new Date(booking.selectedDate)
    return bookingDate.getFullYear() === year
  })
}
