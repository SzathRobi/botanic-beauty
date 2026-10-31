'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { SpecialOpeningHour } from '@prisma/client'
import {
  addDays,
  addHours,
  format,
  isValid,
  parse,
  startOfHour,
} from 'date-fns'
import { hu } from 'date-fns/locale'
import { CalendarIcon, Trash2 } from 'lucide-react'
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

import { specialOpeningHoursFormSchema } from '../../schemas/specialOpeningHours.schema'

type OpeningHoursSpecialOpeningHoursFormProps = {
  salonId: string
  setIsSpecialOpeningHoursFormOpen: Dispatch<SetStateAction<boolean>>
  setSpecialOpeningHours: Dispatch<SetStateAction<SpecialOpeningHour[]>>
}

const OpeningHoursSpecialOpeningHoursForm = ({
  salonId,
  setIsSpecialOpeningHoursFormOpen,
  setSpecialOpeningHours,
}: OpeningHoursSpecialOpeningHoursFormProps) => {
  const [isFormLoading, setIsFormLoading] = useState(false)

  const now = new Date()

  const form = useForm<{
    fields: z.infer<typeof specialOpeningHoursFormSchema>
  }>({
    resolver: zodResolver(z.object({ fields: specialOpeningHoursFormSchema })),
    defaultValues: {
      fields: [
        {
          date: now,
          isOpen: false,
          openingHour: format(startOfHour(now), 'HH:mm'),
          closingHour: format(startOfHour(addHours(now, 2)), 'HH:mm'),
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'fields',
  })

  const onSubmit = async (values: {
    fields: z.infer<typeof specialOpeningHoursFormSchema>
  }) => {
    setIsFormLoading(true)

    const response = await fetch(
      `/api/${salonId}${SALON_API_SPECIAL_OPENING_HOURS_ROUTE}`,
      {
        method: 'POST',
        body: JSON.stringify({ specialOpeningHours: values.fields }),
      }
    )

    if (!response.ok) {
      setIsFormLoading(false)
      toast.error('A nyitvatartási idő hozzáadása sikertelen')
      return
    }

    setIsFormLoading(false)
    setSpecialOpeningHours((prev) => [...prev, ...values.fields])
    toast.success('A nyitvatartási idő hozzáadása sikeres')
    setIsSpecialOpeningHoursFormOpen(false)
  }

  const handleTimeChange = (value: string) => {
    const formattedTime = value.replace(/^(\d{1,2})(\d{1,2})$/, '$1:$2')
    const parsedTime = parse(formattedTime, 'HH:mm', new Date())

    return isValid(parsedTime) ? format(parsedTime, 'HH:mm') : ''
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4 border p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <FormField
                control={form.control}
                name={`fields.${index}.date`}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Dátum</FormLabel>
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'md:w-50 w-full justify-start text-left font-normal',
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
                name={`fields.${index}.openingHour`}
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
                name={`fields.${index}.closingHour`}
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
                name={`fields.${index}.isOpen`}
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

            <Button
              type="button"
              variant="destructive"
              disabled={fields.length === 1}
              onClick={() => remove(index)}
              className="mt-2"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Sor törlése
            </Button>
          </div>
        ))}

        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() =>
              append({
                date: addDays(new Date(), fields.length),
                isOpen: false,
                openingHour: '',
                closingHour: '',
              })
            }
          >
            Új nap hozzáadása
          </Button>

          <Button
            isLoading={isFormLoading}
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            Mentés
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default OpeningHoursSpecialOpeningHoursForm
