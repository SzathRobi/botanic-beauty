import { Metadata } from 'next'

import About from '@/components/About'
import Contact from '@/components/Contact'
import ExtraServices from '@/components/ExtraServices'
import Footer from '@/components/Footer'
import Landing from '@/components/landing/Landing'
import OurWorks from '@/components/OurWorks'
import Transition from '@/components/Transition'

export const metadata: Metadata = {
  title: 'Botanic Beauty Hajszalon',
  description:
    'Újpesti hajszalon, ahol fenntarthatóság és minőség találkozik. Vegán, állatkísérlet-mentes termékekkel dolgozom, hogy elképzeléseid megvalósuljanak környezetbarát módon.',
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
    'Férfi fodrász Budapest',
    'Férfi fodrász Újpest',
    'Férfi fodrászat Budapest',
    'Férfi fodrászar Újpest',
    'Férfi hajszalon Budapest',
    'Férfi hajszalon Újpest',
    'Hajfestés Budapest',
    'Hajfestés Újpest',
    'Színes hajfestés Budapest',
    'Színes hajfestés Újpest',
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
  ],
  openGraph: {
    url: 'https://botanic-beauty.hu',
    type: 'website',
    title: 'Botanic Beauty Hajszalon',
    description:
      'botanic-beauty.hu -  A szalon koncepcióját, fenntarthatóság iránti elkötelezettséggel hoztam létre , ezért vegán, állatkísérlet mentes termékekkel dolgozom. Ebben a szalonban minden a te elképzelésedről és a minőségi, de megfizethető és környezetbarát anyagok használatáról szól.',
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

export default async function Home() {
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

      <Footer />
    </Transition>
  )
}
