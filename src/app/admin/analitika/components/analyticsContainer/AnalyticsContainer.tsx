'use client'

import { Bar, BarChart, XAxis, YAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'

type AnalyticsContainerProps = {
  thisWeekNewCustomersCount: number
  lastWeekNewCustomersCount: number
  percentChange: number
}

const AnalyticsContainer = ({
  thisWeekNewCustomersCount,
  lastWeekNewCustomersCount,
  percentChange,
}: AnalyticsContainerProps) => {
  return (
    <div>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Új ügyfelek ezen a héten</CardDescription>
          <CardTitle className="text-4xl">
            {thisWeekNewCustomersCount}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            {`${percentChange}% ${percentChange > 0 ? 'növekedés' : 'csökkenés'} előző héthez képest`}
          </div>
        </CardContent>
        <CardFooter>
          <Progress value={percentChange} aria-label="25% increase" />
        </CardFooter>
      </Card>
    </div>
  )
}

export default AnalyticsContainer
