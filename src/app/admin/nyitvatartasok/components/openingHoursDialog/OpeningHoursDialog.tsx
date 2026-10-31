'use client'

import { OpeningHour } from '@prisma/client'
import { CalendarCog } from 'lucide-react'
import { Dispatch, SetStateAction, useState } from 'react'

import { Button } from '@/components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog'

import OpeningHoursForm from '../openingHoursForm/OpeningHoursForm'

type openingHoursDialogProps = {
  openingHours: OpeningHour[]
  salonId: string
  setOpeningHours: Dispatch<SetStateAction<OpeningHour[]>>
  isTriggerFullWidth?: boolean
}

const OpeningHoursDialog = ({
  openingHours,
  setOpeningHours,
  salonId,
  isTriggerFullWidth = false,
}: openingHoursDialogProps) => {
  const [isOpeningHoursFormOpen, setIsOpeningFormOpen] = useState(false)

  return (
    <Dialog open={isOpeningHoursFormOpen} onOpenChange={setIsOpeningFormOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className={`${isTriggerFullWidth && 'w-full'}`}>
          <CalendarCog className="mr-2" size={16} /> Nyitvatartás módosítása
        </Button>
      </DialogTrigger>
      <DialogContent className="dark text-foreground">
        <DialogHeader>
          <DialogTitle>Nyitvatartási idő módosítása</DialogTitle>
        </DialogHeader>

        <OpeningHoursForm
          salonId={salonId}
          openingHours={openingHours}
          setIsOpeningHoursFormOpen={setIsOpeningFormOpen}
          setOpeningHours={setOpeningHours}
        />
      </DialogContent>
    </Dialog>
  )
}

export default OpeningHoursDialog
