'use client'

import { Booking } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { Pen } from 'lucide-react'
import { ChangeEvent, useEffect, useState } from 'react'

import { Button } from '@/components/Button'
import { Badge } from '@/components/ui/Badge'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { DataTableColumnHeader } from '@/components/ui/DataTableHeader'
import { Dialog, DialogContent } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'

import FinanceForm from './financeForm'
import FinanceMobileCard from './financeMobileCard'

const columns: (
  // eslint-disable-next-line no-unused-vars
  openDialog: (booking: Booking) => void
) => ColumnDef<Booking>[] = (openDialog) => [
  {
    id: 'contactInfoName',
    accessorKey: 'contactInfo.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Név" />
    ),
  },
  {
    id: 'serviceName',
    accessorKey: 'service.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Szolgáltatás" />
    ),
  },
  {
    accessorKey: 'selectedDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dátum" />
    ),
    cell: ({ row }) => {
      return new Date(row.original.selectedDate).toLocaleDateString('hu-HU')
    },
  },
  {
    accessorKey: 'selectedTimeSlot',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Időpont" />
    ),
  },
  {
    accessorKey: 'isPaidWithCard',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kártyával fizetett" />
    ),
    cell: ({ row }) => {
      if (row.original.isPaidWithCard === null) {
        return <Badge variant="destructive">Ismeretlen</Badge>
      }

      if (row.original.isPaidWithCard) {
        return <Badge>Igen</Badge>
      }

      return <Badge variant="secondary">Nem</Badge>
    },
  },
  {
    accessorKey: 'finalPrice',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Végösszeg" />
    ),
    cell: ({ row }) => `${row.original.finalPrice} Ft`,
  },
  {
    accessorKey: 'discountPercentage',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kedvezmény" />
    ),
    cell: ({ row }) =>
      row.original.discountPercentage && `${row.original.discountPercentage}%`,
  },
  {
    accessorKey: 'tips',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Borravaló" />
    ),
    cell: ({ row }) => row.original.tips && `${row.original.tips} Ft`,
  },
  {
    accessorKey: 'extraHaircutPrice',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Extra hajvágás" />
    ),
    cell: ({ row }) =>
      row.original.extraHaircutPrice && `${row.original.extraHaircutPrice} Ft`,
  },
  {
    accessorKey: 'miracleBoosterPrice',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Miracle Booster" />
    ),
    cell: ({ row }) =>
      row.original.miracleBoosterPrice &&
      `${row.original.miracleBoosterPrice} Ft`,
  },
  {
    accessorKey: 'extraServices',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Extra szolgáltatások" />
    ),
    cell: ({ row }) => row.original.extraServices.length.toString(),
  },
  {
    accessorKey: 'financeComment',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Megjegyzés" />
    ),
  },
  {
    accessorKey: 'bleachMaterialUsage',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Szőkítő használat" />
    ),
    cell: ({ row }) => `${row.original.bleachMaterialUsage}g`,
  },
  {
    accessorKey: 'dyeMaterialUsage',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Szőkítő használat" />
    ),
    cell: ({ row }) => `${row.original.dyeMaterialUsage}g`,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const booking = row.original

      return (
        <Button
          size="iconSmall"
          variant="secondary"
          onClick={() => openDialog(booking)}
        >
          <Pen size={16} />
        </Button>
      )
    },
  },
]

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
                  <p className="max-w-80 flex-1">{booking.contactInfo.name}</p>
                  <p className="flex-1">{booking.service.name}</p>
                  <p className="flex-1">
                    {new Date(booking.selectedDate).toLocaleDateString('hu-HU')}{' '}
                    - {booking.selectedTimeSlot}
                  </p>
                  {/* <p className="flex-1">
                    extra szolgáltatások ({booking.extraServices.length})
                  </p> */}
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
              <div className="md:hidden">
                {bookingsWithFianceDone.map((booking) => (
                  <FinanceMobileCard
                    key={booking.id}
                    booking={booking}
                    selectedBooking={selectedBooking}
                    setSelectedBooking={setSelectedBooking}
                    setIsDialogOpen={setIsDialogOpen}
                  />
                ))}
              </div>

              <div className="hidden md:block">
                <DataTable
                  data={bookingsWithFianceDone}
                  columns={columns(openDialog)}
                  attributeFilter1="contactInfoName"
                  visibleColumns={{
                    contactInfoName: true,
                    serviceName: true,
                    selectedDate: true,
                    selectedTimeSlot: true,
                    isPaidWithCard: true,
                    finalPrice: true,
                    discountPercentage: true,
                    tips: true,
                    extraHaircutPrice: false,
                    miracleBoosterPrice: false,
                    extraServices: false,
                    financeComment: false,
                    bleachMaterialUsage: false,
                    dyeMaterialUsage: false,
                  }}
                />
              </div>
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
