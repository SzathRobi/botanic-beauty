import { PiHairDryer, PiScissors } from "react-icons/pi";
import { IoColorPaletteOutline } from "react-icons/io5";

import BackgroundBlur from "@/components/BackgroundBlur";
import Transition from "@/components/Transition";
import { SERVICE_GROUPS } from "@/constants/services.constants";
import { ServiceGroup } from "@/types/serviceGroup.type";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Botanic Beauty Hajszalon | Árlista",
  description:
    "Fedezd fel a Botanic Beauty árlistáját! Kínálatunkban megtalálod a hajvágás, hajfestés és egyéb szolgáltatások árait, mind vegán és környezetbarát termékekkel.",
  keywords: [
    "fodrászat árlista Budapest",
    "fodrászat árlista Újpest",
    "hajvágás árak Budapest",
    "hajvágás árak Újpest",
    "hajfestés árak Budapest",
    "hajfestés árak Újpest",
    "vegán fodrász árlista",
    "fenntartható hajápolás árak",
    "állatbarát fodrászat árak",
  ],
  openGraph: {
    url: "https://botanic-beauty.hu/arlista",
    type: "website",
    title: "Botanic Beauty Hajszalon | Árlista",
    description:
      "Fedezd fel a Botanic Beauty árlistáját! Kínálatunkban megtalálod a hajvágás, hajfestés és egyéb szolgáltatások árait, mind vegán és környezetbarát termékekkel.",
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

const getServiceIcon = (serviceGroup: ServiceGroup) => {
  if (serviceGroup.name === "Szárítás - Styling") {
    return <PiHairDryer size={32} />;
  }

  if (serviceGroup.name === "Hajvágás") {
    return <PiScissors size={32} />;
  }

  return <IoColorPaletteOutline size={32} />;
};

const PricinggPage = async () => {
  return (
    <Transition>
      <section className="px-2 sm:px-0 pt-24 relative flex min-h-screen flex-col items-center justify-center">
        <BackgroundBlur className="py-16">
          <h1 className="text-3xl text-center mb-12">Árlista</h1>

          <div className="mb-16">
            {SERVICE_GROUPS.map((servicegGroup) => (
              <div key={servicegGroup.name} className="mb-14">
                <div className="flex justify-between items-start border-b-2 border-b-white/50 pb-0 mb-10">
                  <h2 className="text-xl mb-4">{servicegGroup.name}</h2>

                  {getServiceIcon(servicegGroup)}
                </div>
                <ul className="pl-6 sm:pl-10">
                  {servicegGroup.services.map((service) => (
                    <li
                      key={service.name}
                      className="flex justify-between mb-6"
                    >
                      <p className="max-w-md">{service.name}</p>
                      <div className="flex gap-2 min-w-fit">
                        <p>{service.price} Ft</p>
                        <p>{servicegGroup.pricePostfix}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="space-y-8">
            <p>
              <span className="text-red-400">
                A Festések árai a felhasznált anyagok költségét nem
                tartalmazzák!
              </span>{" "}
              Festések mellé hajvágásra 50% kedvezményt biztosítunk!{" "}
            </p>
            <ul className="pl-6 sm:pl-10">
              <li>hajfestékek activátorral: 100 Ft / g</li>
              <li>szőkitőpor activátorral: 100 Ft/ g</li>
            </ul>

            <p>
              Az anyag használat a haj mennyiségétől függ, így az ár egyénenként
              minimálisan eltérhet!
            </p>

            <p className="text-sm">
              (átlag anyag használati példák: tőfestés kb. 40-60 g = +4800 -
              7200 Ft anyagár, teljes festés kb. 70-100g = +8400 - 12000 Ft
              anyagár, balayage, melírok, kb. 30 - 50g szőkitő por + 30 - 40g
              árnyaló festék = 6600 - 7800 Ft.)
            </p>

            <p>
              <span className="text-red-400">
                Extra sok, vagy extra hosszú haj esetén +10 % felárat számolunk
                fel!
              </span>{" "}
              Csak magánszemélyeknek állítunk ki számlát!{" "}
            </p>
          </div>
        </BackgroundBlur>
      </section>
    </Transition>
  );
};

export default PricinggPage;
