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

  return (
    <div className="min-h-screen w-full">
      <BackgroundBlur className="mb-8 !max-w-full">
        <h1 className="mb-8 text-3xl">Foglalások</h1>

        <BigCalendarContainer
          events={calendarEvents}
          offDays={schedule?.offDays ?? []}
        />
      </BackgroundBlur>
    </div>
  )
}

export default BookingPage
