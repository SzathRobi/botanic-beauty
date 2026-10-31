'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { SpecialOpeningHour } from '@prisma/client'
import { format, isSameDay } from 'date-fns'
import { hu } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { Dispatch, SetStateAction, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

import { Button } from '@/components/ui/Button'
import { Calendar } from '@/components/ui/calendar'
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover'
import { Switch } from '@/components/ui/Switch'
import { SALON_API_SPECIAL_OPENING_HOURS_ROUTE } from '@/constants/routes.constants'
import { cn } from '@/lib/utils'

type OpeningHoursModifySpecialOpeningHoursFormProps = {
  specialOpeningHours: SpecialOpeningHour[]
  salonId: string
  setIsModifySpecialOpeningHoursFormOpen: Dispatch<SetStateAction<boolean>>
  setSpecialOpeningHours: Dispatch<SetStateAction<SpecialOpeningHour[]>>
}

const schema = z.object({
  specialOpeningHours: z.array(
    z.object({
      date: z.date(),
      openingHour: z.string().min(1, { message: 'A mező kitöltése kötelező' }),
      closingHour: z.string().min(1, { message: 'A mező kitöltése kötelező' }),
      isOpen: z.boolean(),
    })
  ),
})

type FormData = z.infer<typeof schema>

const OpeningHoursModifySpecialOpeningHoursForm = ({
  specialOpeningHours,
  salonId,
  setIsModifySpecialOpeningHoursFormOpen,
  setSpecialOpeningHours,
}: OpeningHoursModifySpecialOpeningHoursFormProps) => {
  const [isFormLoading, setIsFormLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      specialOpeningHours: specialOpeningHours,
    },
  })

  const { fields } = useFieldArray({
    control: form.control,
    name: 'specialOpeningHours',
  })

  const onSubmit = async (values: FormData) => {
    setIsFormLoading(true)

    const response = await fetch(
      `/api/${salonId}${SALON_API_SPECIAL_OPENING_HOURS_ROUTE}`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          specialOpeningHours: values.specialOpeningHours,
        }),
      }
    )

    if (!response.ok) {
      setIsFormLoading(false)
      toast.error('A nyitvatartási idő módosiítása sikertelen')
      return
    }

    const isBulkUpdate = values.specialOpeningHours.length > 1

    setIsFormLoading(false)
    setSpecialOpeningHours((prev) =>
      isBulkUpdate
        ? values.specialOpeningHours
        : prev.map((prevOpeningHour) =>
            isSameDay(prevOpeningHour.date, values.specialOpeningHours[0].date)
              ? values.specialOpeningHours[0]
              : prevOpeningHour
          )
    )
    toast.success('A nyitvatartási idő módosiítása sikeres')
    setIsModifySpecialOpeningHoursFormOpen(false)
  }

  const handleTimeChange = (value: string) => {
    const formattedTime = value.replace(/^(\d{1,2})(\d{1,2})$/, '$1:$2')
    const parsedTime = new Date(`1970-01-01T${formattedTime}:00Z`)
    return !isNaN(parsedTime.getTime()) ? formattedTime : ''
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4 border p-4">
            <div
              className="flex flex-col gap-4 md:flex-row md:items-center"
              key={field.id}
            >
              <FormField
                control={form.control}
                name={`specialOpeningHours.${index}.date`}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Dátum</FormLabel>
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-50 justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, 'yyyy.MM.dd')
                            ) : (
                              <span>Válassz dátumot</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="dark w-auto p-0 text-foreground">
                        <Calendar
                          mode="single"
                          locale={hu}
                          selected={field.value}
                          onSelect={field.onChange}
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`specialOpeningHours.${index}.openingHour`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nyitás</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        value={field.value}
                        onChange={(e) => {
                          const newValue = handleTimeChange(e.target.value)
                          field.onChange(newValue)
                        }}
                        placeholder="08:00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`specialOpeningHours.${index}.closingHour`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zárás</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        value={field.value}
                        onChange={(e) => {
                          const newValue = handleTimeChange(e.target.value)
                          field.onChange(newValue)
                        }}
                        placeholder="16:00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`specialOpeningHours.${index}.isOpen`}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-4">
                    <FormLabel>Nyitva</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}

        <Button
          isLoading={isFormLoading}
          type="submit"
          disabled={form.formState.isSubmitting || isFormLoading}
        >
          Mentés
        </Button>
      </form>
    </Form>
  )
}

export default OpeningHoursModifySpecialOpeningHoursForm
