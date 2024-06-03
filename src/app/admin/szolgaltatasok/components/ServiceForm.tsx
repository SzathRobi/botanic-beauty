"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceFormSchema } from "../schemas/serviceForm.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/Button";
import { DialogClose } from "@/components/ui/Dialog";
import { useState } from "react";

const createService = async (service: z.infer<typeof serviceFormSchema>) => {
  const response = await fetch("/api/services", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(service),
  });

  const data = await response.json();

  return data;
};

const ServiceForm = () => {
  // TODO: Add error handling + loading
  const [isLoading, setIsLoading] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof serviceFormSchema>>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      category: "",
      duration: 0,
      price: 0,
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof serviceFormSchema>) => {
    setIsLoading(true);
    setRequestError(null);

    const validatedFiels = serviceFormSchema.safeParse(values);

    if (!validatedFiels.success) {
      // console.log(validatedFiels.error.issues);
      return;
    }

    try {
      const data = await createService(values);

      if (data.error) {
        setRequestError(data.message);
      }

      console.log(data);
    } catch (error: any) {
      setRequestError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Időtartam (perc)</FormLabel>

              <FormControl>
                <Input
                  {...field}
                  type="number"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ár (Ft)</FormLabel>

              <FormControl>
                <Input
                  {...field}
                  type="number"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategória</FormLabel>

              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              mégse
            </Button>
          </DialogClose>
          <Button type="submit" isLoading={isLoading}>
            Létrehozás
          </Button>
        </div>

        <div>
          {requestError && (
            <p className="text-red-500 text-right">{requestError}</p>
          )}
        </div>
      </form>
    </Form>
  );
};

export default ServiceForm;
