import 'react-day-picker/dist/style.css'

import { Metadata } from 'next'
import Image from 'next/image'

import { getBookings } from '@/actions/booking'
import { getSchedule } from '@/actions/schedule'
import Footer from '@/components/Footer'

import MultiStepForm from './components/MultiStepForm'

export const metadata: Metadata = {
  title: 'Botanic Beauty Hajszalon | Időpontfoglalás',
  description:
    'Foglalj időpontot a Botanic Beauty szalonba online! Gyors és kényelmes időpontfoglalási rendszerünk segítségével egyszerűen választhatsz időpontot.',
  keywords: [
    'fodrászat időpontfoglalás Budapest',
    'fodrászat időpontfoglalás Újpest',
    'hajvágás időpont Budapest',
    'hajvágás időpont Újpest',
    'hajfestés időpontfoglalás',
    'vegán fodrász időpontfoglalás',
    'fenntartható hajápolás időpontfoglalás',
    'állatbarát fodrászat időpont',
  ],
  openGraph: {
    url: 'https://botanic-beauty.hu/idopontfoglalas',
    type: 'website',
    title: 'Botanic Beauty Hajszalon | Időpontfoglalás',
    description:
      'Foglalj időpontot a Botanic Beauty szalonba online! Gyors és kényelmes időpontfoglalási rendszerünk segítségével egyszerűen választhatsz időpontot.',
    images: [
      {
        url: 'https://botanic-beauty.hu/logo-google-square.png',
        width: 1200,
        height: 1200,
        alt: 'Botanic Beauty Logo',
      },
      {
        url: 'https://botanic-beauty.hu/logo-google-wide.png',
        width: 1200,
        height: 630,
        alt: 'Botanic Beauty Logo',
      },
    ],
  },
}

const BookingPage = async () => {
  const schedule = await getSchedule()

  const bookings = await getBookings()

  return (
    <>
      <section className="mb-0! flex min-h-screen flex-col items-center justify-start overflow-hidden px-2 pt-24 sm:px-0">
        <Image
          alt="Botanic Beauty Hajszalon növény"
          src="/leaves-vertical.png"
          width={508}
          height={1080}
          className="absolute left-0 top-0 -z-10 rotate-[25deg] object-cover"
        />

        <MultiStepForm schedule={schedule} bookings={bookings || []} />
      </section>

      <Footer />
    </>
  )
}

export default BookingPage
