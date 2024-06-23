import { isBefore, startOfDay } from "date-fns";

export const isBeforeAug1 = (date: Date) =>
  isBefore(date, startOfDay(new Date("2024-08-01")));
