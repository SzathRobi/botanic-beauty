"use client";

import { useForm } from "react-hook-form";
import { eventFormSchema } from "../../schemas/eventFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarEvent } from "@/app/admin/types/calendarEvent.type";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/Button";
import { EventProps } from "react-big-calendar";

type BigCalendarEventFormProps = {
  calendarEvent: EventProps<CalendarEvent>;
};

const BigCalendarEventForm = ({ calendarEvent }: BigCalendarEventFormProps) => {
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      hairdresser: calendarEvent.event.hairdresser,
      services: calendarEvent.event.services,
      name: calendarEvent.event.contactInfo.name,
      email: calendarEvent.event.contactInfo.email,
      phone: calendarEvent.event.contactInfo.phone,
      otherInfo: calendarEvent.event.contactInfo?.otherInfo,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof eventFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <div>
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
                  <Input {...field} value={field.value || ""} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default BigCalendarEventForm;
