'use client'

import { Booking } from '@prisma/client'
import { ChangeEvent, useEffect, useState } from 'react'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { Dialog, DialogContent } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'

import FinanceForm from './financeForm'

type FinanceTabsProps = {
  bookings: Booking[]
}

const FinanceTabs = ({ bookings }: FinanceTabsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [allBookings, setAllBookings] = useState<Booking[]>(bookings)
  const [bookingsWithFianceDone, setBookingsWithFianceDone] = useState<
    Booking[]
  >(allBookings.filter((booking) => booking.isFinanceDone))
  const [bookingsWithoutFianceDone, setBookingsWithoutFianceDone] = useState<
    Booking[]
  >(allBookings.filter((booking) => !booking.isFinanceDone))
  const [
    bookingsWithFinanceDoneSearchValue,
    setBookingsWithFinanceDoneSearchValue,
  ] = useState('')
  const [
    bookingsWithoutFinanceDoneSearchValue,
    setBookingsWithoutFinanceDoneSearchValue,
  ] = useState('')

  const openDialog = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsDialogOpen(true)
  }

  const onSearchInBookingsWithoutFinanceDone = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setBookingsWithoutFinanceDoneSearchValue(event.target.value)
    const filteredBookings = allBookings.filter(
      (booking) =>
        !booking.isFinanceDone &&
        booking.contactInfo.name
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
    )
    setBookingsWithoutFianceDone(filteredBookings)
  }

  const onSearchInBookingsWithFinanceDone = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setBookingsWithFinanceDoneSearchValue(event.target.value)
    const filteredBookings = allBookings.filter(
      (booking) =>
        booking.isFinanceDone &&
        booking.contactInfo.name
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
    )
    setBookingsWithFianceDone(filteredBookings)
  }

  useEffect(() => {
    setBookingsWithFianceDone(
      allBookings.filter((booking) => booking.isFinanceDone)
    )
    setBookingsWithoutFianceDone(
      allBookings.filter((booking) => !booking.isFinanceDone)
    )
  }, [allBookings])

  return (
    <div>
      <Tabs defaultValue="pending">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">Függőben</TabsTrigger>
          <TabsTrigger value="done">Kész</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Elszámolásra váró foglalások</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 max-w-xs">
                <Label>
                  <span className="mb-1">Keresés (név)</span>
                  <Input
                    value={bookingsWithoutFinanceDoneSearchValue}
                    onChange={onSearchInBookingsWithoutFinanceDone}
                  />
                </Label>
              </div>

              {bookingsWithoutFianceDone.map((booking) => (
                <button
                  key={booking.id}
                  className="mb-2 flex w-full flex-col items-start justify-between gap-4 border p-4 text-left md:flex-row md:items-center"
                  onClick={() => openDialog(booking)}
                >
                  <p>{booking.contactInfo.name}</p>
                  <p>{booking.service.name}</p>
                  <p>
                    {new Date(booking.selectedDate).toLocaleDateString('hu-HU')}{' '}
                    - {booking.selectedTimeSlot}
                  </p>
                  <p>extra szolgáltatások ({booking.extraServices.length})</p>
                </button>
              ))}
            </CardContent>
            <CardFooter />
          </Card>
        </TabsContent>

        <TabsContent value="done">
          <Card>
            <CardHeader>
              <CardTitle>Elszámolt foglalások</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 max-w-xs">
                <Label>
                  <span className="mb-1">Keresés (név)</span>
                  <Input
                    value={bookingsWithFinanceDoneSearchValue}
                    onChange={onSearchInBookingsWithFinanceDone}
                  />
                </Label>
              </div>

              {bookingsWithFianceDone.map((booking) => (
                <div
                  key={booking.id}
                  className="mb-2 flex w-full flex-col items-start justify-between gap-4 border p-4 text-left md:flex-row md:items-center"
                >
                  <p>{booking.contactInfo.name}</p>
                  <p>{booking.service.name}</p>
                  <p>
                    {new Date(booking.selectedDate).toLocaleDateString('hu-HU')}{' '}
                    - {booking.selectedTimeSlot}
                  </p>
                  <p>extra szolgáltatások ({booking.extraServices.length})</p>
                  <p>végösszeg: {booking.finalPrice} Ft</p>
                  <p>festék: {booking.dyeMaterialUsage}g</p>
                  <p>szőkítő: {booking.bleachMaterialUsage}g</p>
                </div>
              ))}
            </CardContent>
            <CardFooter />
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="dark max-w-xl">
          {selectedBooking && (
            <FinanceForm
              selectedBooking={selectedBooking}
              setAllBookings={setAllBookings}
              setIsDialogOpen={setIsDialogOpen}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default FinanceTabs
