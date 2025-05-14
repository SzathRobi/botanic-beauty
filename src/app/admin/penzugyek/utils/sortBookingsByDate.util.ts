import { Booking } from '@prisma/client'
import { compareAsc, parseISO } from 'date-fns'

export function sortBookingsByDate(bookings: Booking[]): Booking[] {
  return bookings.sort((a, b) => {
    // Parse selectedDate to Date objects
    const dateA = parseISO(a.selectedDate)
    const dateB = parseISO(b.selectedDate)

    // Compare the dates first
    const dateComparison = compareAsc(dateA, dateB)
    if (dateComparison !== 0) return dateComparison

    // If the dates are the same, compare the time slots
    const timeSlotA = parseTimeSlot(a.selectedTimeSlot)
    const timeSlotB = parseTimeSlot(b.selectedTimeSlot)

    return timeSlotA - timeSlotB
  })
}

function parseTimeSlot(timeSlot: string): number {
  // Assume time slot is in the format 'HH:MM - HH:MM' (e.g. '10:00 - 11:00')
  const [startTime, endTime] = timeSlot.split(' - ').map((time) => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes // Convert to total minutes
  })

  // We'll compare based on the start time of the time slot
  return startTime
}
