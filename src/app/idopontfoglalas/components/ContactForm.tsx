"use client";

import { Button } from "@/components/Button";
import { Booking } from "@prisma/client";
import { FormEvent, useState } from "react";
import { differenceInSeconds, format, parse, subHours } from "date-fns";
import toast from "react-hot-toast";

type ContactFormProps = {
  booking: Omit<Booking, "id" | "createdAt" | "updatedAt">;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    otherInfo: string;
  };
  modifyContactInfo: (key: string, value: string) => void;
  incrementActiveStep: () => void;
  decrementActiveStep: () => void;
  postBookingData: () => Promise<any>;
  deleteBookingData: (id: string) => Promise<any>;
};

const ContactForm = ({
  booking,
  contactInfo,
  modifyContactInfo,
  decrementActiveStep,
  incrementActiveStep,
  postBookingData,
  deleteBookingData,
}: ContactFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendVerificationEmail = async () => {
    try {
      const response = await fetch("/api/email/verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ booking }),
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

  const getSecondsToDate = (
    booking: Omit<Booking, "id" | "createdAt" | "updatedAt">
  ): number => {
    // Kombináljuk a dátumot és az időt egy ISO formátumú dátum stringgé
    const dateStr =
      booking.selectedDate.split(" ")[1] +
      " " +
      booking.selectedDate.split(" ")[2] +
      " " +
      booking.selectedDate.split(" ")[3];
    const timeStr = booking.selectedTimeSlot.split(" - ")[0];
    const dateTimeStr = dateStr + " " + timeStr;
    const targetDate = parse(dateTimeStr, "MMM dd yyyy HH:mm", new Date());

    // Vonjunk le két órát az így kapott dátumból
    const modifiedTargetDate = subHours(targetDate, 2);

    // Határozzuk meg a jelenlegi időpontot
    const currentDate = new Date();

    // Számítsuk ki a különbséget másodpercekben
    const secondsDifference = differenceInSeconds(
      modifiedTargetDate,
      currentDate
    );

    return secondsDifference;
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    setError(null);

    try {
      const bookingData = await postBookingData();

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

      const verificationResult = await sendVerificationEmail();
      if (!verificationResult) {
        deleteBookingData(bookingData.id);
        return;
      }

      const scheduleResult = await scheduleReminderEmail(booking);
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
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4">
        <div className="mb-12 flex flex-col gap-2">
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-white"
            >
              Név
            </label>
            <input
              type="text"
              id="name"
              className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              value={contactInfo.name}
              onChange={(event) =>
                modifyContactInfo("name", event.target.value)
              }
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-white"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              value={contactInfo.email}
              onChange={(event) =>
                modifyContactInfo("email", event.target.value)
              }
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block mb-2 text-sm font-medium text-white"
            >
              Telefon
            </label>
            <input
              type="tel"
              id="phone"
              className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              value={contactInfo.phone}
              onChange={(event) =>
                modifyContactInfo("phone", event.target.value)
              }
            />
          </div>
          <div>
            <label
              htmlFor="other-info"
              className="block mb-2 text-sm font-medium text-white"
            >
              Megjegyzés
            </label>
            <textarea
              id="other-info"
              className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              cols={30}
              rows={3}
              value={contactInfo.otherInfo}
              onChange={(event) =>
                modifyContactInfo("otherInfo", event.target.value)
              }
            ></textarea>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={decrementActiveStep}
          >
            Previous
          </Button>
          <Button
            disabled={
              contactInfo.name === "" ||
              contactInfo.email === "" ||
              contactInfo.phone === ""
            }
            isLoading={isLoading}
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
