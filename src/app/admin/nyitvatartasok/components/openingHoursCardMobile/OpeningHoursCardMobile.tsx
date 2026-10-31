'use client'

import { OpeningHour } from '@prisma/client'

import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

import { getI18nDay } from '../../utils/getI18nDay.util'

type Props = {
  openingHour: OpeningHour
}

const OpeningHoursCardMobile = ({ openingHour }: Props) => {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base">
            {getI18nDay(openingHour.day)}
          </CardTitle>
        </div>

        <Badge variant={openingHour.isOpen ? 'default' : 'destructive'}>
          {openingHour.isOpen ? 'Nyitva' : 'Zárva'}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        <p>Nyitás: {openingHour.openingHour}</p>
        <p>Zárás: {openingHour.closingHour}</p>
      </CardContent>
    </Card>
  )
}

export default OpeningHoursCardMobile
