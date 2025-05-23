import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { auth } from '@/auth'
import {
  BOOKING_ROUTE,
  HOME_ROUTE,
  OUR_WORKS_ROUTE,
  PRICES_ROUTE,
  SERVICES_ROUTE,
} from '@/constants/routes.constants'

import HamburgerMenu from './HamburgerMenu'

const Header = async () => {
  const session = await auth()
  const isBookingAvailable = process.env.IS_BOOKING_AVAILABLE === 'true'

  return (
    <header className="fixed top-0 z-50 flex w-full items-center justify-between bg-black/70 p-4 text-white backdrop-blur-md md:px-16">
      <Link href={HOME_ROUTE}>
        <Image
          src="/logo.svg"
          priority={true}
          alt="Botanic Beauty Hajszalon logo"
          width={170}
          height={48}
          className="h-auto w-auto"
        />
      </Link>

      <HamburgerMenu user={session?.user} />

      <nav className="hidden md:block">
        <ul className="flex items-center gap-8">
          <li className="shadow transition hover:text-emerald-700">
            <Link href={HOME_ROUTE}>Főoldal</Link>
          </li>

          {isBookingAvailable && (
            <li className="shadow transition hover:text-emerald-700">
              <Link href={BOOKING_ROUTE}>Időpontfoglalás</Link>
            </li>
          )}

          <li className="shadow transition hover:text-emerald-700">
            <Link href={PRICES_ROUTE}>Árlista</Link>
          </li>

          <li className="shadow transition hover:text-emerald-700">
            <Link href={SERVICES_ROUTE}>Szolgáltatásaink</Link>
          </li>

          <li className="shadow transition hover:text-emerald-700">
            <Link href={OUR_WORKS_ROUTE}>Munkáink</Link>
          </li>

          {session?.user && (
            <li className="shadow transition hover:text-emerald-700">
              <Link href="/admin">Admin</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Header
