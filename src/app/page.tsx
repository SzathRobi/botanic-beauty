import Image from "next/image";

import About from "@/components/About";
import Contact from "@/components/Contact";
import Hairdressers from "@/components/Hairdressers";
import Landing from "@/components/Landing";
import OurWorks from "@/components/OurWorks";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      <div className="fixed top-0 left-0 -z-10 object-cover w-screen h-screen">
        <Image alt="" src="/site-bg.jpg" fill className="object-cover" />
      </div>
      <Landing />
      <About />
      <Hairdressers />
      <Contact />
      <OurWorks />
    </main>
  );
}
