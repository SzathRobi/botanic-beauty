import MultiStepForm from "./components/MultiStepForm";
import "react-day-picker/dist/style.css";
import { getSchedule } from "@/actions/schedule";
import { getBookings } from "@/actions/booking";

const BookingPage = async () => {
  const schedule = await getSchedule();

  const bookings = await getBookings();

  // TODO: néha navigálás / formstep ugrásnál nem az oldal tetején kezdünk
  return (
    <section className="px-2 sm:px-0 min-h-screen  flex flex-col items-center justify-start pt-24 mb-0!">
      <MultiStepForm schedule={schedule} bookings={bookings || []} />
    </section>
  );
};

export default BookingPage;
