'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { TContactInfo } from '@prisma/client'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

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

type ContactFormProps = {
  contactInfo: TContactInfo
  saveContactInfo: (contactInfo: TContactInfo) => void
  incrementActiveStep: () => void
  decrementActiveStep: () => void
  submitBooking: (contactInfo: TContactInfo) => Promise<void>
}

const ContactForm = ({
  contactInfo,
  saveContactInfo,
  decrementActiveStep,
  incrementActiveStep,
  submitBooking,
}: ContactFormProps) => {
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { ...contactInfo, otherInfo: contactInfo.otherInfo ?? '' },
  })
  const [isLoading, setIsLoading] = useState(false)
  const submitting = useRef(false)

  const handleSubmit = async (values: z.infer<typeof contactFormSchema>) => {
    if (submitting.current) return
    submitting.current = true
    setIsLoading(true)
    try {
      await submitBooking({
        ...values,
        email: values.email.toLowerCase(),
        otherInfo: values.otherInfo || null,
      })
      incrementActiveStep()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Hiba történt a foglalás során'
      )
    } finally {
      submitting.current = false
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
              onClick={() => {
                const values = form.getValues()
                saveContactInfo({
                  ...values,
                  otherInfo: values.otherInfo || null,
                })
                decrementActiveStep()
              }}
              disabled={isLoading}
            >
              Vissza
            </Button>

            <Button isLoading={isLoading} disabled={isLoading}>
              Foglalás
            </Button>
          </div>
        </form>
      </div>
    </Form>
  )
}

export default ContactForm
