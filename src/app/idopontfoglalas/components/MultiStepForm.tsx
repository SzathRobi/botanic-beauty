"use client";

import { Booking, Schedule, TService } from "@prisma/client";
import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

import BackgroundBlur from "@/components/BackgroundBlur";
import { mapMultistepFormDataToBooking } from "../mappers/mapMultistepFormdataToBooking.mapper";
import ServicesForm from "./ServicesForm";
import Stepper from "./Stepper";
import HairdresserForm from "./HairdresserForm";
import AvailableDatesForm from "./AvailableDatesForm";
import ContactForm from "./ContactForm";
import SummaryForm from "./SummaryForm";

type FadeInProps = {
  children: ReactNode;
};

const FadeIn = ({ children }: FadeInProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ ease: "easeInOut", duration: 0.75 }}
  >
    {children}
  </motion.div>
);

type MultiStepFormProps = {
  schedule: Schedule | null;
  bookings: Booking[];
};

const MultiStepForm = ({ bookings, schedule }: MultiStepFormProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedService, setSelectedService] = useState<TService | null>(null);
  const [selectedExtraService, setSelectedExtraService] =
    useState<TService | null>(null);
  const [selectedHairdresser, setSelectedHairdresser] = useState<
    "Timi" | "nem_Timi" | null
  >("Timi");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(Date.now()));
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
    otherInfo: "",
  });

  const modifyContactInfo = (key: string, value: string) => {
    setContactInfo({ ...contactInfo, [key]: value });
  };

  const selectService = (service: TService) => {
    setSelectedExtraService(null);
    setSelectedService(service);
  };

  const selectExtraService = (service: TService | null) => {
    setSelectedExtraService(service);
  };

  const selectHairdresser = (hairdresser: "Timi" | "nem_Timi") => {
    setSelectedHairdresser(hairdresser);
  };

  const incrementActiveStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const decrementActiveStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const postBookingData = async () => {
    if (!selectedHairdresser || !selectedService || !selectedTimeSlot) return;

    const response = await fetch("/api/booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        mapMultistepFormDataToBooking({
          selectedHairdresser,
          selectedService,
          selectedExtraService,
          contactInfo,
          selectedDate,
          selectedTimeSlot,
        })
      ),
    });

    const data = await response.json();

    return data;
  };

  const deleteBookingData = async (id: string) => {
    const response = await fetch(`/api/booking/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    return data;
  };

  return (
    <div className="w-full sm:w-auto">
      <BackgroundBlur className="min-h-[75vh] min-w-[75vw] flex flex-col w-full mx-auto">
        <Stepper activeStep={activeStep} />

        <div className="flex flex-col flex-1">
          {activeStep === 0 && (
            <FadeIn>
              <ServicesForm
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedTimeSlot={selectedTimeSlot}
                setSelectedTimeSlot={setSelectedTimeSlot}
                selectService={selectService}
                selectedService={selectedService}
                selectExtraService={selectExtraService}
                incrementActiveStep={incrementActiveStep}
              />
            </FadeIn>
          )}

          {activeStep === 1 && (
            <FadeIn>
              <HairdresserForm
                selectedHairdresser={selectedHairdresser}
                selectHairdresser={selectHairdresser}
                incrementActiveStep={incrementActiveStep}
                decrementActiveStep={decrementActiveStep}
              />
            </FadeIn>
          )}

          {activeStep === 2 && schedule && selectedService && (
            <FadeIn>
              <AvailableDatesForm
                bookings={bookings}
                setSelectedDate={setSelectedDate}
                selectedDate={selectedDate}
                selectedTimeSlot={selectedTimeSlot}
                setSelectedTimeSlot={setSelectedTimeSlot}
                selectedService={selectedService}
                selectedExtraService={selectedExtraService}
                selectedHairdresser={selectedHairdresser!}
                schedule={schedule}
                incrementActiveStep={incrementActiveStep}
                decrementActiveStep={decrementActiveStep}
              />
            </FadeIn>
          )}

          {activeStep === 3 &&
            selectedHairdresser &&
            selectedTimeSlot &&
            selectedService && (
              <FadeIn>
                <ContactForm
                  contactInfo={contactInfo}
                  modifyContactInfo={modifyContactInfo}
                  incrementActiveStep={incrementActiveStep}
                  decrementActiveStep={decrementActiveStep}
                  postBookingData={postBookingData}
                  deleteBookingData={deleteBookingData}
                  booking={mapMultistepFormDataToBooking({
                    selectedHairdresser,
                    selectedService,
                    selectedExtraService,
                    contactInfo,
                    selectedDate,
                    selectedTimeSlot,
                  })}
                />
              </FadeIn>
            )}

          {activeStep === 4 && selectedService && (
            <FadeIn>
              <SummaryForm
                selectedService={selectedService}
                selectedExtraService={selectedExtraService}
                selectedHairdresser={selectedHairdresser}
                selectedDate={selectedDate}
                selectedTimeSlot={selectedTimeSlot}
              />
            </FadeIn>
          )}
        </div>
      </BackgroundBlur>
    </div>
  );
};

export default MultiStepForm;
