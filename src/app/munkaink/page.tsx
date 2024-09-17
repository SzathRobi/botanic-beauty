import BackgroundBlur from "@/components/BackgroundBlur";
import FadeInView from "@/components/FadeInView";
import Transition from "@/components/Transition";
import cloudinary from "cloudinary";
import { Metadata } from "next";
import Image from "next/image";

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  // secure: true,
});

export const metadata: Metadata = {
  title: "Botanic Beauty Hajszalon | Munkáink",
  description:
    "Tekintsd meg a Botanic Beauty szalon korábbi munkáit! Inspirálódj kreatív hajfestéseinkből és hajvágásainkból, mind vegán és környezetbarát termékekkel.",
  keywords: [
    "fodrász munkák Budapest",
    "fodrász munkák Újpest",
    "hajvágás galéria Budapest",
    "hajvágás galéria Újpest",
    "hajfestés galéria Budapest",
    "hajfestés galéria Újpest",
    "vegán hajfestés képek",
    "fenntartható hajápolás galéria",
    "állatbarát fodrász munkák",
  ],
  openGraph: {
    url: "https://botanic-beauty.hu/munkaink",
    type: "website",
    title: "Botanic Beauty Hajszalon | Munkáink",
    description:
      "Tekintsd meg a Botanic Beauty szalon korábbi munkáit! Inspirálódj kreatív hajfestéseinkből és hajvágásainkból, mind vegán és környezetbarát termékekkel.",
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

const OurWorksPage = async () => {
  const { resources } = await cloudinary.v2.api.resources({
    type: "upload",
    max_results: 200,
    direction: "desc",
  });

  // TODO / low: add infinite scroll pagination
  return (
    <Transition>
      <section className="px-2 sm:px-0 pt-24">
        <BackgroundBlur className="!max-w-6xl mx-auto grid place-items-center">
          <div className="columns-1 md:columns-2 lg:md:columns-3 gap-8">
            {resources.length &&
              resources.map((image: any, index: number) => (
                <FadeInView key={image.public_id}>
                  <Image
                    alt={`Botanic Beauty szalonban készult haj ${index}`}
                    src={image.url}
                    width={320}
                    height={424}
                    className="object-cover mb-6 rounded-xl"
                  />
                </FadeInView>
              ))}
          </div>
        </BackgroundBlur>
      </section>
    </Transition>
  );
};

export default OurWorksPage;
