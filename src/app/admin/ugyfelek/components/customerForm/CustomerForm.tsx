'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Customer } from '@prisma/client'
import { Dispatch, SetStateAction, useState } from 'react'
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

import { customerFormSchema } from '../../schemas/customerForm.schema'

type CustomerFormProps = {
  selectedCustomer: Customer | null
  setIsCustomerFormOpen: Dispatch<SetStateAction<boolean>>
  setCustomers: Dispatch<SetStateAction<Customer[]>>
}

const CustomerForm = ({
  selectedCustomer,
  setCustomers,
  setIsCustomerFormOpen,
}: CustomerFormProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof customerFormSchema>>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      email: selectedCustomer?.email ?? '',
      name: selectedCustomer?.name ?? '',
      phone: selectedCustomer?.phone ?? '',
      otherInfo: selectedCustomer?.otherInfo ?? undefined,
    },
  })

  const onSubmit = async (values: z.infer<typeof customerFormSchema>) => {
    setIsLoading(true)

    if (!selectedCustomer) {
      const newCustomer: Partial<Customer> = {
        name: values.name,
        email: values.email,
        hairdressers: [],
        phone: values.phone,
        otherInfo: values?.otherInfo ?? null,
      }

      const response = await fetch(`/api/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomer),
      })

      if (response.status === 401) {
        toast.error('You have no permission to add employees')
        setIsLoading(false)
        return
      }

      if (!response.ok) {
        toast.error('Failed to add customer')
        setIsLoading(false)
        return
      }

      setCustomers((prevCustomers) => [
        ...prevCustomers,
        newCustomer as Customer,
      ])
      setIsLoading(false)
      setIsCustomerFormOpen(false)

      toast.success('Customer added successfully')

      return
    }

    const updatedCustomer: Customer = {
      email: values.email,
      name: values.name,
      phone: values.phone,
      hairdressers: selectedCustomer.hairdressers,
      otherInfo: values.otherInfo,
    } as unknown as Customer

    const response = await fetch(`/api/customers/${selectedCustomer.email}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedCustomer),
    })

    if (response.status === 401) {
      toast.error('You have no permission to modify customer')
      setIsLoading(false)
      return
    }

    if (!response.ok) {
      setIsLoading(false)
      toast.error('Failed to modify customer')
      return
    }

    // TODO: emailt így jelenleg nem lehet updatelni, kell a customereknek egy id
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer: Customer) =>
        customer.email === selectedCustomer.email ? updatedCustomer : customer
      )
    )
    setIsLoading(false)
    setIsCustomerFormOpen(false)
    toast.success('Customer added successfully')

    return
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name*</FormLabel>

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
              <FormLabel>Phone</FormLabel>

              <FormControl>
                <Input type="tel" {...field} />
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
              <FormLabel>Other info</FormLabel>

              <FormControl>
                <Textarea {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" isLoading={isLoading} disabled={isLoading}>
          Submit
        </Button>
      </form>
    </Form>
  )
}

export default CustomerForm
