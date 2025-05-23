'use client'

import { Booking } from '@prisma/client'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'

type DyeMaterialUsageChartProps = {
  filteredBookings: Booking[]
}

const DyeMaterialUsageChart = ({
  filteredBookings,
}: DyeMaterialUsageChartProps) => {
  const totalBleachMaterialUsage = filteredBookings.reduce((total, booking) => {
    return total + (booking?.dyeMaterialUsage ?? 0)
  }, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Festék használat</CardTitle>
      </CardHeader>
      <CardContent className="flex h-[75%] items-center justify-center">
        <p className="text-center text-7xl font-medium">
          {totalBleachMaterialUsage} g
        </p>
      </CardContent>
      <CardFooter />
    </Card>
  )
}

export default DyeMaterialUsageChart
