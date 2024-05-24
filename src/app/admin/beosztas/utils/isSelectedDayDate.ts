import { DayProps } from "react-day-picker";
import { SelectedDate } from "../types/selectedDate.type";

export const isSelectedDayDate = (
  selectedDates: SelectedDate[],
  selectedPerson: string,
  day: DayProps
): boolean =>
  selectedDates.some(
    (date) =>
      new Date(date.date).getTime() === day.date.getTime() &&
      date.person === selectedPerson
  );
