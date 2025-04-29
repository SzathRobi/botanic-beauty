import { Booking } from '@prisma/client'

export const getNextBooking = (bookings: Booking[], booking: Booking) => {
  // Szűrés a fodrász alapján
  const filteredBookings = bookings.filter(
    (b) => b.hairdresser === booking.hairdresser
  )

  // Rendezés időrend szerint (selectedDate + selectedTimeSlot)
  filteredBookings.sort((a, b) => {
    const dateTimeA =
      new Date(a.selectedDate).getTime() +
      parseInt(a.selectedTimeSlot.split(':')[0]) * 60 * 60 * 1000
    const dateTimeB =
      new Date(b.selectedDate).getTime() +
      parseInt(b.selectedTimeSlot.split(':')[0]) * 60 * 60 * 1000
    return dateTimeA - dateTimeB
  })

  // Az aktuális foglalás időpontja
  const bookingTime =
    new Date(booking.selectedDate).getTime() +
    parseInt(booking.selectedTimeSlot.split(':')[0]) * 60 * 60 * 1000

  // Következő foglalás keresése
  return (
    filteredBookings.find((b) => {
      const bTime =
        new Date(b.selectedDate).getTime() +
        parseInt(b.selectedTimeSlot.split(':')[0]) * 60 * 60 * 1000
      return bTime > bookingTime
    }) || null
  )
}
