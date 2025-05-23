import cloudinary from 'cloudinary'
import { Metadata } from 'next'
import Image from 'next/image'

import BackgroundBlur from '@/components/BackgroundBlur'
import FadeInView from '@/components/FadeInView'
import Footer from '@/components/Footer'
import Transition from '@/components/Transition'

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  // secure: true,
})

export const metadata: Metadata = {
  title: 'Botanic Beauty Hajszalon | Munkáink',
  description:
    'Tekintsd meg a Botanic Beauty szalon korábbi munkáit! Inspirálódj kreatív hajfestéseinkből és hajvágásainkból, mind vegán és környezetbarát termékekkel.',
  keywords: [
    'fodrász munkák Budapest',
    'fodrász munkák Újpest',
    'hajvágás galéria Budapest',
    'hajvágás galéria Újpest',
    'hajfestés galéria Budapest',
    'hajfestés galéria Újpest',
    'vegán hajfestés képek',
    'fenntartható hajápolás galéria',
    'állatbarát fodrász munkák',
  ],
  openGraph: {
    url: 'https://www.botanic-beauty.hu/munkaink',
    type: 'website',
    title: 'Botanic Beauty Hajszalon | Munkáink',
    description:
      'Tekintsd meg a Botanic Beauty szalon korábbi munkáit! Inspirálódj kreatív hajfestéseinkből és hajvágásainkból, mind vegán és környezetbarát termékekkel.',
    images: [
      {
        url: 'https://www.botanic-beauty.hu/logo-google-square.png',
        width: 1200,
        height: 1200,
        alt: 'Botanic Beauty Logo',
      },
      {
        url: 'https://www.botanic-beauty.hu/logo-google-wide.png',
        width: 1200,
        height: 630,
        alt: 'Botanic Beauty Logo',
      },
    ],
  },
}

const OurWorksPage = async () => {
  const { resources } = await cloudinary.v2.api.resources({
    type: 'upload',
    max_results: 200,
    direction: 'desc',
  })

  // TODO / low: add infinite scroll pagination
  return (
    <Transition>
      <section className="overflow-hidden px-2 pt-24 sm:px-0">
        <Image
          alt="Botanic Beauty Hajszalon növény"
          src="/leaves-vertical.png"
          width={508}
          height={1080}
          className="absolute left-0 top-0 -z-10 rotate-[25deg] object-cover"
        />

        <BackgroundBlur className="mx-auto grid !max-w-6xl place-items-center">
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-3xl font-bold">Munkáink</h1>
            <h2 className="text-lg">
              Fedezd fel a Botanic Beauty Hajszalon legszebb munkáit, ahol
              kreatív hajfestéseink és vágásaink segítségével megvalósítjuk az
              álmaid frizuráját!
            </h2>
          </div>

          <div className="columns-1 gap-8 md:columns-2 lg:md:columns-3">
            {resources.length &&
              resources.map((image: any, index: number) => (
                <FadeInView key={image.public_id}>
                  <Image
                    alt={`Botanic Beauty Hajszalon -  ${index}`}
                    src={image.url}
                    width={320}
                    height={424}
                    className="mb-6 rounded-xl object-cover"
                  />
                </FadeInView>
              ))}
          </div>
        </BackgroundBlur>
      </section>

      <Footer />
    </Transition>
  )
}

export default OurWorksPage
