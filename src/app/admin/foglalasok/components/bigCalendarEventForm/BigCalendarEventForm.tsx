'use client'

// @ts-expect-error Next.js loads this stylesheet.
import './BigCalendarEventForm.override.css'

import { zodResolver } from '@hookform/resolvers/zod'
import { OpeningHour, SpecialOpeningHour, TOffDay } from '@prisma/client'
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
  getDaySchedule,
} from '@/lib/guest-booking'

import { eventFormSchema } from '../../schemas/eventFormSchema'
import { getNotificationWarning, updateBooking } from '../../utils/bookingApi'
import { calculateBookingEndTime } from '../../utils/bookingTime'

type BigCalendarEventFormProps = {
  calendarEvent: EventProps<CalendarEvent>
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
  openingHours,
  specialOpeningHours,
}: BigCalendarEventFormProps) => {
  const booking = mapEventToBooking(calendarEvent.event)
  const [isLoading, setIsLoading] = useState(false)
  const submitting = useRef(false)
  const [selectedDate, setSelectedDate] = useState(() =>
    dateFromCalendarKey(booking.selectedDate)
  )
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      hairdresser: booking.hairdresser,
      startTime: booking.selectedTimeSlot.split(' - ')[0],
      endTime: booking.selectedTimeSlot.split(' - ')[1],
      service: booking.service,
      extraServices: booking.extraServices,
      ...booking.contactInfo,
    },
  })

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
      const result = await updateBooking(booking.id, {
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
      })
      const saved = mapBookingToEvent(result.data)
      setCalendarEvents((previous) =>
        previous.map((event) => (event.id === booking.id ? saved : event))
      )
      toast.success('Sikeres módosítás')
      const warning = getNotificationWarning(result.notifications)
      if (warning) toast.error(warning)
      setIsDialogOpen(false)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'A módosítás sikertelen.'
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
                  !getDaySchedule(
                    getCalendarDateKey(date),
                    openingHours,
                    specialOpeningHours
                  )?.isOpen ||
                  offDays.some(
                    (day) =>
                      day.person === booking.hairdresser &&
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
            <Button
              variant="secondary"
              type="button"
              onClick={onCancel}
              disabled={isLoading}
            >
              Mégse
            </Button>
            <Button type="submit" isLoading={isLoading} disabled={isLoading}>
              Módosítás
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default BigCalendarEventForm
