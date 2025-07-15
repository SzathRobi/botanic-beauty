'use client'

import { Booking } from '@prisma/client'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

import { Button } from '@/components/Button'
import { Badge } from '@/components/ui/Badge'

type FinanceMobileCardProps = {
  booking: Booking
  selectedBooking: Booking | null
  setSelectedBooking: Dispatch<SetStateAction<Booking | null>>
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>
}

const FinanceMobileCard = ({
  booking,
  selectedBooking,
  setSelectedBooking,
  setIsDialogOpen,
}: FinanceMobileCardProps) => {
  const isSelected = selectedBooking?.id === booking.id

  const toggleDetails = () => {
    if (selectedBooking?.id === booking.id) {
      setSelectedBooking(null)
    } else {
      setSelectedBooking(booking)
    }
  }

  const openDialog = () => {
    setSelectedBooking(booking)
    setIsDialogOpen(true)
  }

  return (
    <div
      key={booking.id}
      className="mb-2 flex w-full flex-col items-start justify-between gap-4 border p-4 text-left md:flex-row md:items-center"
    >
      <p>{booking.contactInfo.name}</p>
      <p>{booking.service.name}</p>
      <p>
        {new Date(booking.selectedDate).toLocaleDateString('hu-HU')} -{' '}
        {booking.selectedTimeSlot}
      </p>

      {booking.isPaidWithCard === null ? (
        <div className="flex items-center gap-2">
          <Badge variant="destructive">Ismeretlen</Badge>
          {booking.finalPrice} Ft
        </div>
      ) : booking.isPaidWithCard === true ? (
        <div className="flex items-center gap-2">
          <Badge>Kártya</Badge>
          {booking.finalPrice} Ft
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Kézpénz</Badge>
          {booking.finalPrice} Ft
        </div>
      )}

      {booking.tips && (
        <div>
          <p className="text-sm">Borravaló</p>
          <p>{booking.tips} Ft</p>
        </div>
      )}

      {booking.discountPercentage && (
        <div>
          <p className="text-sm">Kedvezmény</p>
          <p>{booking.discountPercentage} %</p>
        </div>
      )}

      <Button
        className="flex w-full items-center gap-2"
        variant="outline"
        onClick={toggleDetails}
      >
        {isSelected ? (
          <>
            Bezár <ArrowUp className="size-4" />
          </>
        ) : (
          <>
            Részletek <ArrowDown className="size-4" />
          </>
        )}
      </Button>

      <div
        className={`${isSelected ? 'max-h-96' : 'max-h-0'} w-full overflow-y-auto transition-all duration-200`}
      >
        {booking.dyeMaterialUsage && booking.dyeMaterialUsage > 0 && (
          <div className="mb-2">
            <p className="text-sm">Festék</p>
            <p>{booking.dyeMaterialUsage}g</p>
          </div>
        )}
        {booking.bleachMaterialUsage && booking.bleachMaterialUsage > 0 && (
          <div className="mb-2">
            <p className="text-sm">Szőkítő</p>
            <p>{booking.bleachMaterialUsage}g</p>
          </div>
        )}
        {booking.extraServices.length > 0 && (
          <div className="mb-2">
            <p className="text-sm">Extra szolgáltatások</p>
            <p>{booking.extraServices.length}</p>
          </div>
        )}
        {booking.financeComment && (
          <div className="mb-2">
            <p className="text-sm">Megjegyzés</p>
            <p>{booking.financeComment}</p>
          </div>
        )}
        {booking.miracleBoosterPrice && (
          <div className="mb-2">
            <p className="text-sm">Miracle Booster ár</p>
            <p>{booking.miracleBoosterPrice}</p>
          </div>
        )}
        {booking.extraHaircutPrice && (
          <div className="mb-2">
            <p className="text-sm">Extra hajvágás ár</p>
            <p>{booking.extraHaircutPrice}</p>
          </div>
        )}
      </div>

      <div className="dark w-full">
        <Button onClick={openDialog} className="w-full text-white">
          Módosítás
        </Button>
      </div>
    </div>
  )
}

export default FinanceMobileCard
