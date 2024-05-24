"use client";

import { useEffect, useState } from "react";
import {
  addHours,
  format,
  isBefore,
  isSameDay,
  isSunday,
  isToday,
} from "date-fns";

import { DayPicker } from "react-day-picker";
import TimeSlots from "./TimeSlots";
import { Booking, Schedule } from "@prisma/client";
import {
  CLOSING_HOUR,
  LAST_BOOKING_HOUR,
  OPENING_HOUR,
} from "../constants/openingHours.constants";
import Button from "@/components/Button";

type AvailableDatesFormProps = {
  bookings: Booking[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  selectedTimeSlot: string | null;
  setSelectedTimeSlot: (timeSlot: string | null) => void;
  choosenServices: any[];
  choosenHairdresser: "Timi" | "nem_Timi";
  schedule: Schedule;
  incrementActiveStep: () => void;
  decrementActiveStep: () => void;
};

const AvailableDatesForm = ({
  bookings,
  selectedDate,
  setSelectedDate,
  selectedTimeSlot,
  setSelectedTimeSlot,
  choosenServices,
  choosenHairdresser,
  schedule,
  decrementActiveStep,
  incrementActiveStep,
}: AvailableDatesFormProps) => {
  const tPlus2Hours = Number(format(addHours(new Date(), 2), "H"));

  const hairdresserOffDays = schedule.offDays
    .filter((offDay: any) => offDay.person === choosenHairdresser)
    .map((offDay: any) => offDay.date);
  const isClosedForToday = selectedDate.getHours() >= LAST_BOOKING_HOUR;

  let choosenServicesDuration = 0;
  // TODO: nem bizti hogy kell, ha kell akkor magyarosítani
  let footer = <p>Please pick a day.</p>;

  // TODO: nem bizti hogy kell
  const [isClosedDay, setIsClosedDay] = useState<boolean>(false);

  choosenServices.forEach((service) => {
    choosenServicesDuration += service.duration;
  });

  const handleSelect = (day: Date | undefined) => {
    if (day) {
      setSelectedDate(day);
    }
  };

  if (selectedDate) {
    footer = <p>You picked {format(selectedDate, "PP")}.</p>;
  }

  useEffect(() => {
    if (isClosedDay) {
      setSelectedTimeSlot(null);
    }
  }, [isClosedDay]);

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <DayPicker
          mode="single"
          selected={selectedDate}
          weekStartsOn={1}
          disabled={(date) =>
            isBefore(date, new Date(Date.now())) ||
            isClosedDay ||
            isSunday(date) ||
            hairdresserOffDays.some(
              // TODO: ha többen lesznek ezt átírni
              (offDay) =>
                isSameDay(offDay, date) && offDay.person === choosenHairdresser
            )
          }
          onSelect={handleSelect}
          footer={footer}
        />

        <TimeSlots
          bookings={bookings}
          startTime={isToday(selectedDate) ? tPlus2Hours : OPENING_HOUR}
          endTime={CLOSING_HOUR}
          interval={choosenServicesDuration}
          isClosedDay={isClosedDay}
          isClosedForToday={isClosedForToday}
          selectedTimeSlot={selectedTimeSlot}
          setSelectedTimeSlot={setSelectedTimeSlot}
          selectedDate={selectedDate}
          isSelectedHairdresserOffDay={hairdresserOffDays.some((offDay) =>
            isSameDay(offDay, selectedDate)
          )}
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          className="disabled:cursor-not-allowed disabled:opacity-80 rounded text-green-600 px-4 py-2 font-bold hover:text-green-700 border border-green-600 hover:border-green-700"
          onClick={decrementActiveStep}
        >
          Previous
        </Button>
        <Button
          disabled={selectedTimeSlot === null}
          className="disabled:cursor-not-allowed disabled:opacity-80 rounded bg-green-600 px-4 py-2 font-bold text-white hover:bg-green-700"
          onClick={incrementActiveStep}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AvailableDatesForm;
