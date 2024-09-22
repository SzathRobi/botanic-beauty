import { Booking, Customer } from '@prisma/client'
import { endOfWeek, isWithinInterval, startOfWeek, subWeeks } from 'date-fns'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import BackgroundBlur from '@/components/BackgroundBlur'
import prisma from '@/lib/db'

import AnalyticsContainer from './components/analyticsContainer/AnalyticsContainer'

const AnalyticsPage = async () => {
  const session = await auth()

  if (!session?.user) {
    redirect('/admin/bejelentkezes')
  }

  const customers: Customer[] = await prisma.customer.findMany()
  const bookings: Booking[] = await prisma.booking.findMany()

  const thisWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 }) // Hétfőtől indul a hét
  const thisWeekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })

  const lastWeekStart = startOfWeek(subWeeks(new Date(), 1), {
    weekStartsOn: 1,
  })
  const lastWeekEnd = endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 })

  const thisWeekNewCustomersCount = customers.filter((customer) =>
    isWithinInterval(new Date(customer.createdAt), {
      start: thisWeekStart,
      end: thisWeekEnd,
    })
  ).length

  const lastWeekNewCustomersCount = customers.filter((customer) =>
    isWithinInterval(new Date(customer.createdAt), {
      start: lastWeekStart,
      end: lastWeekEnd,
    })
  ).length

  const percentChange =
    lastWeekNewCustomersCount === 0
      ? thisWeekNewCustomersCount > 0
        ? 100
        : 0 // Ha múlt héten 0 volt, akkor most 100% a növekedés, ha van adat.
      : ((thisWeekNewCustomersCount - lastWeekNewCustomersCount) /
          lastWeekNewCustomersCount) *
        100

  return (
    <div className="container min-h-[calc(100vh-80px)] px-0">
      <BackgroundBlur className="mx-auto lg:max-w-full">
        <AnalyticsContainer
          thisWeekNewCustomersCount={thisWeekNewCustomersCount}
          lastWeekNewCustomersCount={lastWeekNewCustomersCount}
          percentChange={percentChange}
        />
      </BackgroundBlur>
    </div>
  )
}

export default AnalyticsPage
