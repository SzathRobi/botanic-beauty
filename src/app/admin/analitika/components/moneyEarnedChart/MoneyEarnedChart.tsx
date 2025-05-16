'use client'

import { Booking } from '@prisma/client'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'

type MoneyEarnedChartProps = {
  filteredBookings: Booking[]
}

const MoneyEarnedChart = ({ filteredBookings }: MoneyEarnedChartProps) => {
  const totalMoney = filteredBookings.reduce((total, booking) => {
    return total + (booking?.finalPrice ?? 0)
  }, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bevétel</CardTitle>
      </CardHeader>
      <CardContent className="flex h-[75%] items-center justify-center">
        <p className="text-center text-7xl font-medium">{totalMoney} Ft</p>
      </CardContent>
      <CardFooter />
    </Card>
  )
}

export default MoneyEarnedChart
