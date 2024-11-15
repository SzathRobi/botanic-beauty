import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import {
  BOOKING_ROUTE,
  HOME_ROUTE,
  OUR_WORKS_ROUTE,
  PRICES_ROUTE,
  PRIVACY_POLICY_ROUTE,
  SERVICES_ROUTE,
  TERMS_OF_USE_ROUTE,
} from '@/constants/routes.constants'

import ShinyButton from './landing/ShinyButton'

const Footer = () => {
  return (
    <footer className="w-full rounded-t-3xl bg-black/70 px-4 py-16 text-white backdrop-blur-md md:px-16 md:py-24">
      <div className="relative z-10">
        <div className="max-w-max">
          <Image
            src="/logo-only-head.svg"
            width={104}
            height={120}
            alt="Botanic Beauty Hajszalon logo"
            className="mb-6"
          />

          <p className="mb-4 text-lg">© 2024 Botanic Beauty Hajszalon</p>

          <p className="mb-16">1045, Budapest, Széchenyi tér 4/a (Újpest)</p>

          <Link href={BOOKING_ROUTE}>
            <ShinyButton className="mb-16 w-full">
              Foglalj időpontot
            </ShinyButton>
          </Link>
        </div>

        <nav>
          <ul>
            <li className="mb-4">
              <Link href={HOME_ROUTE}>Főoldal</Link>
            </li>

            <li className="mb-4">
              <Link href={BOOKING_ROUTE}>Időpontfoglalás</Link>
            </li>

            <li className="mb-4">
              <Link href={PRICES_ROUTE}>Árlista</Link>
            </li>

            <li className="mb-4">
              <Link href={SERVICES_ROUTE}>Szolgáltatásaink</Link>
            </li>

            <li className="mb-8">
              <Link href={OUR_WORKS_ROUTE}>Munkáink</Link>
            </li>

            <li className="mb-4">
              <Link href={PRIVACY_POLICY_ROUTE}>Adatkezelési nyilatkozat</Link>
            </li>
            <li>
              <Link href={TERMS_OF_USE_ROUTE}>Felhasználási feltételek</Link>
            </li>
          </ul>
        </nav>
      </div>

      <Image
        src="/footer-bg.png"
        alt="Botanic Beauty Hajszalon növény"
        width={800}
        height={700}
        className="absolute bottom-0 right-16 hidden opacity-80 lg:block"
      />
    </footer>
  )
}

export default Footer
