import 'react-big-calendar/lib/css/react-big-calendar.css'

import { redirect } from 'next/navigation'

import { getBookings } from '@/actions/booking'
import { getSchedule } from '@/actions/schedule'
import { auth } from '@/auth'
import BackgroundBlur from '@/components/BackgroundBlur'

// import { MOCK_BOOKING } from '@/mocks/booking.mock'
// import { MOCK_SCHEDULE } from '@/mocks/schedule.mock'
// import { MOCK_USER } from '@/mocks/user.mock'
import { mapBookingToEvent } from '../mappers/mapBookingToEvent.mapper'
import BigCalendarContainer from './components/bigCalendarContainer/BigCalendarContainer'
import { countBookingsByEmail } from './utils/countBookingsByEmail.util'
import { filterBookingsFromYear } from './utils/filterBookingsFromYear.util'

const BookingPage = async () => {
  const session = await auth()
  // const session = {
  //   user: MOCK_USER,
  // }

  if (!session?.user) {
    redirect('/admin/bejelentkezes')
  }

  const schedule = await getSchedule()
  // const schedule = MOCK_SCHEDULE

  const bookings = await getBookings()
  // const bookings = [MOCK_BOOKING]

  const calendarEvents = bookings?.map(mapBookingToEvent) ?? []

  const bookingsFrom2025 = filterBookingsFromYear(bookings, 2025)

  const bookingsByEmail = countBookingsByEmail(bookingsFrom2025)

  const test = calendarEvents.filter(
    (calendarEvent) => calendarEvent.remindenEmailJobId
  )

  console.log('test is', test.length)

  return (
    <div className="min-h-screen w-full">
      <BackgroundBlur className="mb-8 !max-w-full">
        <h1 className="mb-8 text-3xl">Foglalások</h1>

        <BigCalendarContainer
          events={calendarEvents}
          offDays={schedule?.offDays ?? []}
          bookingsByEmail={bookingsByEmail}
        />
      </BackgroundBlur>
    </div>
  )
}

export default BookingPage
