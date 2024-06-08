"use client";

import { useEffect, useState } from "react";
import {
  addDays,
  addHours,
  format,
  isBefore,
  isSameDay,
  isSunday,
  isToday,
} from "date-fns";

import { DayPicker } from "react-day-picker";
import TimeSlots from "./TimeSlots";
import { Booking, OffDay, Schedule, TService } from "@prisma/client";
import {
  CLOSING_HOUR,
  LAST_BOOKING_HOUR,
  OPENING_HOUR,
} from "../constants/openingHours.constants";
import { Button } from "@/components/Button";

type AvailableDatesFormProps = {
  bookings: Booking[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  selectedTimeSlot: string | null;
  setSelectedTimeSlot: (timeSlot: string | null) => void;
  choosenServices: TService[];
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

  const hairdresserOffDays: Date[] = schedule.offDays
    .filter((offDay: OffDay) => offDay.person === choosenHairdresser)
    .map((offDay: OffDay) => offDay.date);
  const isClosedForToday = selectedDate.getHours() >= LAST_BOOKING_HOUR;

  let choosenServicesDuration = 0;

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

  const getFirstAvailableDate = (): Date => {
    let firstAvailableDate = new Date(Date.now());

    while (
      isSunday(firstAvailableDate) ||
      hairdresserOffDays.some(
        (offDay) =>
          isSameDay(offDay, firstAvailableDate) ||
          (isClosedForToday && isToday(firstAvailableDate))
      )
    ) {
      firstAvailableDate = addDays(firstAvailableDate, 1);
    }

    return firstAvailableDate;
  };

  useEffect(() => {
    if (isClosedDay) {
      setSelectedTimeSlot(null);
    }
  }, [isClosedDay]);

  useEffect(() => {
    setSelectedDate(getFirstAvailableDate());
  }, []);

  return (
    <div className="mb-8">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start gap-4">
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
                // isSameDay(offDay, date) && offDay.person === choosenHairdresser
                isSameDay(offDay, date)
            )
          }
          onSelect={handleSelect}
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
        <Button type="button" variant="secondary" onClick={decrementActiveStep}>
          Previous
        </Button>
        <Button
          disabled={selectedTimeSlot === null}
          onClick={incrementActiveStep}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AvailableDatesForm;
