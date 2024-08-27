import { getBookings } from "@/actions/booking";

import BigCalendar from "./components/bigCalendar/BigCalendar";
import { mapBookingToEvent } from "../mappers/mapBookingToEvent.mapper";

import "react-big-calendar/lib/css/react-big-calendar.css";
import BigCalendarContainer from "./components/bigCalendarContainer/BigCalendarContainer";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getSchedule } from "@/actions/schedule";
import BackgroundBlur from "@/components/BackgroundBlur";

const BookingPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/bejelentkezes");
  }

  const schedule = await getSchedule();

  const bookings = await getBookings();

  const calendarEvents = bookings?.map(mapBookingToEvent) ?? [];

  return (
    <div className="w-full min-h-screen">
      <BackgroundBlur className="!max-w-full mb-8">
        <h1 className="text-3xl mb-8">Foglalások</h1>

        <BigCalendarContainer
          events={calendarEvents}
          offDays={schedule?.offDays ?? []}
        />
      </BackgroundBlur>
    </div>
  );
};

export default BookingPage;
