"use client";

import { ChangeEvent, useState } from "react";
import { DayPicker } from "react-day-picker";

import { SelectedDate } from "../types/selectedDate.type";
import Day from "./Day";
import { Button } from "@/components/Button";
import { modifySchedule } from "@/actions/schedule";
import { Hairdresser, Schedule } from "@prisma/client";

type ScheduleProps = {
  schedule: Schedule | null;
};

const Schedules = ({ schedule }: ScheduleProps) => {
  const [selectedDates, setSelectedDates] = useState<SelectedDate[]>(
    (schedule?.offDays as unknown as SelectedDate[]) || []
  );
  const [selectedPerson, setSelectedPerson] = useState<Hairdresser>("Timi");

  const dateCounts = selectedDates.reduce((acc, curr) => {
    const dateString = new Date(curr.date).toISOString(); // Dátum string formátumra alakítása
    acc[dateString] = (acc[dateString] || 0) + 1; // Ha még nem létezik a dátum a számoló objektumban, akkor inicializáljuk 0-val, majd hozzáadunk 1-et
    return acc;
  }, {} as { [key: string]: number });

  // Kiválasztjuk azokat a dátumokat, amelyek kétszer szerepelnek a selectedDates tömbben
  const datesAppearingTwice = Object.keys(dateCounts)
    .filter((dateString) => dateCounts[dateString] === 2)
    .map((dateString) => new Date(dateString));

  const handleDayClick = (day: any) => {
    const isSelected =
      selectedDates.length &&
      selectedDates.some(
        (date) =>
          new Date(date.date).getTime() === day.date.getTime() &&
          date.person === selectedPerson
      );

    if (isSelected) {
      setSelectedDates((prevSelectedDates) =>
        prevSelectedDates.filter(
          (date) =>
            new Date(date.date).getTime() !== day.date.getTime() ||
            date.person !== selectedPerson
        )
      );
    } else {
      setSelectedDates([
        ...selectedDates,
        {
          date: day.date,
          displayMonth: day.displayMonth,
          person: selectedPerson,
        },
      ]);
    }
  };

  const handlePersonChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedPerson(event.target.value as Hairdresser);
  };

  return (
    <div>
      <DayPicker
        mode="multiple"
        selected={selectedDates.map((date) => date.date)}
        onDayClick={handleDayClick}
        numberOfMonths={3}
        weekStartsOn={1}
        components={{
          Day: (day) => (
            <Day
              day={day}
              selectedDates={selectedDates}
              selectedPerson={selectedPerson}
              handleDayClick={handleDayClick}
              datesAppearingTwice={datesAppearingTwice}
            />
          ),
        }}
      />
      <div className="flex gap-2 mb-8">
        <input
          type="radio"
          id="Timi"
          name="person"
          value="Timi"
          checked={selectedPerson === "Timi"}
          onChange={handlePersonChange}
        />
        <label htmlFor="Timi">Timi</label>

        <input
          type="radio"
          id="nem_Timi"
          name="person"
          value="nem_Timi"
          checked={selectedPerson === "nem_Timi"}
          onChange={handlePersonChange}
        />
        <label htmlFor="nem_Timi">nem_Timi</label>
      </div>

      <form
        action={async () => {
          // TODO: loading állapot kellene de maxi nagyon
          await modifySchedule(selectedDates, schedule?.id ?? "");
        }}
      >
        <Button type="submit">Mentés</Button>
      </form>
    </div>
  );
};

export default Schedules;
