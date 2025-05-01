import { Booking } from '@prisma/client'

export const filterBookingsFrom2025 = (bookings: Booking[]): Booking[] => {
  const currentYear = new Date().getFullYear()

  return bookings.filter((booking) => {
    const bookingDate = new Date(booking.selectedDate)
    return bookingDate.getFullYear() === currentYear
  })
}
