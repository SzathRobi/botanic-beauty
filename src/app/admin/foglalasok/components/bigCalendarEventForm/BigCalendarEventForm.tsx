'use client'

// @ts-expect-error Next.js loads this stylesheet.
import './BigCalendarEventForm.override.css'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Booking,
  Hairdresser,
  OpeningHour,
  SpecialOpeningHour,
  TOffDay,
} from '@prisma/client'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'
import { Dispatch, SetStateAction, useRef, useState } from 'react'
import { EventProps } from 'react-big-calendar'
import { DayPicker } from 'react-day-picker'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

import { mapBookingToEvent } from '@/app/admin/mappers/mapBookingToEvent.mapper'
import { mapEventToBooking } from '@/app/admin/mappers/mapEventToBooking.mapper'
import { CalendarEvent } from '@/app/admin/types/calendarEvent.type'
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
import {
  dateFromCalendarKey,
  getBookingDateKey,
  getCalendarDateKey,
} from '@/lib/guest-booking'

import { eventFormSchema } from '../../schemas/eventFormSchema'
import {
  createBooking,
  getNotificationWarning,
  updateBooking,
} from '../../utils/bookingApi'
import { calculateBookingEndTime } from '../../utils/bookingTime'

type BigCalendarEventFormProps = {
  calendarEvent?: EventProps<CalendarEvent>
  initialStart?: Date
  initialHairdresser?: Hairdresser
  onCreated?: (booking: Booking) => void
  setCalendarEvents: Dispatch<SetStateAction<CalendarEvent[]>>
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>
  offDays: TOffDay[]
  openingHours: OpeningHour[]
  specialOpeningHours: SpecialOpeningHour[]
}

const BigCalendarEventForm = ({
  calendarEvent,
  setCalendarEvents,
  setIsDialogOpen,
  offDays,
  initialStart,
  initialHairdresser = 'Timi',
  onCreated,
}: BigCalendarEventFormProps) => {
  const booking = calendarEvent ? mapEventToBooking(calendarEvent.event) : null
  const initialService = booking?.service ?? SERVICES[0]
  const initialTime =
    booking?.selectedTimeSlot.split(' - ')[0] ??
    (initialStart ? format(initialStart, 'HH:mm') : '10:00')
  const [isLoading, setIsLoading] = useState(false)
  const submitting = useRef(false)
  const [selectedDate, setSelectedDate] = useState(() =>
    booking
      ? dateFromCalendarKey(booking.selectedDate)
      : (initialStart ?? dateFromCalendarKey(getBookingDateKey(new Date())!))
  )
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      hairdresser: booking?.hairdresser ?? initialHairdresser,
      startTime: initialTime,
      endTime:
        booking?.selectedTimeSlot.split(' - ')[1] ??
        calculateBookingEndTime(initialTime, initialService, []),
      service: initialService,
      extraServices: booking?.extraServices ?? [],
      name: booking?.contactInfo.name ?? '',
      email: booking?.contactInfo.email ?? '',
      phone: booking?.contactInfo.phone ?? '',
      otherInfo: booking?.contactInfo.otherInfo ?? '',
    },
  })

  const selectedHairdresser = form.watch('hairdresser')

  const recalculateEndTime = () => {
    const values = form.getValues()
    form.setValue(
      'endTime',
      calculateBookingEndTime(
        values.startTime,
        values.service,
        values.extraServices
      )
    )
  }
  const onStartTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldOnChange: (value: string) => void
  ) => {
    fieldOnChange(event.target.value)
    recalculateEndTime()
  }
  const onServiceSelectChange = (name: string) => {
    const service = SERVICES.find((item) => item.name === name)
    if (!service) return
    form.setValue('service', service)
    recalculateEndTime()
  }
  const onExtraServiceChange = (checked: boolean, name: string) => {
    const extra = EXTRA_SERVICES.find((item) => item.name === name)
    if (!extra) return
    const current = form.getValues('extraServices')
    const filtered = current.filter((item) => item.id !== extra.id)
    form.setValue('extraServices', checked ? [...filtered, extra] : filtered)
    recalculateEndTime()
  }
  const handleSelect = (day: Date | undefined) => {
    if (day) setSelectedDate(day)
  }
  const onCancel = () => {
    if (!submitting.current) setIsDialogOpen(false)
  }

  const onSubmit = async (values: z.infer<typeof eventFormSchema>) => {
    if (submitting.current) return
    submitting.current = true
    setIsLoading(true)
    try {
      const payload = {
        selectedDate: getCalendarDateKey(selectedDate),
        selectedTimeSlot: values.startTime + ' - ' + values.endTime,
        hairdresser: values.hairdresser,
        service: values.service,
        extraServices: values.extraServices,
        contactInfo: {
          name: values.name,
          email: values.email,
          phone: values.phone,
          otherInfo: values.otherInfo || null,
        },
      }
      const result = booking
        ? await updateBooking(booking.id, payload)
        : await createBooking(payload)
      const saved = mapBookingToEvent(result.data)
      setCalendarEvents((previous) =>
        booking
          ? previous.map((event) => (event.id === booking.id ? saved : event))
          : [...previous.filter((event) => event.id !== saved.id), saved]
      )
      if (!booking) onCreated?.(result.data)
      toast.success(booking ? 'Sikeres módosítás' : 'A foglalást létrehoztuk.')
      const warning = getNotificationWarning(result.notifications)
      if (warning) toast.error(warning)
      setIsDialogOpen(false)
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'A foglalás mentése sikertelen.'
      )
    } finally {
      submitting.current = false
      setIsLoading(false)
    }
  }

  return (
    <div className="dark text-white">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {!booking && (
            <FormField
              control={form.control}
              name="hairdresser"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fodrász</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Válassz fodrászt" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="dark">
                      <SelectItem value="Timi">Timi</SelectItem>
                      <SelectItem value="nem_Timi">nem Timi</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
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
                  getCalendarDateKey(date) < getBookingDateKey(new Date())! ||
                  offDays.some(
                    (day) =>
                      day.person === selectedHairdresser &&
                      getBookingDateKey(day.date) === getCalendarDateKey(date)
                  )
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
                    <Input type="time" {...field} readOnly />
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
                        <SelectValue placeholder="Válassz szolgáltatást" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="dark">
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
            <Button
              variant="secondary"
              type="button"
              onClick={onCancel}
              disabled={isLoading}
            >
              Mégse
            </Button>
            <Button type="submit" isLoading={isLoading} disabled={isLoading}>
              {booking ? 'Módosítás' : 'Foglalás létrehozása'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default BigCalendarEventForm
