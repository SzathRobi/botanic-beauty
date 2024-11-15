import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { BOOKING_ROUTE } from '@/constants/routes.constants'
import { formatDuration } from '@/lib/utils'

import { Service } from '../../types/service.type'

type ServiceCardProps = {
  service: Service
  index: number
}

const ServiceCard = ({ service, index }: ServiceCardProps) => {
  return (
    <Card
      className={`mb-8 items-start gap-4 border-none bg-black/0 lg:flex lg:p-4 ${index % 2 === 0 ? 'lg:flex-row-reverse' : 'flex-row'}`}
    >
      <Image
        src={service.image}
        className="w-full rounded-lg object-cover lg:max-h-[400px] lg:w-auto"
        alt={service.name}
        width={320}
        height={320}
      />

      <div>
        <CardHeader>
          <CardTitle>{service.name}</CardTitle>

          <p className="mb-2 text-sm text-muted-foreground">
            {formatDuration(service.duration)}
          </p>

          <CardDescription>{service.shortDescription}</CardDescription>
        </CardHeader>

        <CardContent className="mb-12 min-h-44">
          <p>{service.longDescription}</p>
        </CardContent>

        <CardFooter>
          <Button asChild className="text-white">
            <Link href={`${BOOKING_ROUTE}?${service.queryParam}`}>
              Foglalj időpontot
            </Link>
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
}

export default ServiceCard
