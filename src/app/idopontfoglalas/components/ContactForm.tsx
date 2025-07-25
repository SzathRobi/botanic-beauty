'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Booking } from '@prisma/client'
import { format } from 'date-fns'
import { Dispatch, SetStateAction, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

import { generateGoogleCalendarLink } from '@/app/api/email/utils/generateGoogleCalendarLink.util'
import { Button } from '@/components/Button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/TextArea'

import { contactFormSchema } from '../schemas/contactForm.schema'
import { getSecondsToDate } from '../utils/getSecondsToDate'

const FOUR_HOUR_IN_SECONDS = 14400

type ContactFormProps = {
  booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>
  setContactInfo: Dispatch<SetStateAction<any>>
  incrementActiveStep: () => void
  decrementActiveStep: () => void
  postBookingData: (contactInfo: any) => Promise<any>
  deleteBookingData: (id: string) => Promise<any>
}

const ContactForm = ({
  booking,
  setContactInfo,
  decrementActiveStep,
  incrementActiveStep,
  postBookingData,
  deleteBookingData,
}: ContactFormProps) => {
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      otherInfo: '',
    },
  })

  const [isLoading, setIsLoading] = useState(false)

  const sendVerificationEmail = async (contactInfo: any) => {
    const bookingWithFormattedDate = {
      ...booking,
      contactInfo,
      selectedDate: format(booking.selectedDate, 'yyyy-MM-dd'),
    }

    try {
      const googleCalendarLink = generateGoogleCalendarLink(booking as Booking)

      const response = await fetch('/api/email/verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking: bookingWithFormattedDate,
          googleCalendarLink,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        return null
      }

      return data
    } catch (error) {
      toast.error('A visszaigazoló email elküldése sikertelen volt.')
      return null
    }
  }

  const scheduleReminderEmail = async (
    booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const emailDelayInSeconds = getSecondsToDate(booking)

    if (emailDelayInSeconds < FOUR_HOUR_IN_SECONDS) return null

    try {
      const response = await fetch('/api/email/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking: {
            ...booking,
            selectedDate: format(booking.selectedDate, 'yyyy-MM-dd'),
          },
          emailDelayInSeconds,
        }),
      })

      const data = await response.json()

      if (!data.success) return null

      return data
    } catch (error) {
      toast.error('Az emlékeztető email beütemezése sikertelen volt.')
      return null
    }
  }

  const handleSubmit = async (values: z.infer<typeof contactFormSchema>) => {
    setIsLoading(true)

    const contactInfo = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      otherInfo: values.otherInfo || null,
    }

    setContactInfo(contactInfo)

    try {
      let bookingWithId: Booking | null = null

      const [bookingData, verificationResult] = await Promise.all([
        sendVerificationEmail(contactInfo),
        postBookingData(contactInfo).then((data) => {
          bookingWithId = data.data
          return data
        }),
      ])

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

      if (!verificationResult) {
        deleteBookingData(bookingData.id)
        return
      }

      if (bookingWithId) {
        await scheduleReminderEmail(bookingWithId)
      }

      incrementActiveStep()
    } catch (error) {
      toast.error('Hiba történt a foglalás során')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <div>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mb-4 flex flex-col gap-2"
        >
          <div className="mb-12 flex flex-col gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Név*</FormLabel>

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
                  <FormLabel>Email*</FormLabel>

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
                  <FormLabel>Telefon*</FormLabel>

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
                  <FormLabel>Megjegyzés</FormLabel>

                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={decrementActiveStep}
            >
              Vissza
            </Button>

            <Button isLoading={isLoading}>Foglalás</Button>
          </div>
        </form>
      </div>
    </Form>
  )
}

export default ContactForm
