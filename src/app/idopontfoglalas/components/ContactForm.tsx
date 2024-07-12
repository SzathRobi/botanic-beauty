"use client";

import { Button } from "@/components/Button";
import { Booking } from "@prisma/client";
import { Dispatch, SetStateAction, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { contactFormSchema } from "../schemas/contactForm.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/TextArea";
import { getSecondsToDate } from "../utils/getSecondsToDate";

type ContactFormProps = {
  booking: Omit<Booking, "id" | "createdAt" | "updatedAt">;
  setContactInfo: Dispatch<SetStateAction<any>>;
  incrementActiveStep: () => void;
  decrementActiveStep: () => void;
  postBookingData: (contactInfo: any) => Promise<any>;
  deleteBookingData: (id: string) => Promise<any>;
};

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
      name: "",
      email: "",
      phone: "",
      otherInfo: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendVerificationEmail = async (contactInfo: any) => {
    const bookingWithFormattedDate = {
      ...booking,
      contactInfo,
      selectedDate: format(booking.selectedDate, "yyyy-MM-dd"),
    };

    try {
      const response = await fetch("/api/email/verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ booking: bookingWithFormattedDate }),
      });

      const data = await response.json();

      if (!data.success) {
        // throw new Error("Failed to send verification email");
        return null;
      }

      return data;
    } catch (error) {
      console.error("Failed to send verification email:", error);
    }
  };

  const scheduleReminderEmail = async (
    booking: Omit<Booking, "id" | "createdAt" | "updatedAt">
  ) => {
    const emailDelayInMiliseconds = getSecondsToDate(booking) * 1000;

    const emailScheduleResponse = await fetch("/api/email/schedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        booking: {
          ...booking,
          selectedDate: format(booking.selectedDate, "yyyy-MM-dd"),
        },
        emailDelayInMiliseconds,
      }),
    });

    const emailScheduleData = await emailScheduleResponse.json();

    if (!emailScheduleData.success) return null;

    return emailScheduleData;
  };

  const handleSubmit = async (values: z.infer<typeof contactFormSchema>) => {
    setIsLoading(true);
    setError(null);

    const contactInfo = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      otherInfo: values.otherInfo || null,
    };

    setContactInfo(contactInfo);

    try {
      const bookingData = await postBookingData(contactInfo);

      if (bookingData.message === "Overlap with existing booking") {
        toast.error(
          "A kiválasztott időpont már nem elérhető. Kérlek válassz másik időpontot."
        );
        return;
      }

      if (bookingData.error) {
        toast.error(
          "Hoppá! Valami hiba történt a foglalás során. Kérlek probáld meg később"
        );
        return;
      }

      const verificationResult = await sendVerificationEmail(contactInfo);
      if (!verificationResult) {
        deleteBookingData(bookingData.id);
        return;
      }

      const scheduleResult = await scheduleReminderEmail({
        ...booking,
        contactInfo,
      });
      if (!scheduleResult) {
        throw new Error("Failed to schedule reminder email");
      }

      incrementActiveStep();
    } catch (error) {
      setError("Hiba történt a foglalás során");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <div>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-2 mb-4"
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
  );
};

export default ContactForm;
