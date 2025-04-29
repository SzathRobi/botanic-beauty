import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'

type NumberOfCustomersChartProps = {
  numberOfCustomers: number
}

const NumberOfCustomersChart = ({
  numberOfCustomers,
}: NumberOfCustomersChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Összes ügyfél</CardTitle>
      </CardHeader>
      <CardContent className="flex h-[75%] items-center justify-center">
        <p className="text-center text-7xl font-medium">{numberOfCustomers}</p>
      </CardContent>
      <CardFooter />
    </Card>
  )
}

export default NumberOfCustomersChart
