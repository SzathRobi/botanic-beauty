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
import { DayPicker } from "react-day-picker";
import { Booking } from "@prisma/client";
import { mapEventToBooking } from "@/app/admin/mappers/mapEventToBooking.mapper";
import { hu } from "date-fns/locale";
import {
  format,
  isBefore,
  isSameDay,
  isSunday,
  isSaturday,
  set,
  parse,
  addMinutes,
} from "date-fns";
import "./BigCalendarEventForm.override.css";
import { getSecondsToDate } from "@/app/idopontfoglalas/utils/getSecondsToDate";
import { Separator } from "@/components/ui/Separator";

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
  const booking = mapEventToBooking(calendarEvent.event);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(booking.selectedDate)
  );

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      hairdresser: calendarEvent.event.hairdresser,
      startTime: booking.selectedTimeSlot.split(" - ")[0],
      endTime: booking.selectedTimeSlot.split(" - ")[1],
      service: calendarEvent.event.service,
      extraService: calendarEvent.event.extraService,
      name: calendarEvent.event.contactInfo.name,
      email: calendarEvent.event.contactInfo.email,
      phone: calendarEvent.event.contactInfo.phone,
      otherInfo: calendarEvent.event.contactInfo?.otherInfo,
    },
  });

  const onStartTimeChange = (event: any, fieldOnchange: any) => {
    fieldOnchange(event);

    const startTime = form.getValues("startTime");
    const service = form.getValues("service");

    const startDateTime = parse(startTime, "HH:mm", new Date());

    let endDateTime = addMinutes(startDateTime, service.duration);

    const extraService = form.getValues("extraService");

    if (extraService) {
      endDateTime = addMinutes(endDateTime, extraService.duration);
    }

    form.setValue("endTime", format(endDateTime, "HH:mm"));
  };

  const handleSelect = (day: Date | undefined) => {
    if (day) {
      setSelectedDate(day);
    }
  };

  const updateBooking = async (booking: Partial<Booking>) => {
    const response = await fetch(`/api/booking/${calendarEvent.event.id}`, {
      method: "PATCH",
      body: JSON.stringify(booking),
    });

    if (!response.ok) {
      toast.error("Hiba történt, a módosítás sikertelen");
      return;
    }

    return await response.json();
  };

  const sendModifierEmail = async (booking: Partial<Booking>) => {
    const emailResponse = await fetch("/api/email/modifier", {
      method: "POST",
      body: JSON.stringify({
        booking: {
          ...booking,
          selectedDate: format(booking.selectedDate!, "yyyy-MM-dd"),
        },
      }),
    });

    if (!emailResponse.ok) {
      toast.error("A módosító email nem ment ki");

      return;
    }

    return await emailResponse.json();
  };

  const scheduleReminderEmail = async (booking: Partial<Booking>) => {
    const emailDelayInMiliseconds = getSecondsToDate(booking as Booking) * 1000;

    const emailScheduleResponse = await fetch("/api/email/schedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        booking: {
          ...booking,
          selectedDate: format(booking.selectedDate!, "yyyy-MM-dd"),
        },
        emailDelayInMiliseconds,
      }),
    });

    if (!emailScheduleResponse.ok) {
      toast.error("Az emlékeztető email nem ment ki");
    }

    return await emailScheduleResponse.json();
  };

  const deleteBookingData = async (id: string) => {
    const response = await fetch(`/api/booking/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      toast.error("Hiba történt, a módosítás sikertelen");
      return;
    }

    return await response.json();
  };

  const onSubmit = async (values: z.infer<typeof eventFormSchema>) => {
    setIsLoading(true);

    const selectedTimeSlot = `${values.startTime} - ${values.endTime}`;
    const [startHour, startMinute] = values.startTime.split(":").map(Number);
    const [endHour, endMinute] = values.endTime.split(":").map(Number);

    const updatedSelectedDate = new Date(selectedDate);
    updatedSelectedDate.setHours(startHour, startMinute, 0, 0);

    const booking: Partial<Booking> = {
      contactInfo: {
        name: values.name,
        email: values.email,
        phone: values.phone,
        otherInfo: values.otherInfo,
      },
      selectedDate: selectedDate.toString(),
      selectedTimeSlot,
    };

    if (!booking.selectedDate || !booking.selectedTimeSlot) {
      toast.error("Nincs kiválasztott időpont");
      setIsLoading(false);
      return;
    }

    const bookingData = await updateBooking(booking);

    if (bookingData.message === "Overlap with existing booking") {
      toast.error(
        "A kiválasztott időpont már nem elérhető. Kérlek válassz másik időpontot."
      );
      return;
    }

    if (bookingData.error) {
      toast.error(
        "Hoppá! Valami hiba történt a foglalás során. Kérlek próbáld meg később."
      );
      return;
    }

    const originalBooking = mapEventToBooking(calendarEvent.event);

    if (
      !isSameDay(booking.selectedDate!, originalBooking.selectedDate) ||
      booking.selectedTimeSlot !== originalBooking.selectedTimeSlot
    ) {
      const [modificationResult, scheduleResult] = await Promise.all([
        sendModifierEmail(booking),
        scheduleReminderEmail(booking),
      ]);

      if (!modificationResult) {
        deleteBookingData(bookingData.id);
        return;
      }

      if (!scheduleResult) {
        toast.error("Az emlekeztető email beütemezés sikertelen volt");
      }
    }

    setCalendarEvents((prevCalendarEvents: CalendarEvent[]) => {
      const updatedCalendarEvents = prevCalendarEvents.map((event) => {
        if (event.id === calendarEvent.event.id && event.start && event.end) {
          const updatedStartDate = set(event.start, {
            year: selectedDate.getFullYear(),
            month: selectedDate.getMonth(),
            date: selectedDate.getDate(),
            hours: startHour,
            minutes: startMinute,
          });

          const updatedEndDate = set(event.end, {
            year: selectedDate.getFullYear(),
            month: selectedDate.getMonth(),
            date: selectedDate.getDate(),
            hours: endHour,
            minutes: endMinute,
          });

          return {
            ...event,
            start: updatedStartDate,
            end: updatedEndDate,
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
          <FormItem>
            <FormLabel className="text-black">Dátum</FormLabel>

            <FormControl>
              <DayPicker
                className="text-gray-900 text-sm sm:text-base md:text-lg dayPicker"
                mode="single"
                selected={new Date(selectedDate)}
                // TODO / high: change to selectedDate
                defaultMonth={new Date("2024-08-01")}
                weekStartsOn={1}
                locale={hu}
                disabled={(date) =>
                  isBefore(date, new Date(Date.now())) ||
                  isSunday(date) ||
                  isSaturday(date)
                }
                onSelect={handleSelect}
              />
            </FormControl>

            <FormMessage />
          </FormItem>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">Időpont kezdete</FormLabel>

                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      onChange={(event) =>
                        onStartTimeChange(event, field.onChange)
                      }
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">Időpont vége</FormLabel>

                  <FormControl>
                    <Input type="time" {...field} disabled readOnly />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator className="my-4" />

          <FormField
            control={form.control}
            name="service.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Szolgáltalás neve</FormLabel>

                <FormControl>
                  <Input {...field} disabled readOnly />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="service.duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">
                  Szolgáltalás időtartama (perc)
                </FormLabel>

                <FormControl>
                  <Input {...field} disabled readOnly />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Separator className="my-4" />

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
            <Button variant="secondary" type="button" onClick={onCancel}>
              Mégse
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Módosítás
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BigCalendarEventForm;
