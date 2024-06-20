import Image from "next/image";

import About from "@/components/About";
import Contact from "@/components/Contact";
import Landing from "@/components/Landing";
import OurWorks from "@/components/OurWorks";
import Transition from "@/components/Transition";
import ExtraServices from "@/components/ExtraServices";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Botanic Beauty",
  description:
    "botanic-beauty.hu -  A szalon koncepcióját, fenntarthatóság iránti elkötelezettséggel hoztam létre , ezért vegán, állatkísérlet mentes termékekkel dolgozom. Ebben a szalonban minden a te elképzelésedről és a minőségi, de megfizethető és környezetbarát anyagok használatáról szól.",
  keywords: [
    "Fodrászat Budapest",
    "Fodrász Újpest",
    "Női fodrász Budapest",
    "Női fodrász Újpest",
    "Férfi fodrász Budapest",
    "Férfi fodrász Újpest",
    "Hajfestés Budapest",
    "Hajfestés Újpest",
    "Színes hajfestés Budapest",
    "Színes hajfestés Újpest",
    "Vegán fodrászat Budapest",
    "Vegán fodrászat Újpest",
    "Vegán hajfestés Budapest",
    "Vegán hajfestés Újpest",
    "Környezetbarát fodrászat Budapest",
    "Környezetbarát fodrászat Újpest",
    "Állatbarát fodrászat Budapest",
    "Állatbarát fodrászat Újpest",
    "Fenntartható szépségápolás Budapest",
    "Fenntartható szépségápolás Újpest",
    "Vegán hajápolás Budapest",
    "Vegán hajápolás Újpest",
    "Hajápolás és tanácsadás Budapest",
    "Hajápolás és tanácsadás Újpest",
    "Hajfestés és hajápolás Budapest",
    "Hajfestés és hajápolás Újpest",
  ],
  openGraph: {
    url: "https://botanic-beauty.hu",
    type: "website",
    title: "Botanic Beauty",
    description:
      "botanic-beauty.hu -  A szalon koncepcióját, fenntarthatóság iránti elkötelezettséggel hoztam létre , ezért vegán, állatkísérlet mentes termékekkel dolgozom. Ebben a szalonban minden a te elképzelésedről és a minőségi, de megfizethető és környezetbarát anyagok használatáról szól.",
    images: [
      {
        // TODO / medium: add proper image
        url: "https://botanic-beauty.hu/images/home/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "Botanic Beauty",
      },
    ],
  },
  // TODO / low: ennek utánanézni, hogy egyáltalán nekünk kell-e twitteres cucc
  // twitter: {
  //   card: "summary_large_image",
  //   title: "Botanic Beauty",
  //   description:
  //     "botanic-beauty.hu -  A szalon koncepcióját, fenntarthatóság iránti elkötelezettséggel hoztam létre , ezért vegán, állatkísérlet mentes termékekkel dolgozom. Ebben a szalonban minden a te elképzelésedről és a minőségi, de megfizethető és környezetbarát anyagok használatáról szól.",
  //   creator: "@dminhvu02",
  //   site: "@dminhvu02",
  //   images: [
  //     {
  //       url: "https://botanic-beauty.hu/images/home/thumbnail.png",
  //       width: 1200,
  //       height: 630,
  //       alt: "dminhvu",
  //     },
  //   ],
  // },
  alternates: {
    canonical: "https://botanic-beauty.hu",
  },
};

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
