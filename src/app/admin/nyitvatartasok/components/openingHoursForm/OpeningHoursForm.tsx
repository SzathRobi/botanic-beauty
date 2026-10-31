'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { OpeningHour } from '@prisma/client'
import { Dispatch, SetStateAction, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

import { Button } from '@/components/ui/Button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { Separator } from '@/components/ui/Separator'
import { Switch } from '@/components/ui/Switch'
import { SALON_API_OPENING_HOURS_ROUTE } from '@/constants/routes.constants'

import { daysOfWeek } from '../../constants/openingHours.constants'
import { mapOpeningHourFormValuesToOpeningHour } from '../../mappers/mapOpeningHourFormValuesToOpeningHour.mapper'
import { formSchema } from '../../schemas/openingHours.schema'
import { getI18nDay } from '../../utils/getI18nDay.util'

type OpeningHoursFormProps = {
  openingHours: OpeningHour[]
  salonId: string
  setIsOpeningHoursFormOpen: Dispatch<SetStateAction<boolean>>
  setOpeningHours: Dispatch<SetStateAction<OpeningHour[]>>
}

const OpeningHoursForm = ({
  openingHours,
  salonId,
  setOpeningHours,
  setIsOpeningHoursFormOpen,
}: OpeningHoursFormProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monday: {
        startHour: openingHours[0].openingHour,
        endHour: openingHours[0].closingHour,
        isOpen: openingHours[0].isOpen,
      },
      tuesday: {
        startHour: openingHours[1].openingHour,
        endHour: openingHours[1].closingHour,
        isOpen: openingHours[1].isOpen,
      },
      wednesday: {
        startHour: openingHours[2].openingHour,
        endHour: openingHours[2].closingHour,
        isOpen: openingHours[2].isOpen,
      },
      thursday: {
        startHour: openingHours[3].openingHour,
        endHour: openingHours[3].closingHour,
        isOpen: openingHours[3].isOpen,
      },
      friday: {
        startHour: openingHours[4].openingHour,
        endHour: openingHours[4].closingHour,
        isOpen: openingHours[4].isOpen,
      },
      saturday: {
        startHour: openingHours[5].openingHour,
        endHour: openingHours[5].closingHour,
        isOpen: openingHours[5].isOpen,
      },
      sunday: {
        startHour: openingHours[6].openingHour,
        endHour: openingHours[6].closingHour,
        isOpen: openingHours[6].isOpen,
      },
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)

    const updatedOpeningHours = mapOpeningHourFormValuesToOpeningHour(values)

    try {
      const response = await fetch(
        `/api/${salonId}${SALON_API_OPENING_HOURS_ROUTE}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ openingHours: updatedOpeningHours }),
        }
      )

      if (!response.ok) {
        toast.error('Something went wrong')
        return
      }

      setOpeningHours(updatedOpeningHours)
      setIsOpeningHoursFormOpen(false)

      toast.success('A nyitvatartási idő sikeresen módosult')
    } catch (_) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {daysOfWeek.map((day) => (
          <div key={day}>
            <p className="mb-2 text-base font-medium">{getI18nDay(day)}</p>
            <div className="mb-4 grid grid-cols-2 place-items-start gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name={`${day}.startHour`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nyitási idő</FormLabel>

                    <FormControl>
                      <Input {...field} type="time" />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`${day}.endHour`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zárási idő</FormLabel>

                    <FormControl>
                      <Input {...field} type="time" />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`${day}.isOpen`}
                render={({ field }) => (
                  <FormItem className="mt-2 grid grid-cols-1 place-items-start gap-2">
                    <FormLabel>Nyitva</FormLabel>

                    <FormControl>
                      <Switch
                        {...field}
                        checked={field.value}
                        value={field.value.toString()}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />
          </div>
        ))}

        <Button
          type="submit"
          className={`w-full md:w-auto`}
          isLoading={isLoading}
          disabled={isLoading}
        >
          Mentés
        </Button>
      </form>
    </Form>
  )
}

export default OpeningHoursForm
