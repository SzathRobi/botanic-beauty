'use client'

import './BigCalendarEventForm.override.css'

import { zodResolver } from '@hookform/resolvers/zod'
import { Booking, TService } from '@prisma/client'
import {
  addMinutes,
  format,
  isBefore,
  isSameDay,
  isSaturday,
  isSunday,
  parse,
  set,
  subMinutes,
} from 'date-fns'
import { hu } from 'date-fns/locale'
import { Dispatch, SetStateAction, useState } from 'react'
import { EventProps } from 'react-big-calendar'
import { DayPicker } from 'react-day-picker'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

import { mapEventToBooking } from '@/app/admin/mappers/mapEventToBooking.mapper'
import { CalendarEvent } from '@/app/admin/types/calendarEvent.type'
import { getSecondsToDate } from '@/app/idopontfoglalas/utils/getSecondsToDate'
import { Button } from '@/components/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'
import { Separator } from '@/components/ui/Separator'
import { EXTRA_SERVICES, SERVICES } from '@/constants/services.constants'

import { eventFormSchema } from '../../schemas/eventFormSchema'

type BigCalendarEventFormProps = {
  calendarEvent: EventProps<CalendarEvent>
  setCalendarEvents: Dispatch<SetStateAction<CalendarEvent[]>>
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>
}

