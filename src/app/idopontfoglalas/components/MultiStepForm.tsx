"use client";

import { useState } from "react";
import ServicesForm from "./ServicesForm";
import Stepper from "./Stepper";
import BackgroundBlur from "@/components/BackgroundBlur";
import Button from "@/components/Button";
import HairdresserForm from "./HairdresserForm";
import AvailableDatesForm from "./AvailableDatesForm";
import ContactForm from "./ContactForm";
import SummaryForm from "./SummaryForm";

const MultiStepForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [choosenServices, setchoosenServices] = useState<any[]>([]);
  const [choosenHairdresser, setChoosenHairdresser] = useState<
    "Timi" | "nem Timi" | null
  >(null);
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

  const chooseHairdresser = (hairdresser: "Timi" | "nem Timi") => {
    setChoosenHairdresser(hairdresser);
  };

  const handleNextStep = () => {
    setActiveStep((prevActiveStep) =>
      prevActiveStep < 5 ? prevActiveStep + 1 : prevActiveStep
    );
  };

  const handlePreviousStep = () => {
    setActiveStep((prevActiveStep) =>
      prevActiveStep > 0 ? prevActiveStep - 1 : prevActiveStep
    );
  };

  return (
    <div className="w-full sm:w-auto">
      <BackgroundBlur className="min-h-[75vh] flex flex-col w-full mx-auto">
        <Stepper activeStep={activeStep} />

        <div className="flex-1">
          {activeStep === 0 && (
            <ServicesForm
              addChoosenService={addChoosenService}
              removeChoosenService={removeChoosenService}
              choosenServices={choosenServices}
            />
          )}

          {activeStep === 1 && (
            <HairdresserForm
              choosenHairdresser={choosenHairdresser}
              chooseHairdresser={chooseHairdresser}
            />
          )}

          {activeStep === 2 && (
            <AvailableDatesForm
              setSelectedDate={setSelectedDate}
              selectedDate={selectedDate}
              selectedTimeSlot={selectedTimeSlot}
              setSelectedTimeSlot={setSelectedTimeSlot}
              choosenServices={choosenServices}
            />
          )}

          {activeStep === 3 && (
            <ContactForm
              contactInfo={contactInfo}
              modifyContactInfo={modifyContactInfo}
            />
          )}

          {activeStep === 4 && (
            <SummaryForm
              choosenServices={choosenServices}
              choosenHairdresser={choosenHairdresser}
              selectedDate={selectedDate}
              selectedTimeSlot={selectedTimeSlot}
              contactInfo={contactInfo}
            />
          )}
        </div>

        {activeStep !== 4 && (
          <div className="flex items-center justify-end gap-2">
            <Button
              className="disabled:cursor-not-allowed disabled:opacity-80 rounded text-green-600 px-4 py-2 font-bold hover:text-green-700 border border-green-600 hover:border-green-700"
              disabled={activeStep === 0 || activeStep === 4}
              onClick={handlePreviousStep}
            >
              Previous
            </Button>
            <Button
              className="disabled:cursor-not-allowed disabled:opacity-80 rounded bg-green-600 px-4 py-2 font-bold text-white hover:bg-green-700"
              disabled={
                (activeStep === 0 && choosenServices.length === 0) ||
                (activeStep === 1 && choosenHairdresser === null) ||
                (activeStep === 2 && selectedTimeSlot === null) ||
                (activeStep === 3 &&
                  (contactInfo.name === "" ||
                    contactInfo.email === "" ||
                    contactInfo.phone === "")) ||
                activeStep === 4
              }
              onClick={handleNextStep}
            >
              Next
            </Button>
          </div>
        )}
      </BackgroundBlur>
    </div>
  );
};

export default MultiStepForm;
