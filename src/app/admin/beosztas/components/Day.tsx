"use client";

import { isSunday, isSameDay } from "date-fns";
import { DayProps } from "react-day-picker";

import { SelectedDate } from "../types/selectedDate.type";
import { isSelectedDayDate } from "../utils/isSelectedDayDate";
import { isPersonSelected } from "../utils/isPersonSelected";

type DayComponentProps = {
  selectedDates: SelectedDate[];
  day: DayProps;
  selectedPerson: string;
  datesAppearingTwice: Date[];
  handleDayClick: (day: any) => void;
};

const Day = ({
  day,
  selectedDates,
  selectedPerson,
  datesAppearingTwice,
  handleDayClick,
}: DayComponentProps) => {
  let color = "";
  let cursor = "cursor-pointer";
  let opacity = 1;

  if (
    datesAppearingTwice.some((dateAppearingTwice) =>
      isSameDay(dateAppearingTwice, day.date)
    )
  ) {
    color = "orange";
  } else if (isSelectedDayDate(selectedDates, selectedPerson, day)) {
    color = selectedPerson === "Timi" ? "red" : "blue";
  } else if (isSunday(day.date)) {
    color = "gray";
    cursor = "cursor-not-allowed";
    opacity = 0.8;
  } else if (isPersonSelected(selectedDates, day, "Timi")) {
    color = "red";
  } else if (isPersonSelected(selectedDates, day, "nem_Timi")) {
    color = "blue";
  }

  return (
    <div
      style={{ backgroundColor: color, cursor, opacity }}
      onClick={() => (isSunday(day.date) ? null : handleDayClick(day))}
    >
      {day.date.getDate()}
    </div>
  );
};

export default Day;