const BigCalendarEventForm = ({
  calendarEvent,
  setCalendarEvents,
  setIsDialogOpen,
}: BigCalendarEventFormProps) => {
  const booking = mapEventToBooking(calendarEvent.event)

  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(booking.selectedDate)
  )
  const [selectedService, setSelectedService] = useState(booking.service)

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      hairdresser: calendarEvent.event.hairdresser,
      startTime: booking.selectedTimeSlot.split(' - ')[0],
      endTime: booking.selectedTimeSlot.split(' - ')[1],
      service: calendarEvent.event.service,
      extraServices: calendarEvent.event.extraServices,
      name: calendarEvent.event.contactInfo.name,
      email: calendarEvent.event.contactInfo.email,
      phone: calendarEvent.event.contactInfo.phone,
      otherInfo: calendarEvent.event.contactInfo?.otherInfo,
    },
  })

  const onStartTimeChange = (event: any, fieldOnchange: any) => {
    fieldOnchange(event)

    const startTime = form.getValues('startTime')
    const service = form.getValues('service')

    const startDateTime = parse(startTime, 'HH:mm', new Date())

    let endDateTime = addMinutes(startDateTime, service.duration)

    const extraServices = form.getValues('extraServices')

    if (extraServices.length > 0) {
      // TODO: kell az uj extra service is (miracle booster)
      endDateTime = addMinutes(endDateTime, extraServices[0].duration)
    }

    form.setValue('endTime', format(endDateTime, 'HH:mm'))
  }

  const onServiceSelectChange = (serviceName: string) => {
    const service =
      SERVICES.find((service) => service.name === serviceName) || SERVICES[0]

    form.setValue('service', service)
    setSelectedService(service)

    const newEndDateTime = addMinutes(
      parse(form.getValues('startTime'), 'HH:mm', new Date()),
      service.duration
    )

    form.setValue('endTime', format(newEndDateTime, 'HH:mm'))
  }

  const onExtraServiceChange = (checked: boolean, serviceName: string) => {
    const extraService = EXTRA_SERVICES.find(
      (service) => service.name === serviceName
    )

    if (!extraService) {
      return
    }

    if (checked) {
      form.setValue('extraServices', [
        ...form.getValues('extraServices'),
        extraService,
      ])
      form.setValue(
        'endTime',
        format(
          addMinutes(
            parse(form.getValues('endTime'), 'HH:mm', new Date()),
            extraService.duration
          ),
          'HH:mm'
        )
      )
    } else {
      form.setValue(
        'extraServices',
        form
          .getValues('extraServices')
          .filter((service) => service.name !== extraService.name)
      )
      form.setValue(
        'endTime',
        format(
          subMinutes(
            parse(form.getValues('endTime'), 'HH:mm', new Date()),
            extraService.duration
          ),
          'HH:mm'
        )
      )
    }
  }

  const handleSelect = (day: Date | undefined) => {
    if (day) {
      setSelectedDate(day)
    }
  }

  const updateBooking = async (booking: Partial<Booking>) => {
    const response = await fetch(`/api/booking/${booking.id}`, {
      method: 'PATCH',
      body: JSON.stringify(booking),
    })

    if (!response.ok) {
      toast.error('Hiba történt, a módosítás sikertelen')
      return
    }

    return await response.json()
  }

  const sendModifierEmail = async (booking: Partial<Booking>) => {
    const bookingWithFormattedDate = {
      ...booking,
      selectedDate: format(booking.selectedDate!, 'yyyy-MM-dd'),
    }

    const emailResponse = await fetch('/api/email/modifier', {
      method: 'POST',
      body: JSON.stringify({
        booking: bookingWithFormattedDate,
        emailDelayInSeconds: getSecondsToDate(booking as Booking),
      }),
    })

    if (!emailResponse.ok) {
      toast.error('A módosító email nem ment ki')

      return
    }

    return await emailResponse.json()
  }

  const deleteBookingData = async (id: string) => {
    const response = await fetch(`/api/booking/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      toast.error('Hiba történt, a módosítás sikertelen')
      return
    }

    return await response.json()
  }

  const onSubmit = async (values: z.infer<typeof eventFormSchema>) => {
    setIsLoading(true)

    const selectedTimeSlot = `${values.startTime} - ${values.endTime}`
    const [startHour, startMinute] = values.startTime.split(':').map(Number)
    const [endHour, endMinute] = values.endTime.split(':').map(Number)

    const updatedSelectedDate = new Date(selectedDate)
    updatedSelectedDate.setHours(startHour, startMinute, 0, 0)

    const booking: Partial<Booking> = {
      id: calendarEvent.event.id,
      remindenEmailJobId: calendarEvent.event.remindenEmailJobId,
      contactInfo: {
        name: values.name,
        email: values.email,
        phone: values.phone,
        otherInfo: values.otherInfo,
      },
      selectedDate: selectedDate.toString(),
      selectedTimeSlot,
      service: selectedService,
      extraServices: values.extraServices,
    }

    if (!booking.selectedDate || !booking.selectedTimeSlot) {
      toast.error('Nincs kiválasztott időpont')
      setIsLoading(false)
      return
    }

    const bookingData = await updateBooking(booking)

    if (bookingData.message === 'Overlap with existing booking') {
      toast.error(
        'A kiválasztott időpont már nem elérhető. Kérlek válassz másik időpontot.'
      )
      return
    }

    if (bookingData.error) {
      toast.error(
        'Hoppá! Valami hiba történt a foglalás során. Kérlek próbáld meg később.'
      )
      return
    }

    const originalBooking = mapEventToBooking(calendarEvent.event)

    if (
      !isSameDay(booking.selectedDate!, originalBooking.selectedDate) ||
      booking.selectedTimeSlot !== originalBooking.selectedTimeSlot ||
      booking.service?.name !== originalBooking.service.name
    ) {
      const modificationResult = await sendModifierEmail(booking)

      if (!modificationResult) {
        deleteBookingData(bookingData.id)
        return
      }

      // if (!scheduleResult) {
      //   toast.error('Az emlekeztető email beütemezés sikertelen volt')
      // }
    }

    setCalendarEvents((prevCalendarEvents: CalendarEvent[]) => {
      const updatedCalendarEvents = prevCalendarEvents.map((event) => {
        if (event.id === calendarEvent.event.id && event.start && event.end) {
          const updatedStartDate = set(event.start, {
            year: selectedDate.getFullYear(),
            month: selectedDate.getMonth(),
            date: selectedDate.getDate(),
            hours: startHour,
            minutes: startMinute,
          })

          const updatedEndDate = set(event.end, {
            year: selectedDate.getFullYear(),
            month: selectedDate.getMonth(),
            date: selectedDate.getDate(),
            hours: endHour,
            minutes: endMinute,
          })

          return {
            ...event,
            id: bookingData.id,
            start: updatedStartDate,
            end: updatedEndDate,
            service: selectedService,
            extraServices: values.extraServices,
            title: selectedService.name,
            contactInfo: {
              name: values.name,
              email: values.email,
              phone: values.phone,
              otherInfo: values.otherInfo,
            },
          }
        }

        return event
      })

      return updatedCalendarEvents
    })

    toast.success('Sikeres módosítás')
    setIsLoading(false)
    setIsDialogOpen(false)
  }

  const onCancel = () => {
    setIsDialogOpen(false)
  }

  return (
    <div className="dark text-white">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormItem>
            <FormLabel>Dátum</FormLabel>

            <FormControl>
              <DayPicker
                className="dayPicker text-sm text-white sm:text-base md:text-lg"
                mode="single"
                selected={new Date(selectedDate)}
                defaultMonth={new Date(selectedDate)}
                weekStartsOn={1}
                locale={hu}
                disabled={(date) =>
                  isBefore(date, new Date(Date.now())) ||
                  isSunday(date) ||
                  isSaturday(date)
                }
                onSelect={handleSelect}
              />
            </FormControl>

            <FormMessage />
          </FormItem>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Időpont kezdete</FormLabel>

                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      onChange={(event) =>
                        onStartTimeChange(event, field.onChange)
                      }
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Időpont vége</FormLabel>

                  <FormControl>
                    <Input type="time" {...field} disabled readOnly />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator className="my-4" />

          <FormField
            control={form.control}
            name="service"
            render={({ field }) => (
              <>
                <FormItem>
                  {/* <FormLabel>name</FormLabel> */}

                  <Select
                    onValueChange={onServiceSelectChange}
                    defaultValue={field.value.name}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a verified email to display" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SERVICES.map((service) => (
                        <SelectItem key={service.name} value={service.name}>
                          <div className="flex items-center gap-2">
                            {service.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
                <FormItem>
                  <FormLabel>Szolgáltalás időtartama (perc)</FormLabel>
                  <Input disabled value={field.value.duration} />
                </FormItem>
              </>
            )}
          />

          <FormField
            control={form.control}
            name="extraServices"
            render={({ field }) => (
              <>
                {EXTRA_SERVICES.map((service) => (
                  <FormItem key={service.name}>
                    <FormControl>
                      <div className="flex items-center justify-start gap-2">
                        <Checkbox
                          id={service.name}
                          checked={field.value
                            .map((s) => s.name)
                            .includes(service.name)}
                          onCheckedChange={(checked) => {
                            onExtraServiceChange(
                              checked as boolean,
                              service.name
                            )
                          }}
                        />
                        <FormLabel htmlFor={service.name}>
                          {service.name}
                        </FormLabel>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                ))}
              </>
            )}
          />

          <Separator className="my-4" />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Név</FormLabel>

                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>

                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefonszám</FormLabel>

                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="otherInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Egyéb infó</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={onCancel}>
              Mégse
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Módosítás
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default BigCalendarEventForm
