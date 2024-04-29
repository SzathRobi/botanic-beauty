import About from "@/components/About";
import Contact from "@/components/Contact";
import Hairdressers from "@/components/Hairdressers";
import Landing from "@/components/Landing";
import OurWorks from "@/components/OurWorks";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      <Image
        alt=""
        src="/site-bg.jpg"
        fill
        className="relative -z-10 object-cover"
      />
      <Landing />
      <About />
      <Hairdressers />
      <Contact />
      <OurWorks />
    </main>
  );
}
