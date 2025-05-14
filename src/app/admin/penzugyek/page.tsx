import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import prisma from '@/lib/db'

import { filterBookingsFromDate } from '../foglalasok/utils/filterBookingsFromDate.util'
import FinanceTabs from './components/financeTabs'
import { sortBookingsByDate } from './utils/sortBookingsByDate.util'

const FinancePage = async () => {
  const session = await auth()

  if (!session?.user) {
    redirect('/admin/bejelentkezes')
  }

  const bookings = await prisma.booking.findMany()

  const bookingsFromDate = filterBookingsFromDate(bookings, 2025, 5, 14)

  const bookingsFromDateInOrder = sortBookingsByDate(bookingsFromDate)

  return (
    <div className="sm:container">
      <FinanceTabs bookings={bookingsFromDateInOrder} />
    </div>
  )
}

export default FinancePage
