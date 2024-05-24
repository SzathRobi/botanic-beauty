import { DayProps } from "react-day-picker";
import { SelectedDate } from "../types/selectedDate.type";

export const isBothPersonPresentOnDay = (
  selectedDates: SelectedDate[],
  day: DayProps
): boolean => {
  return true;
};
