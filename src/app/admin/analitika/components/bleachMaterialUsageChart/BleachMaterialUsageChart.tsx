'use client'

import { Booking } from '@prisma/client'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'

type BleachMaterialUsageChartProps = {
  filteredBookings: Booking[]
}

const BleachMaterialUsageChart = ({
  filteredBookings,
}: BleachMaterialUsageChartProps) => {
  console.log(filteredBookings)

  const totalBleachMaterialUsage = filteredBookings.reduce((total, booking) => {
    return total + (booking?.bleachMaterialUsage ?? 0)
  }, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Szőkítő használat</CardTitle>
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

export default BleachMaterialUsageChart
