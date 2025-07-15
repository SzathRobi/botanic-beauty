'use client'

import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { Dispatch, SetStateAction, useState } from 'react'
import { EventProps } from 'react-big-calendar'
import toast from 'react-hot-toast'

import { mapEventToBooking } from '@/app/admin/mappers/mapEventToBooking.mapper'
import { Button } from '@/components/Button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/Popover'
import { Badge } from '@/components/ui/Badge'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/Dialog'
import { Separator } from '@/components/ui/Separator'
import { useRemovePointerEvents } from '@/hooks'

import { CalendarEvent } from '../../../types/calendarEvent.type'
import BigCalendarEventForm from '../bigCalendarEventForm/BigCalendarEventForm'

type BigCalendarDayProps = {
  calendarEvent: EventProps<CalendarEvent>
  discountProgression: string
  setCalendarEvents: Dispatch<SetStateAction<CalendarEvent[]>>
}

const BigCalendarDay = ({
  calendarEvent,
  discountProgression,
  setCalendarEvents,
}: BigCalendarDayProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useRemovePointerEvents(isDialogOpen)

  const {
    event: {
      contactInfo,
      extraServices,
      hairdresser,
      service,
      start,
      end,
      title,
      id,
      isLoaderEvent,
      finalPrice,
      isPaidWithCard,
      isFinanceDone,
    },
  } = calendarEvent

  const startTime = format(start!, 'HH:mm')
  const endTime = format(end!, 'HH:mm')

  const eventColor =
    calendarEvent.event.hairdresser === 'Timi'
      ? 'bg-emerald-600'
      : 'bg-blue-600'

  const [isLoading, setIsLoading] = useState(false)

  const deleteBooking = async (id: string) => {
    setIsLoading(true)
    try {
      const bookingResponse = await fetch(`/api/booking/${id}`, {
        method: 'DELETE',
      })

      const booking = mapEventToBooking(calendarEvent.event)

      const cancelEamilResponse = await fetch('/api/email/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking: {
            ...booking,
            selectedDate: format(booking.selectedDate, 'yyyy-MM-dd'),
          },
        }),
      })

      if (!cancelEamilResponse.ok) {
        toast.error('A foglalás törlő email küldése sikertelen!')
      }

      const data = await bookingResponse.json()

      if (!data.success) {
        toast.error('Hiba történt, a módosítás sikertelen')
        return
      }

      setCalendarEvents((prev) => prev.filter((event) => event.id !== id))
    } catch (error) {
      toast.error('Hiba történt, a módosítás sikertelen')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div className={`${isLoaderEvent && 'opacity-60'}`}>
        {isLoaderEvent ? (
          <div>
            <Loader2 className="h-4 w-4 animate-spin" />{' '}
          </div>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <div className={`h-full p-2 text-sm ${eventColor}`}>
                <p className="mb-2">
                  {startTime} - {endTime}
                </p>
                <p className="mb-2 hidden md:block">{title}</p>
                <p className="hidden md:block">
                  {contactInfo.name} ({discountProgression})
                </p>
              </div>
            </PopoverTrigger>
            <PopoverContent side="right" className="dark max-w-60">
              <p className="mb-2">Foglalási adatok:</p>

              <Separator className="mb-2" />

              <div className={`h-full text-sm`}>
                <p className="mb-2">
                  {startTime} - {endTime}
                </p>

                <p className="mb-2">{title}</p>

                <Separator className="mb-2" />

                {extraServices.length > 0 &&
                  extraServices.map((extraService) => (
                    <p className="mb-2 font-medium" key={extraService.id}>
                      {extraService.name}
                    </p>
                  ))}
              </div>

              <Separator className="mb-2" />

              <div className="mb-2 space-y-1 text-sm">
                <p>
                  {contactInfo.name} {discountProgression}
                </p>

                <p>{contactInfo.email}</p>

                <p>{contactInfo.phone}</p>

                {contactInfo.otherInfo && <p>{contactInfo.otherInfo}</p>}
              </div>

              {isFinanceDone && (
                <div className="mb-6 text-sm">
                  <div className="flex items-center gap-2">
                    {isPaidWithCard ? (
                      <Badge>Kártyás</Badge>
                    ) : (
                      <Badge variant="secondary">Kézpénz</Badge>
                    )}
                    <p>{finalPrice} Ft</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  isLoading={isLoading}
                  onClick={() => deleteBooking(id)}
                >
                  Törlés
                </Button>

                <DialogTrigger asChild>
                  <Button size="sm" variant="secondary">
                    Módosítás
                  </Button>
                </DialogTrigger>
              </div>
            </PopoverContent>

            <DialogContent className="dark">
              <BigCalendarEventForm
                calendarEvent={calendarEvent}
                setCalendarEvents={setCalendarEvents}
                setIsDialogOpen={setIsDialogOpen}
              />
            </DialogContent>
          </Popover>
        )}
      </div>
    </Dialog>
  )
}

export default BigCalendarDay
