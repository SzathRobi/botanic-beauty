"use client";

import { useState } from "react";
import ServicesForm from "./ServicesForm";
import Stepper from "./Stepper";
import BackgroundBlur from "@/components/BackgroundBlur";
import HairdresserForm from "./HairdresserForm";
import AvailableDatesForm from "./AvailableDatesForm";
import ContactForm from "./ContactForm";
import SummaryForm from "./SummaryForm";
import { Booking, Schedule, Service } from "@prisma/client";

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

  const addChoosenService = (service: any) => {
    setchoosenServices([...choosenServices, service]);
  };

  const removeChoosenService = (choosenService: any) => {
    setchoosenServices(
      choosenServices.filter((service) => service !== choosenService)
    );
  };

  // TODO: uncomment when there is more than 1 hairdresser in business
  // const chooseHairdresser = (hairdresser: "Timi" | "nem_Timi") => {
  //   setChoosenHairdresser(hairdresser);
  // };

  const incrementActiveStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const decrementActiveStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const postBookingData = async () => {
    const response = await fetch("/api/booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        services: choosenServices,
        hairdresser: choosenHairdresser,
        selectedDate: new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate()
        ),
        selectedTimeSlot,
        contactInfo,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error("Failed to post booking data");
    }

    return data;
  };

  return (
    <div className="w-full sm:w-auto">
      <BackgroundBlur className="min-h-[75vh] flex flex-col w-full mx-auto">
        <Stepper activeStep={activeStep} />

        <div className="flex-1">
          {activeStep === 0 && (
            <ServicesForm
              addChoosenService={addChoosenService}
              activeStep={activeStep}
              removeChoosenService={removeChoosenService}
              choosenServices={choosenServices}
              incrementActiveStep={incrementActiveStep}
              decrementActiveStep={decrementActiveStep}
            />
          )}

          {/* TODO: uncomment when there is more than 1 hairdresser in business */}
          {/* {activeStep === 1 && (
            <HairdresserForm
              choosenHairdresser={choosenHairdresser}
              chooseHairdresser={chooseHairdresser}
              incrementActiveStep={incrementActiveStep}
              decrementActiveStep={decrementActiveStep}
            />
          )} */}

          {activeStep === 1 && schedule && (
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
          )}

          {activeStep === 2 && (
            <ContactForm
              contactInfo={contactInfo}
              modifyContactInfo={modifyContactInfo}
              incrementActiveStep={incrementActiveStep}
              decrementActiveStep={decrementActiveStep}
              postBookingData={postBookingData}
            />
          )}

          {activeStep === 3 && (
            <SummaryForm
              choosenServices={choosenServices}
              choosenHairdresser={choosenHairdresser}
              selectedDate={selectedDate}
              selectedTimeSlot={selectedTimeSlot}
              contactInfo={contactInfo}
            />
          )}
        </div>
      </BackgroundBlur>
    </div>
  );
};

export default MultiStepForm;
