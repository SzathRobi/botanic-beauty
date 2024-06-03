import Image from "next/image";

import About from "@/components/About";
import Contact from "@/components/Contact";
import Hairdressers from "@/components/Hairdressers";
import Landing from "@/components/Landing";
import OurWorks from "@/components/OurWorks";
import Transition from "@/components/Transition";
import ExtraServices from "@/components/ExtraServices";

export default function Home() {
  return (
    <Transition>
      <main className="relative flex min-h-screen flex-col items-center justify-center">
        <Landing />
        <ExtraServices />
        <About />
        {/* <Hairdressers /> */}
        <Contact />
        <OurWorks />
      </main>
    </Transition>
  );
}
