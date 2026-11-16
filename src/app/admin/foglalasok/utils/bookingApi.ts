import type { Booking } from '@prisma/client'

export type BookingNotifications = {
  emailSent: boolean | null
  reminderUpdated: boolean | null
}

const requestBooking = async (
  url: string,
  method: string,
  body?: Partial<Booking>
) => {
  let response: Response
  let result
  try {
    response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}),
    })
    result = await response.json()
  } catch {
    throw new Error(
      'Nem sikerült elérni a szervert. Ellenőrizd a kapcsolatot, majd frissítsd a naptárt.'
    )
  }
  if (!response.ok || !result?.success) {
    if (response.status === 401)
      throw new Error('A munkamenet lejárt. Kérlek jelentkezz be újra.')
    if (result?.message === 'Overlap with existing booking')
      throw new Error('A kiválasztott időpont ütközik egy másik foglalással.')
    if (result?.message === 'Time slot is not available')
      throw new Error(
        'A kiválasztott nap múltbeli, vagy a fodrász szabadságon van.'
      )
    if (
      result?.message === 'Invalid booking duration' ||
      result?.message === 'Invalid booking time'
    )
      throw new Error('Az időpont vagy a szolgáltatás időtartama érvénytelen.')
    if (response.status === 404)
      throw new Error(
        'A foglalás már nem található. Kérlek frissítsd a naptárt.'
      )
    throw new Error(
      method === 'DELETE'
        ? 'A foglalás törlése sikertelen.'
        : method === 'POST'
          ? 'A foglalás létrehozása sikertelen.'
          : 'A foglalás módosítása sikertelen.'
    )
  }
  return result as { data: Booking; notifications: BookingNotifications }
}

export const updateBooking = (id: string, changes: Partial<Booking>) =>
  requestBooking(`/api/booking/${encodeURIComponent(id)}`, 'PATCH', changes)
export const deleteBooking = (id: string) =>
  requestBooking(`/api/booking/${encodeURIComponent(id)}`, 'DELETE')
export const createBooking = (booking: Partial<Booking>) =>
  requestBooking('/api/admin/bookings', 'POST', booking)

export const getNotificationWarning = (
  notifications?: BookingNotifications
) => {
  if (
    notifications?.emailSent === false ||
    notifications?.reminderUpdated === false
  ) {
    return 'A foglalás változását rögzítettük, de az email vagy az emlékeztető kezelése nem sikerült.'
  }
  return null
}
