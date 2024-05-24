import { DayProps } from "react-day-picker";
import { SelectedDate } from "../types/selectedDate.type";

export const isPersonSelected = (
  selectedDates: SelectedDate[],
  day: DayProps,
  person: "Timi" | "nem_Timi"
): boolean =>
  selectedDates.some(
    (date) =>
      new Date(date.date).getTime() === day.date.getTime() &&
      date.person === person
  );
