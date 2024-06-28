import { isSameDay } from "date-fns";
import { TOffDay } from "@prisma/client";

export const isOffDayOfTimi = (
  dateToCheck: Date,
  OffDays: TOffDay[]
): boolean => {
  return OffDays.some(
    (offDay) => isSameDay(offDay.date, dateToCheck) && offDay.person === "Timi"
  );
};

export const isOffDayOfNemTimi = (
  dateToCheck: Date,
  OffDays: TOffDay[]
): boolean => {
  return OffDays.some(
    (offDay) =>
      isSameDay(offDay.date, dateToCheck) && offDay.person === "nem_Timi"
  );
};
