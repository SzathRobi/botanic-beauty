"use client";

import { format, addMinutes, startOfDay } from "date-fns";
import { useState } from "react";

type TimeSlotsProps = {
  startTime: number;
  endTime: number;
  interval: number;
  isClosedDay: boolean;
  selectedTimeSlot: string | null;
  setSelectedTimeSlot: (timeSlot: string) => void;
};

const TimeSlots = ({
  startTime,
  endTime,
  interval,
  isClosedDay,
  selectedTimeSlot,
  setSelectedTimeSlot,
}: TimeSlotsProps) => {
  const renderTimeSlots = () => {
    const timeSlots = [];
    let currentTime = startOfDay(new Date());
    currentTime.setHours(startTime);

    while (currentTime.getHours() < endTime) {
      const endTimeSlot = addMinutes(currentTime, interval);
      const timeSlotText = `${format(currentTime, "HH:mm")} - ${format(
        endTimeSlot,
        "HH:mm"
      )}`;

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

      currentTime = endTimeSlot;
    }

    return timeSlots;
  };

  return (
    <div>
      {isClosedDay ? (
        <p className="bg-red-600 p2 rounded text-white mb-2 text-center">
          Ezen a napon a szalon zárva van!
        </p>
      ) : (
        <div className="h-6 opacity-0 mb-2" />
      )}
      <div className="time-slots-container grid grid-cols-3 gap-4">
        {renderTimeSlots()}
      </div>
    </div>
  );
};

export default TimeSlots;
