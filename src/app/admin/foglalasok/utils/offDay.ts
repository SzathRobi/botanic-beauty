import { isSameDay } from "date-fns";
import { OffDay } from "@prisma/client";

export const isOffDayOfTimi = (
  dateToCheck: Date,
  OffDays: OffDay[]
): boolean => {
  return OffDays.some(
    (offDay) => isSameDay(offDay.date, dateToCheck) && offDay.person === "Timi"
  );
};

export const isOffDayOfNemTimi = (
  dateToCheck: Date,
  OffDays: OffDay[]
): boolean => {
  return OffDays.some(
    (offDay) =>
      isSameDay(offDay.date, dateToCheck) && offDay.person === "nem_Timi"
  );
};
