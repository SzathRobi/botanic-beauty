import { Booking } from '@prisma/client'

import { getBookingDateKey } from '@/lib/guest-booking'

export const generateGoogleCalendarLink = (booking: Booking) => {
  const date = getBookingDateKey(booking.selectedDate)
  if (!date) throw new Error('Invalid booking date')
  const [start, end] = booking.selectedTimeSlot.split(' - ')
  const calendarTime = (time: string) =>
    date.replaceAll('-', '') + 'T' + time.replace(':', '') + '00'
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: booking.service.name,
    dates: calendarTime(start) + '/' + calendarTime(end),
    ctz: 'Europe/Budapest',
    details: 'Botanic Beauty Hajszalon időpont',
    location: '1045 Budapest, Széchenyi tér 4/a',
    sf: 'true',
    output: 'xml',
  })
  return 'https://www.google.com/calendar/render?' + params.toString()
}
