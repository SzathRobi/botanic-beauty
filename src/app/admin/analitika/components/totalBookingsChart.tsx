'use client'

import { Booking } from '@prisma/client'
import {
  addMonths,
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
} from 'date-fns'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

import { TimeRange } from '../types/timeRange.type'
import { getMaxYAxisTickCount } from '../utils/getMaxYAxisTickCount.util'

const totalBookingsChartConfig = {
  bookings: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

type TotalBookingsChartProps = {
  filteredBookings: Booking[]
  timeRange: TimeRange
}

const TotalBookingsChart = ({
  filteredBookings,
  timeRange,
}: TotalBookingsChartProps) => {
  const numberOfBookingsByDayChart = () => {
    if (timeRange === 'day') {
      const dayRanges = [
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
        '19:00',
      ]

      const dayData = dayRanges.map((dayRange) => ({
        time: dayRange,
        count: filteredBookings.filter((booking) =>
          booking.selectedTimeSlot.includes(dayRange)
        ).length,
      }))

      return dayData
    }

    if (timeRange === 'week') {
      const weekRanges = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

      const weekData = weekRanges.map((weekRange) => ({
        time: weekRange,
        count: filteredBookings.filter((booking) =>
          booking.selectedDate.includes(weekRange)
        ).length,
      }))

      return weekData
    }

    if (timeRange === 'month') {
      // Hetek generálása az aktuális hónapban
      const currentMonthWeeks = eachWeekOfInterval({
        start: startOfMonth(new Date()),
        end: endOfMonth(new Date()),
      })

      const weekData = currentMonthWeeks.map((weekStart) => {
        const weekEnd = endOfWeek(weekStart) // Hét vége

        // A hét dátumtartomány formázása
        const weekRange = `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}`

        // Foglalások szűrése, amelyek a hét tartományába esnek
        const count = filteredBookings.filter((booking) => {
          const bookingDate = new Date(booking.selectedDate) // Szöveg konvertálása dátummá
          return bookingDate >= weekStart && bookingDate <= weekEnd
        }).length

        return { time: weekRange, count }
      })

      return weekData
    }

    if (timeRange === '3month') {
      // Három hónap összes hete
      const threeMonthsWeeks = eachWeekOfInterval({
        start: startOfMonth(addMonths(new Date(), -3)), // Három hónappal korábbi dátum
        end: endOfMonth(new Date()),
      })

      const weekData = threeMonthsWeeks.map((weekStart) => {
        const weekEnd = endOfWeek(weekStart)

        const weekRange = `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}`

        const count = filteredBookings.filter((booking) => {
          const bookingDate = new Date(booking.selectedDate)
          return bookingDate >= weekStart && bookingDate <= weekEnd
        }).length

        return { time: weekRange, count }
      })

      return weekData
    }

    return []
  }

  const highestCount = getMaxYAxisTickCount(
    numberOfBookingsByDayChart(),
    'count'
  )

  return (
    <Card className="overflow-x-auto overflow-y-hidden">
      <CardHeader>
        <CardTitle>Foglalások eloszlása</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          className="max-h-[400px] min-h-[200px] w-[1000px] md:max-h-[480px] md:w-full"
          config={totalBookingsChartConfig}
        >
          <LineChart
            accessibilityLayer
            data={numberOfBookingsByDayChart()}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis dataKey="count" tickCount={highestCount} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="count"
              type="linear"
              stroke="var(--color-bookings)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default TotalBookingsChart
