"use client";

import { useForm } from "react-hook-form";
import { eventFormSchema } from "../../schemas/eventFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarEvent } from "@/app/admin/types/calendarEvent.type";
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
import { EventProps } from "react-big-calendar";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { Booking } from "@prisma/client";

type BigCalendarEventFormProps = {
  calendarEvent: EventProps<CalendarEvent>;
  setCalendarEvents: Dispatch<SetStateAction<CalendarEvent[]>>;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
};

const BigCalendarEventForm = ({
  calendarEvent,
  setCalendarEvents,
  setIsDialogOpen,
}: BigCalendarEventFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      hairdresser: calendarEvent.event.hairdresser,
      service: calendarEvent.event.service,
      name: calendarEvent.event.contactInfo.name,
      email: calendarEvent.event.contactInfo.email,
      phone: calendarEvent.event.contactInfo.phone,
      otherInfo: calendarEvent.event.contactInfo?.otherInfo,
    },
  });

  const onSubmit = async (values: z.infer<typeof eventFormSchema>) => {
    setIsLoading(true);

    const booking: Partial<Booking> = {
      contactInfo: {
        name: values.name,
        email: values.email,
        phone: values.phone,
        otherInfo: values.otherInfo,
      },
    };

    const response = await fetch(`/api/booking/${calendarEvent.event.id}`, {
      method: "PATCH",
      body: JSON.stringify(booking),
    });

    if (!response.ok) {
      toast.error("Hiba történt, a módosítás sikertelen");
      return;
    }

    setCalendarEvents((prevCalendarEvents: CalendarEvent[]) => {
      const updatedCalendarEvents = prevCalendarEvents.map((event) => {
        if (event.id === calendarEvent.event.id) {
          return {
            ...event,
            contactInfo: {
              name: values.name,
              email: values.email,
              phone: values.phone,
              otherInfo: values.otherInfo,
            },
          };
        }

        return event;
      });

      return updatedCalendarEvents;
    });

    toast.success("Sikeres módosítás");
    setIsLoading(false);
    setIsDialogOpen(false);
  };

  const onCancel = () => {
    setIsDialogOpen(false);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Név</FormLabel>

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
                <FormLabel className="text-black">Email</FormLabel>

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
                <FormLabel className="text-black">Telefonszám</FormLabel>

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
                <FormLabel className="text-black">Egyéb infó</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BigCalendarEventForm;
