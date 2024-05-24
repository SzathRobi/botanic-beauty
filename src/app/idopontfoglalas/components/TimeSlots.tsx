"use client";

import {
  format,
  addMinutes,
  isWithinInterval,
  startOfDay,
  parseISO,
  setMinutes,
  setHours,
  isSameDay,
  setDate,
} from "date-fns";
import { Booking } from "@prisma/client";

type TimeSlotsProps = {
  bookings: Booking[];
  startTime: number;
  endTime: number;
  interval: number;
  isClosedDay: boolean;
  isClosedForToday: boolean;
  selectedTimeSlot: string | null;
  setSelectedTimeSlot: (timeSlot: string) => void;
  selectedDate: Date;
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

const TimeSlots = ({
  startTime,
  endTime,
  interval,
  isClosedDay,
  isClosedForToday,
  selectedTimeSlot,
  setSelectedTimeSlot,
  selectedDate,
  bookings,
  isSelectedHairdresserOffDay,
}: TimeSlotsProps) => {
  if (isSelectedHairdresserOffDay) {
    return (
      <div>
        <p className="bg-red-600 p-2 rounded text-white mb-2 text-center">
          A fodrász ezen a napon nem dolgozik.
        </p>
      </div>
    );
  }

  if (isClosedDay) {
    return (
      <div>
        <p className="bg-red-600 p-2 rounded text-white mb-2 text-center">
          Ezen a napon a szalon zárva van.
        </p>
      </div>
    );
  }

  if (isClosedForToday) {
    return (
      <div>
        <p className="bg-red-600 p-2 rounded text-white mb-2 text-center">
          Mára már nem lehet időpontot foglalni.
        </p>
      </div>
    );
  }

  const bookingsForToday = bookings.filter((booking) =>
    isSameDay(booking.selectedDate, selectedDate)
  );

  const isOverlappingDate = (time: Date): boolean => {
    const dateSlot = setDate(time, selectedDate.getDate());

    return bookingsForToday.some((booking) => {
      const { start, end } = getBookingStartAndEndDate(
        booking.selectedDate,
        booking.selectedTimeSlot
      );

      return isWithinInterval(dateSlot, {
        start,
        end,
      });
    });
  };

  const renderTimeSlots = () => {
    const timeSlots = [];
    let currentTime = startOfDay(new Date());
    currentTime.setHours(startTime);

    while (currentTime.getHours() + Math.ceil(interval / 60) < endTime) {
      const endTimeSlot = addMinutes(currentTime, interval);
      const timeSlotText = `${format(currentTime, "HH:mm")} - ${format(
        endTimeSlot,
        "HH:mm"
      )}`;

      !isOverlappingDate(currentTime) &&
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

      currentTime = addMinutes(currentTime, 15);
    }

    if (timeSlots.length === 0) {
      timeSlots.push(
        <div className="col-span-full">
          <p className="bg-red-600 p-2 rounded text-white mb-2 text-center">
            Ilyen hosszú szabad időpont mára már nincsen
          </p>
        </div>
      );
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
