import MultiStepForm from "./components/MultiStepForm";
import "react-day-picker/dist/style.css";
import { getSchedule } from "@/actions/schedule";
import { getBookings } from "@/actions/booking";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Botanic Beauty | Időpontfoglalás",
  description:
    "Foglalj időpontot a Botanic Beauty szalonba online! Gyors és kényelmes időpontfoglalási rendszerünk segítségével egyszerűen választhatsz időpontot.",
  keywords: [
    "fodrászat időpontfoglalás Budapest",
    "fodrászat időpontfoglalás Újpest",
    "hajvágás időpont Budapest",
    "hajvágás időpont Újpest",
    "hajfestés időpontfoglalás",
    "vegán fodrász időpontfoglalás",
    "fenntartható hajápolás időpontfoglalás",
    "állatbarát fodrászat időpont",
  ],
  openGraph: {
    url: "https://botanic-beauty.hu/idopontfoglalas",
    type: "website",
    title: "Botanic Beauty | Időpontfoglalás",
    description:
      "Foglalj időpontot a Botanic Beauty szalonba online! Gyors és kényelmes időpontfoglalási rendszerünk segítségével egyszerűen választhatsz időpontot.",
    images: [
      {
        url: "https://botanic-beauty.hu/logo-google-square.png",
        width: 1200,
        height: 1200,
        alt: "Botanic Beauty Logo",
      },
      {
        url: "https://botanic-beauty.hu/logo-google-wide.png",
        width: 1200,
        height: 630,
        alt: "Botanic Beauty Logo",
      },
    ],
  },
};

const BookingPage = async () => {
  const schedule = await getSchedule();

  const bookings = await getBookings();

  return (
    <section className="px-2 sm:px-0 min-h-screen  flex flex-col items-center justify-start pt-24 mb-0!">
      <MultiStepForm schedule={schedule} bookings={bookings || []} />
    </section>
  );
};

export default BookingPage;
