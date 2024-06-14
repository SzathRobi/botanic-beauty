import MultiStepForm from "./components/MultiStepForm";
import "react-day-picker/dist/style.css";
import { getSchedule } from "@/actions/schedule";
import { getBookings } from "@/actions/booking";

const BookingPage = async () => {
  const schedule = await getSchedule();

  const bookings = await getBookings();

  // TODO / high: race kondition kezelése, pl ha orrod elől viszik el az időpontot, akkor az nem fog látszódni. Backenden kezelni, hogy overlapping booking soha ne lehessen, aztán revalidálni itt mindent és befrissíteni neki az adatokat

  return (
    <section className="min-h-screen  flex flex-col items-center justify-start pt-24 mb-0!">
      <MultiStepForm schedule={schedule} bookings={bookings || []} />
    </section>
  );
};

export default BookingPage;
