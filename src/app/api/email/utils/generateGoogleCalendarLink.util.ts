import { Booking } from '@prisma/client'

export const generateGoogleCalendarLink = (booking: Booking) => {
  const eventTitle = encodeURIComponent(booking.service.name)
  const details = encodeURIComponent('Botanic Beauty Hajszalon időpont')
  const location = encodeURIComponent('1045 Budapest, Széchenyi tér 4/a')

  // `selectedDate` stringként van tárolva, így először Date objektummá alakítjuk
  const date = new Date(booking.selectedDate)

  // `selectedTimeSlot` -> "10:00 - 11:00" formátum, ezt daraboljuk
  const [startHour, startMinute] = booking.selectedTimeSlot
    .split(' - ')[0]
    .split(':')
    .map(Number)
  const [endHour, endMinute] = booking.selectedTimeSlot
    .split(' - ')[1]
    .split(':')
    .map(Number)

  // Kezdési és befejezési időpontot a megfelelő dátumra állítjuk
  const startDate = new Date(date.setHours(startHour, startMinute, 0))
  const endDate = new Date(date.setHours(endHour, endMinute, 0))

  // ISO 8601 formátum (YYYYMMDDTHHMMSSZ) UTC-ben
  const start = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const end = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${start}/${end}&details=${details}&location=${location}&sf=true&output=xml`
}
