'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Booking } from '@prisma/client'
import { InfoIcon } from 'lucide-react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as z from 'zod'

import { Button } from '@/components/Button'
import { Alert } from '@/components/ui/Alert'
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
  EXTRA_SERVICE_HAIRCUT,
  EXTRA_SERVICE_MIRACLE_BOOSTER,
} from '@/constants/services.constants'

const formSchema = z.object({
  price: z.number(),
  tips: z.number(),
  dyeMaterialUsage: z.number(),
  bleachMaterialUsage: z.number(),
  miracleBoosterPrice: z.number().optional(),
  extraHaircutPrice: z.number().optional(),
  discountPercentage: z.number().optional(),
})

const BLEACH_PRICE_PER_GRAMM = 100
const DYE_PRICE_PER_GRAMM = 100

type FinanceFormProps = {
  selectedBooking: Booking
  setAllBookings: Dispatch<SetStateAction<Booking[]>>
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>
}

export default function FinanceForm({
  selectedBooking,
  setAllBookings,
  setIsDialogOpen,
}: FinanceFormProps) {
  const [isFormLoading, setIsFormLoading] = useState(false)
  const [finalPrice, setFinalPrice] = useState(0)

  const hasMiracleBooster = selectedBooking.extraServices?.some(
    (extraSerivce) => extraSerivce.name === EXTRA_SERVICE_MIRACLE_BOOSTER.name
  )
  const hasExtraHaircuts = selectedBooking.extraServices?.some(
    (extraSerivce) => extraSerivce.name === EXTRA_SERVICE_HAIRCUT.name
  )

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      tips: 0,
      bleachMaterialUsage: 0,
      dyeMaterialUsage: 0,
      price: selectedBooking.service.price,
      miracleBoosterPrice: hasMiracleBooster
        ? EXTRA_SERVICE_MIRACLE_BOOSTER.price
        : 0,
      extraHaircutPrice: hasExtraHaircuts ? EXTRA_SERVICE_HAIRCUT.price : 0,
      discountPercentage: 0,
    },
    resolver: zodResolver(formSchema),
  })

  const calculateFinalPrice = (values: z.infer<typeof formSchema>) => {
    const basePrice = values.price || 0
    const dyeCost = values.dyeMaterialUsage * DYE_PRICE_PER_GRAMM
    const bleachCost = values.bleachMaterialUsage * BLEACH_PRICE_PER_GRAMM
    const miracleBoosterCost = values.miracleBoosterPrice || 0
    const extraHaircutCost = values.extraHaircutPrice || 0
    const discountPercentage = values.discountPercentage || 0
    const tips = values.tips || 0

    const finalPriceWithoutDiscount =
      basePrice + dyeCost + bleachCost + miracleBoosterCost + extraHaircutCost
    const discountAmount =
      (finalPriceWithoutDiscount * discountPercentage) / 100

    return finalPriceWithoutDiscount - discountAmount + tips
  }

  useEffect(() => {
    const formValues = form.getValues()
    const newFinalPrice = calculateFinalPrice(formValues)
    setFinalPrice(newFinalPrice)
  }, [form.watch()])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsFormLoading(true)

    const response = await fetch(`/api/booking/${selectedBooking.id}/finance`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...values, price: finalPrice }),
    })

    if (!response.ok) {
      toast.error('Hiba történt, a módosítás sikertelen')
      setIsFormLoading(false)
      setIsDialogOpen(false)
      return
    }

    setAllBookings((prev) =>
      prev.map((booking) => {
        if (booking.id === selectedBooking.id) {
          return {
            ...booking,
            isFinanceDone: true,
            bleachMaterialUsage: values.bleachMaterialUsage,
            dyeMaterialUsage: values.dyeMaterialUsage,
            finalPrice: finalPrice,
            miracleBoosterPrice: values?.miracleBoosterPrice ?? 0,
            extraHaircutPrice: values?.extraHaircutPrice ?? 0,
          }
        }
        return booking
      })
    )

    toast.success('A módosítás sikeres')
    setIsFormLoading(false)
    setIsDialogOpen(false)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-8 py-10"
      >
        <Alert variant="info" className="mb-2">
          <InfoIcon size={16} />
          <div>
            <div className="mb-2 flex flex-col justify-start gap-2 text-sm md:flex-row md:items-center">
              <p>{selectedBooking.contactInfo.name}</p>
              <p>{selectedBooking.service.name}</p>
              <p>
                {new Date(selectedBooking.selectedDate).toLocaleDateString(
                  'hu-HU'
                )}{' '}
                - {selectedBooking.selectedTimeSlot}
              </p>
            </div>
            {selectedBooking.extraServices.length > 0 && (
              <div className="text-sm">
                <p>Extra szolgáltások:</p>
                {selectedBooking.extraServices.map((extraService) => (
                  <p key={extraService.id}>{extraService.name}</p>
                ))}
              </div>
            )}
          </div>
        </Alert>

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem className="text-white">
              <FormLabel>Ár (Ft)</FormLabel>
              <FormControl>
                <Input
                  placeholder=""
                  type="number"
                  {...field}
                  onChange={(event) =>
                    field.onChange(event.target.valueAsNumber)
                  }
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tips"
          render={({ field }) => (
            <FormItem className="text-white">
              <FormLabel>Borravaló (Ft)</FormLabel>
              <FormControl>
                <Input
                  placeholder=""
                  type="number"
                  {...field}
                  onChange={(event) =>
                    field.onChange(event.target.valueAsNumber)
                  }
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dyeMaterialUsage"
          render={({ field }) => (
            <FormItem className="text-white">
              <FormLabel>Festék anyaghasználat (g)</FormLabel>
              <FormControl>
                <Input
                  placeholder=""
                  type="number"
                  {...field}
                  onChange={(event) =>
                    field.onChange(event.target.valueAsNumber)
                  }
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bleachMaterialUsage"
          render={({ field }) => (
            <FormItem className="text-white">
              <FormLabel>Szőkítő anyaghasználat (g)</FormLabel>
              <FormControl>
                <Input
                  placeholder=""
                  type="number"
                  {...field}
                  onChange={(event) =>
                    field.onChange(event.target.valueAsNumber)
                  }
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="extraHaircutPrice"
          render={({ field }) => (
            <FormItem className="text-white">
              <FormLabel>Extra hajvágás ár (Ft)</FormLabel>
              <FormControl>
                <Input
                  placeholder=""
                  type="number"
                  {...field}
                  onChange={(event) =>
                    field.onChange(event.target.valueAsNumber)
                  }
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="miracleBoosterPrice"
          render={({ field }) => (
            <FormItem className="text-white">
              <FormLabel>Miracle Booster ár (Ft)</FormLabel>
              <FormControl>
                <Input
                  placeholder=""
                  type="number"
                  {...field}
                  onChange={(event) =>
                    field.onChange(event.target.valueAsNumber)
                  }
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="discountPercentage"
          render={({ field }) => (
            <FormItem className="text-white">
              <FormLabel>Kedvezmény (%)</FormLabel>
              <FormControl>
                <Input
                  placeholder=""
                  type="number"
                  {...field}
                  onChange={(event) =>
                    field.onChange(event.target.valueAsNumber)
                  }
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-white">
          <p>Összesen: {finalPrice}Ft</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            className="flex-1"
            variant="secondary"
            type="button"
            onClick={() => setIsDialogOpen(false)}
          >
            Mégse
          </Button>
          <Button
            type="submit"
            className="flex-1 text-white"
            isLoading={isFormLoading}
          >
            Mentés
          </Button>
        </div>
      </form>
    </Form>
  )
}
