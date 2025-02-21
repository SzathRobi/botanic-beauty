'use client'

import { Booking, TService } from '@prisma/client'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

import { getMaxYAxisTickCount } from '../../utils/getMaxYAxisTickCount.util'

const numberOfBookingsByServiceChartConfig = {
  bookings: {
    label: 'Foglalások száma',
    color: '#4CAF50',
  },
} satisfies ChartConfig

type ServicePopularityChartProps = {
  salonServices: TService[]
  filteredBookings: Booking[]
}

const ServicePopularityChart = ({
  salonServices,
  filteredBookings,
}: ServicePopularityChartProps) => {
  const bookingData = salonServices.map((service) => {
    const count = filteredBookings.filter(
      (booking) => booking.service.name === service.name
    ).length

    return {
      name: service.name.slice(0, 32),
      bookings: count,
    }
  })

  const highestCount = getMaxYAxisTickCount(bookingData, 'bookings')

  return (
    <Card className="overflow-x-auto overflow-y-hidden">
      <CardHeader>
        <CardTitle>Szolgáltatások népszerűsége</CardTitle>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={numberOfBookingsByServiceChartConfig}
          className="max-h-[400px] min-h-[200px] w-[5000px] md:max-h-[560px]"
        >
          <BarChart accessibilityLayer data={bookingData}>
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              // tickCount={1}
              axisLine={false}
            />
            <YAxis dataKey="bookings" tickCount={highestCount} />
            <Bar dataKey="bookings" fill="var(--color-bookings)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default ServicePopularityChart
