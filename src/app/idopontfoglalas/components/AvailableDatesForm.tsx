"use client";

import { useEffect, useState } from "react";
import {
  addDays,
  isBefore,
  isSameDay,
  isSunday,
  isToday,
  addMinutes,
  setHours,
  setMinutes,
  startOfDay,
} from "date-fns";

import { DayPicker } from "react-day-picker";
import TimeSlots from "./TimeSlots";
import { Booking, OffDay, Schedule, Service } from "@prisma/client";
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
  choosenServices: Service[];
  choosenHairdresser: "Timi" | "nem_Timi";
  schedule: Schedule;
  incrementActiveStep: () => void;
  decrementActiveStep: () => void;
};

const roundUpToNearestQuarter = (date: Date): Date => {
  const minutes = date.getMinutes();
  const remainder = minutes % 15;
  if (remainder !== 0) {
    date = addMinutes(date, 15 - remainder);
  }
  return date;
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
  const now = new Date();
  const tPlus2Hours = roundUpToNearestQuarter(addMinutes(now, 120));

  const [
    datesWithNoTimeForSelectedService,
    setDatesWithNoTimeForSelectedService,
  ] = useState<Date[]>([]);

  const hairdresserOffDays: Date[] = schedule.offDays
    .filter((offDay: OffDay) => offDay.person === choosenHairdresser)
    .map((offDay: OffDay) => offDay.date);
  const isClosedForToday = selectedDate.getHours() >= LAST_BOOKING_HOUR;

  let choosenServicesDuration = 0;

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

  const getOpeningHour = () => {
    const date = startOfDay(new Date());
    return setMinutes(setHours(date, OPENING_HOUR), 0);
  };

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
            hairdresserOffDays.some((offDay) => isSameDay(offDay, date)) ||
            datesWithNoTimeForSelectedService.some((datesWithNoTime) =>
              isSameDay(datesWithNoTime, date)
            )
          }
          onSelect={handleSelect}
        />
        <TimeSlots
          bookings={bookings}
          startTime={isToday(selectedDate) ? tPlus2Hours : getOpeningHour()}
          endTime={CLOSING_HOUR}
          interval={choosenServicesDuration}
          isClosedDay={isClosedDay}
          isClosedForToday={isClosedForToday}
          selectedTimeSlot={selectedTimeSlot}
          setSelectedTimeSlot={setSelectedTimeSlot}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          setDatesWithNoTimeForSelectedService={
            setDatesWithNoTimeForSelectedService
          }
          isSelectedHairdresserOffDay={hairdresserOffDays.some((offDay) =>
            isSameDay(offDay, selectedDate)
          )}
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="secondary" onClick={decrementActiveStep}>
          Vissza
        </Button>
        <Button
          disabled={selectedTimeSlot === null}
          onClick={incrementActiveStep}
        >
          Tovább
        </Button>
      </div>
    </div>
  );
};

export default AvailableDatesForm;
