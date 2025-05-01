import { Booking } from '@prisma/client'

export const countBookingsByEmail = (
  bookings: Booking[]
): Record<string, number> => {
  return bookings.reduce(
    (acc, booking) => {
      const email = booking.contactInfo.email
      if (!email) return acc // csak ha van email
      acc[email] = (acc[email] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )
}
