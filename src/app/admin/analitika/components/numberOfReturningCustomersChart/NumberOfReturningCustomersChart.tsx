import { Booking, Customer } from '@prisma/client'
import { isBefore } from 'date-fns'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'

type NumberOfReturningCustomersChartProps = {
  bookings: Booking[]
  customers: Customer[]
}

const NumberOfReturningCustomersChart = ({
  bookings,
  customers,
}: NumberOfReturningCustomersChartProps) => {
  const getNumberOfReturningCustomers = () => {
    const bookingsWithEmails = bookings.map((booking) => ({
      ...booking,
      isReturningCustomer: customers.some(
        (customer) =>
          customer.email === booking.contactInfo.email &&
          isBefore(customer.createdAt, booking.selectedDate)
      ),
    }))

    const uniqueBookings = Array.from(
      new Map(
        bookingsWithEmails.map((booking) => [
          booking.contactInfo.email,
          booking,
        ])
      ).values()
    )

    return uniqueBookings.filter((booking) => booking.isReturningCustomer)
      .length
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visszatérő ügyfelek száma</CardTitle>
      </CardHeader>
      <CardContent className="flex h-[75%] items-center justify-center">
        <p className="text-center text-7xl font-medium">
          {getNumberOfReturningCustomers()}
        </p>
      </CardContent>
      <CardFooter />
    </Card>
  )
}

export default NumberOfReturningCustomersChart
