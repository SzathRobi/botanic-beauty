'use client'

import { SpecialOpeningHour } from '@prisma/client'
import { MoreHorizontal, Trash2 } from 'lucide-react'
import { Dispatch, useState } from 'react'
import toast from 'react-hot-toast'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/AlertDialog'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { SALON_API_SPECIAL_OPENING_HOURS_ROUTE } from '@/constants/routes.constants'
import { useRemovePointerEvents } from '@/hooks'

type Props = {
  salonId: string
  specialOpeningHour: SpecialOpeningHour
  setSpecialOpeningHours: Dispatch<React.SetStateAction<SpecialOpeningHour[]>>
}

const SpecialOpeningHoursCardMobile = ({
  salonId,
  specialOpeningHour,
  setSpecialOpeningHours,
}: Props) => {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useRemovePointerEvents(isDeleteDialogOpen)

  const deleteSpecialOpeningHourByDate = async (date: Date) => {
    setIsDeleteLoading(true)

    const response = await fetch(
      `/api/${salonId}${SALON_API_SPECIAL_OPENING_HOURS_ROUTE}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date }),
      }
    )

    if (response.status === 403) {
      toast.error('Nincs jogosultsága')
      setIsDeleteLoading(false)
      return
    }

    if (!response.ok) {
      toast.error('Hiba történt a speciális nyitvatartás törlése során.')
      setIsDeleteLoading(false)
      return
    }

    setSpecialOpeningHours((prev) =>
      prev.filter((openingHour) => openingHour.date !== date)
    )
    setIsDeleteLoading(false)
    setIsDeleteDialogOpen(false)
    toast.success('A speciális nyitvatartás törlése sikeres')
  }

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base">
            {specialOpeningHour.date.toLocaleDateString('hu-HU')}
          </CardTitle>
        </div>

        <Badge variant={specialOpeningHour.isOpen ? 'default' : 'destructive'}>
          {specialOpeningHour.isOpen ? 'Nyitva' : 'Zárva'}
        </Badge>
      </CardHeader>

      <CardContent className="flex flex-row justify-between space-y-2 text-sm">
        <div>
          <p>Nyitás: {specialOpeningHour.openingHour}</p>
          <p>Zárás: {specialOpeningHour.closingHour}</p>
        </div>

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Menü megnyitása</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Műveletek</DropdownMenuLabel>
              <DropdownMenuItem>
                <AlertDialogTrigger asChild>
                  <div className="flex justify-start gap-2">
                    <Trash2 className="h-4 w-4" /> Törlés
                  </div>
                </AlertDialogTrigger>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Biztos benne?</AlertDialogTitle>
              <AlertDialogDescription>
                Ez a művelet nem visszafordítható.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Mégse</AlertDialogCancel>

              <Button
                variant="destructive"
                isLoading={isDeleteLoading}
                disabled={isDeleteLoading}
                onClick={() =>
                  deleteSpecialOpeningHourByDate(specialOpeningHour.date)
                }
              >
                Törlés
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}

export default SpecialOpeningHoursCardMobile
