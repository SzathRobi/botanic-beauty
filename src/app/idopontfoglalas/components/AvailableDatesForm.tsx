import { useEffect, useState } from "react";
import { format, isBefore, isSameDay } from "date-fns";

import { DayPicker } from "react-day-picker";
import TimeSlots from "./TimeSlots";

type AvailableDatesFormProps = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  selectedTimeSlot: string | null;
  setSelectedTimeSlot: (timeSlot: string | null) => void;
  choosenServices: any[];
};

const AvailableDatesForm = ({
  selectedDate,
  setSelectedDate,
  selectedTimeSlot,
  setSelectedTimeSlot,
  choosenServices,
}: AvailableDatesFormProps) => {
  const closedDays = [
    new Date("2024-04-25"),
    new Date("2024-04-26"),
    new Date("2024-04-27"),
  ];

  const [isClosedDay, setIsClosedDay] = useState<boolean>(false);

  let choosenServicesDuration = 0;

  choosenServices.forEach((service) => {
    choosenServicesDuration += service.duration;
  });

  const isClosedDaysIncludesDate = (closedDays: Date[], date: Date) => {
    return closedDays.some((innerDate) => isSameDay(innerDate, date));
  };

  const handleSelect = (day: Date | undefined) => {
    if (day) {
      setSelectedDate(day);
    }
  };

  let footer = <p>Please pick a day.</p>;
  if (selectedDate) {
    footer = <p>You picked {format(selectedDate, "PP")}.</p>;
  }

  useEffect(() => {
    setIsClosedDay(isClosedDaysIncludesDate(closedDays, selectedDate));
  }, [selectedDate]);

  useEffect(() => {
    if (isClosedDay) {
      setSelectedTimeSlot(null);
    }
  }, [isClosedDay]);

  return (
    <div className="mb-8 flex flex-col md:flex-row justify-between items-start gap-4">
      <DayPicker
        mode="single"
        selected={selectedDate}
        disabled={(date) => isBefore(date, new Date() || isClosedDay)}
        onSelect={handleSelect}
        footer={footer}
      />

      <TimeSlots
        startTime={6}
        endTime={18}
        interval={choosenServicesDuration}
        isClosedDay={isClosedDay}
        selectedTimeSlot={selectedTimeSlot}
        setSelectedTimeSlot={setSelectedTimeSlot}
      />
    </div>
  );
};

export default AvailableDatesForm;
