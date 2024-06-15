"use client";

import { Booking, Schedule, Service } from "@prisma/client";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { ReactNode, useState } from "react";
import toast from "react-hot-toast";

import BackgroundBlur from "@/components/BackgroundBlur";
import { mapMultistepFormDataToBooking } from "../mappers/mapMultistepFormdataToBooking.mapper";
import ServicesForm from "./ServicesForm";
import Stepper from "./Stepper";

const HairdresserForm = dynamic(() => import("./HairdresserForm"));
const AvailableDatesForm = dynamic(() => import("./AvailableDatesForm"));
const ContactForm = dynamic(() => import("./ContactForm"));
const SummaryForm = dynamic(() => import("./SummaryForm"));

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
  const [choosenServices, setchoosenServices] = useState<Service[]>([]);
  const [choosenHairdresser, setChoosenHairdresser] = useState<
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

  const addChoosenService = (service: Service) => {
    setchoosenServices([...choosenServices, service]);
  };

  const removeChoosenService = (choosenService: Service) => {
    setchoosenServices(
      choosenServices.filter((service) => service !== choosenService)
    );
  };

  const chooseHairdresser = (hairdresser: "Timi" | "nem_Timi") => {
    setChoosenHairdresser(hairdresser);
  };

  const incrementActiveStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const decrementActiveStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const postBookingData = async () => {
    if (!choosenHairdresser || !selectedTimeSlot) return;

    const response = await fetch("/api/booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        mapMultistepFormDataToBooking({
          choosenHairdresser,
          choosenServices,
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
                addChoosenService={addChoosenService}
                activeStep={activeStep}
                removeChoosenService={removeChoosenService}
                choosenServices={choosenServices}
                incrementActiveStep={incrementActiveStep}
                decrementActiveStep={decrementActiveStep}
              />
            </FadeIn>
          )}

          {activeStep === 1 && (
            <HairdresserForm
              choosenHairdresser={choosenHairdresser}
              chooseHairdresser={chooseHairdresser}
              incrementActiveStep={incrementActiveStep}
              decrementActiveStep={decrementActiveStep}
            />
          )}

          {activeStep === 2 && schedule && (
            <FadeIn>
              <AvailableDatesForm
                bookings={bookings}
                setSelectedDate={setSelectedDate}
                selectedDate={selectedDate}
                selectedTimeSlot={selectedTimeSlot}
                setSelectedTimeSlot={setSelectedTimeSlot}
                choosenServices={choosenServices}
                choosenHairdresser={choosenHairdresser!}
                schedule={schedule}
                incrementActiveStep={incrementActiveStep}
                decrementActiveStep={decrementActiveStep}
              />
            </FadeIn>
          )}

          {activeStep === 3 && choosenHairdresser && selectedTimeSlot && (
            <FadeIn>
              <ContactForm
                contactInfo={contactInfo}
                modifyContactInfo={modifyContactInfo}
                incrementActiveStep={incrementActiveStep}
                decrementActiveStep={decrementActiveStep}
                postBookingData={postBookingData}
                deleteBookingData={deleteBookingData}
                booking={mapMultistepFormDataToBooking({
                  choosenHairdresser,
                  choosenServices,
                  contactInfo,
                  selectedDate,
                  selectedTimeSlot,
                })}
              />
            </FadeIn>
          )}

          {activeStep === 4 && (
            <FadeIn>
              <SummaryForm
                choosenServices={choosenServices}
                choosenHairdresser={choosenHairdresser}
                selectedDate={selectedDate}
                selectedTimeSlot={selectedTimeSlot}
                contactInfo={contactInfo}
              />
            </FadeIn>
          )}
        </div>
      </BackgroundBlur>
    </div>
  );
};

export default MultiStepForm;
