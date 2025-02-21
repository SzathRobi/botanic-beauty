import { redirect } from 'next/navigation'

import { getBookings } from '@/actions/booking'
import { getCustomers } from '@/actions/customer.action'
import { auth } from '@/auth'

import AnalyticsContainer from './components/analyticsContainer'

const AnalyticsPage = async () => {
  const session = await auth()

  if (!session?.user) {
    redirect('/admin/bejelentkezes')
  }

  const bookings = await getBookings()

  const customers = await getCustomers()

  return (
    <div className="mx-auto pt-10 lg:container">
      <AnalyticsContainer bookings={bookings} customers={customers} />
    </div>
  )
}

export default AnalyticsPage
