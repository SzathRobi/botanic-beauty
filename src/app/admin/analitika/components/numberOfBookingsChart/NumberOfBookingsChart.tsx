import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'

type NumberOfBookingsChartProps = {
  numberOfBookings: number
}

const NumberOfBookingsChart = ({
  numberOfBookings,
}: NumberOfBookingsChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Összes foglalás</CardTitle>
      </CardHeader>
      <CardContent className="flex h-[75%] items-center justify-center">
        <p className="text-center text-7xl font-medium">{numberOfBookings}</p>
      </CardContent>
      <CardFooter />
    </Card>
  )
}

export default NumberOfBookingsChart
