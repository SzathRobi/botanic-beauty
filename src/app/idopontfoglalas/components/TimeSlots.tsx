"use client";

import {
  format,
  addDays,
  addMinutes,
  startOfDay,
  isToday,
  isSunday,
  setMinutes,
  setHours,
  isSameDay,
  setDate,
} from "date-fns";
import { Booking } from "@prisma/client";

type TimeSlotsProps = {
  bookings: Booking[];
  startTime: Date;
  endTime: number;
  interval: number;
  isClosedDay: boolean;
  isClosedForToday: boolean;
  selectedTimeSlot: string | null;
  setSelectedTimeSlot: (timeSlot: string) => void;
  selectedDate: Date;
  setDatesWithNoTimeForSelectedService: (stuff: any) => any;
  setSelectedDate: (date: Date) => void;
  isSelectedHairdresserOffDay: boolean;
};

const getBookingStartAndEndDate = (
  selectedDate: string,
  selectedTimeSlot: string
): {
  start: Date;
  end: Date;
} => {
  const baseDate = startOfDay(selectedDate);

  const [startTime, endTime] = selectedTimeSlot.split(" - ");
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const start = setMinutes(setHours(baseDate, startHour), startMinute);
  const end = setMinutes(setHours(baseDate, endHour), endMinute);

  return { start, end };
};

const roundUpToNearestQuarter = (date: Date): Date => {
  const minutes = date.getMinutes();
  const remainder = minutes % 15;
  if (remainder !== 0) {
    date = addMinutes(date, 15 - remainder);
  }
  return date;
};

const TimeSlots = ({
  startTime,
  endTime,
  interval,
  isClosedDay,
  isClosedForToday,
  selectedTimeSlot,
  setSelectedTimeSlot,
  selectedDate,
  setDatesWithNoTimeForSelectedService,
  setSelectedDate,
  bookings,
  isSelectedHairdresserOffDay,
}: TimeSlotsProps) => {
  if (
    isSunday(selectedDate) ||
    isSelectedHairdresserOffDay ||
    isClosedDay ||
    (isToday(selectedDate) && isClosedForToday)
  ) {
    setSelectedDate(addDays(selectedDate, 1));
  }

  const bookingsForSelectedDay = bookings.filter((booking) =>
    isSameDay(booking.selectedDate, selectedDate)
  );

  const isOverlappingDate = (time: Date, interval: number): boolean => {
    const startDate = setDate(time, selectedDate.getDate());
    const endDate = addMinutes(startDate, interval);

    return bookingsForSelectedDay.some((booking) => {
      const { start, end } = getBookingStartAndEndDate(
        booking.selectedDate,
        booking.selectedTimeSlot
      );

      return (
        (startDate >= start && startDate < end) || // Új foglalás kezdete ütközik egy meglévő foglalással
        (endDate > start && endDate <= end) || // Új foglalás vége ütközik egy meglévő foglalással
        (startDate <= start && endDate >= end) // Új foglalás lefedi a meglévő foglalást
      );
    });
  };

  const renderTimeSlots = () => {
    if (isSunday(selectedDate)) {
      setSelectedDate(addDays(selectedDate, 1));
    }

    const timeSlots = [];
    let currentTime = roundUpToNearestQuarter(startTime);

    while (currentTime.getHours() + Math.ceil(interval / 60) < endTime) {
      const endTimeSlot = addMinutes(currentTime, interval);
      const timeSlotText = `${format(currentTime, "HH:mm")} - ${format(
        endTimeSlot,
        "HH:mm"
      )}`;

      if (!isOverlappingDate(currentTime, interval)) {
        timeSlots.push(
          <button
            key={timeSlotText}
            onClick={() => setSelectedTimeSlot(timeSlotText)}
            className={`p-2 ${isClosedDay && "opacity-50 cursor-not-allowed"} ${
              selectedTimeSlot === timeSlotText
                ? "bg-green-600/40"
                : "bg-black/50"
            } transition`}
            disabled={isClosedDay}
          >
            {timeSlotText}
          </button>
        );
      }

      currentTime = addMinutes(currentTime, 15);
    }

    if (timeSlots.length === 0) {
      setDatesWithNoTimeForSelectedService((prevDates: any) => [
        ...prevDates,
        selectedDate,
      ]);
      setSelectedDate(addDays(selectedDate, 1));
    }

    return timeSlots;
  };

  return (
    <div>
      <div className="h-6 opacity-0 mb-2" />
      <div className="time-slots-container grid grid-cols-3 gap-4">
        {renderTimeSlots()}
      </div>
    </div>
  );
};

export default TimeSlots;
