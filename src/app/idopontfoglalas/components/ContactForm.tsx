"use client";

import { Button } from "@/components/Button";
import { FormEvent, useState } from "react";

type ContactFormProps = {
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    otherInfo: string;
  };
  modifyContactInfo: (key: string, value: string) => void;
  incrementActiveStep: () => void;
  decrementActiveStep: () => void;
  postBookingData: () => Promise<void>;
};

const ContactForm = ({
  contactInfo,
  modifyContactInfo,
  decrementActiveStep,
  incrementActiveStep,
  postBookingData,
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
        body: JSON.stringify({ contactInfo }),
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    setError(null);

    try {
      await postBookingData().then(async () => {
        await sendVerificationEmail().then((data) => {
          incrementActiveStep();
        });
      });
    } catch (error) {
      setError("Failed to post booking data");
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
