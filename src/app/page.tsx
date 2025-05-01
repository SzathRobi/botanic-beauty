import { Metadata } from 'next'

import About from '@/components/About'
import Contact from '@/components/Contact'
import ExtraServices from '@/components/ExtraServices'
import Footer from '@/components/Footer'
import Hairdressers from '@/components/Hairdressers'
import Landing from '@/components/landing/Landing'
import OurWorks from '@/components/OurWorks'
import Transition from '@/components/Transition'

export const metadata: Metadata = {
  title: 'Botanic Beauty Hajszalon | Fenntartható Szépségápolás Újpesten',
  description:
    'Fedezd fel a Botanic Beauty Hajszalont, ahol fenntartható és vegán termékekkel varázsolom újjá a frizurád. Kényelmes, zöld környezetben, minőségi és megfizethető szolgáltatásokkal várlak.',
  keywords: [
    'Fodrászat Budapest',
    'Fodrászat Újpest',
    'Fodrász Budapest',
    'Fodrász Újpest',
    'Hajszalon Budapest',
    'Hajszalon Újpest',
    'Női fodrász Budapest',
    'Női fodrász Újpest',
    'Női fodrászat Budapest',
    'Női fodrászat Újpest',
    'Női hajszalon Budapest',
    'Női hajszalon Újpest',
    'Férfi fodrász',
    'Férfi fodrász Budapest',
    'Férfi fodrász Újpest',
    'Férfi fodrászat',
    'Férfi fodrászat Budapest',
    'Férfi fodrászar Újpest',
    'Férfi hajszalon Budapest',
    'Férfi hajszalon Újpest',
    'Hajfestés Budapest',
    'Hajfestés Újpest',
    'Színes hajfestés Budapest',
    'Színes hajfestés Újpest',
    'Vegán fodrászat',
    'Vegán fodrászat Budapest',
    'Vegán fodrászat Újpest',
    'Vegán hajszalon Budapest',
    'Vegán hajszalon Újpest',
    'Vegán hajfestés Budapest',
    'Vegán hajfestés Újpest',
    'Környezetbarát fodrászat Budapest',
    'Környezetbarát fodrászat Újpest',
    'Környezetbarát hajszalon Budapest',
    'Környezetbarát hajszalon Újpest',
    'Állatbarát fodrászat Budapest',
    'Állatbarát fodrászat Újpest',
    'Állatbarát hajszalon',
    'Állatbarát hajszalon Budapest',
    'Állatbarát hajszalon Újpest',
    'Fenntartható szépségápolás Budapest',
    'Fenntartható szépségápolás Újpest',
    'Vegán hajápolás Budapest',
    'Vegán hajápolás Újpest',
    'Hajápolás és tanácsadás Budapest',
    'Hajápolás és tanácsadás Újpest',
    'Hajfestés és hajápolás Budapest',
    'Hajfestés és hajápolás Újpest',
    'Fenntartható hajápolás',
    'Környezetbarát hajfestés',
    'Hajápolás és tanácsadás',
    'Minőségi hajápolás Újpesten',
    'Zöld szépségápolás',
    'Hajformázás Újpest',
  ],
  openGraph: {
    url: 'https://www.botanic-beauty.hu',
    type: 'website',
    title: 'Botanic Beauty Hajszalon - Fenntartható Szépségápolás Újpesten',
    description:
      'Látogass el a Botanic Beauty Hajszalonba, ahol a fenntarthatóság és a minőség találkozik. Frizurád megalkotásához vegán, állatkísérlet-mentes termékeket használok.',
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

export default async function Home() {
  // const bookings = await prisma.booking.findMany()

  // const newBookings: Booking[] = bookings.map((booking): Booking => {
  //   if (
  //     booking.extraService ||
  //     (!booking.extraService && !booking.extraServices)
  //   ) {
  //     return {
  //       contactInfo: booking.contactInfo,
  //       createdAt: booking.createdAt,
  //       extraServices: [],
  //       hairdresser: booking.hairdresser,
  //       id: booking.id,
  //       selectedDate: booking.selectedDate,
  //       selectedTimeSlot: booking.selectedTimeSlot,
  //       service: booking.service,
  //       updatedAt: booking.updatedAt,
  //     }
  //   }

  //   return booking
  // })

  // await prisma.booking.deleteMany()
  // await prisma.booking.createMany({
  //   data: newBookings,
  // })

  // console.log('NEW Bookings', newBookings)
  // console.log('NEW Bookings length', newBookings.length)

  // for (const booking of bookings) {
  //   // Ha extraService létezik és nem tömb
  //   //@ts-ignore
  //   if (booking.extraService && !Array.isArray(booking.extraService)) {
  //     await prisma.booking.update({
  //       where: { id: booking.id },
  //       data: {
  //         //@ts-ignore
  //         extraService: [booking.extraService], // egy elemű listává alakítjuk
  //       },
  //     })
  //     console.log(`Booking ${booking.id} updated`)
  //   }
  // }

  return (
    <Transition>
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-x-hidden">
        <Landing />
        <ExtraServices />
        <About />
        <Hairdressers />
        <Contact />
        <OurWorks />
      </main>

      <Footer />
    </Transition>
  )
}
