import MultiStepForm from "./components/MultiStepForm";
import "react-day-picker/dist/style.css";

const BookingPage = async () => {
  return (
    <section className="min-h-screen  flex flex-col items-center justify-start pt-24 mb-0!">
      <MultiStepForm />
    </section>
  );
};

export default BookingPage;
