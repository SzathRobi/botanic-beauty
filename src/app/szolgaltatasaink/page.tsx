import { Metadata } from 'next'
import Image from 'next/image'

import BackgroundBlur from '@/components/BackgroundBlur'
import Footer from '@/components/Footer'
import Transition from '@/components/Transition'

import ServiceCard from './components/serviceCard/ServiceCard'
import { SERVICES } from './constants/services.constants'

export const metadata: Metadata = {
  title: 'Botanic Beauty Hajszalon | Szolgáltatásaink',
  description:
    'Fedezd fel szolgáltatásainkat, melyekhez vegán és környezetbarát termékeket használunk!',
  keywords: [
    'hajvágás',
    'női hajvágás',
    'férfi hajvágás',
    'hajfestés',
    'ombre',
    'ombre haj',
    'ombre hajfestés',
    'balayage',
    'balayage hajfestés',
    'hajápolás',
    'Keratinos hajkezelés',
    'Keratinos hajegyenesítés',
    'Keratinos hajkiegyenesítés',
    'Szőkítés',
    'hajegyenesítés',
    'hajgöndörítés',
    'frufru vágás',
    'melírozás',
    'babylights',
    'színkorrekció',
  ],
  openGraph: {
    url: 'https://www.botanic-beauty.hu/szolgaltatasaink',
    type: 'website',
    title: 'Botanic Beauty Hajszalon | Szolgáltatásaink',
    description:
      'Fedezd fel szolgáltatásainkat, melyekhez vegán és környezetbarát termékeket használunk!',
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

const ServicesPage = async () => {
  return (
    <Transition>
      <section className="dark relative flex min-h-screen flex-col items-center justify-center overflow-x-hidden px-2 pt-24 sm:px-0">
        <Image
          alt="Botanic Beauty Hajszalon növény"
          src="/leaves-vertical.png"
          width={508}
          height={1080}
          className="absolute left-0 top-0 -z-10 rotate-[25deg] object-cover"
        />

        <BackgroundBlur className="py-16">
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-3xl font-bold">Szolgáltatásaink</h1>
            <h2 className="text-lg">
              Fedezd fel szolgáltatásainkat, melyekhez vegán és környezetbarát
              termékeket használunk!
            </h2>
          </div>

          <div>
            {SERVICES.map((service, index) => (
              <ServiceCard key={service.name} service={service} index={index} />
            ))}
          </div>
        </BackgroundBlur>

        <Image
          alt="Botanic Beauty Hajszalon növény"
          src="/not-found-bg.png"
          width={480}
          height={660}
          className="absolute bottom-1/4 right-0 -z-10 object-cover opacity-75"
        />
      </section>

      <Footer />
    </Transition>
  )
}

export default ServicesPage
