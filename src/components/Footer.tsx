import Link from 'next/link'
import React from 'react'

import {
  BOOKING_ROUTE,
  HOME_ROUTE,
  OUR_WORKS_ROUTE,
  PRICES_ROUTE,
  PRIVACY_POLICY_ROUTE,
  TERMS_OF_USE_ROUTE,
} from '@/constants/routes.constants'

const Footer = () => {
  return (
    <footer className="w-full bg-black/70 p-4 text-white backdrop-blur-md md:px-16">
      <nav className="flex flex-col gap-8 md:flex-row">
        <ul className="flex flex-col items-start gap-2 text-xs">
          <li className="shadow transition hover:text-green-700">
            <Link href={HOME_ROUTE}>Főoldal</Link>
          </li>
          <li className="shadow transition hover:text-green-700">
            <Link href={PRICES_ROUTE}>Árlista</Link>
          </li>
          <li className="shadow transition hover:text-green-700">
            <Link href={OUR_WORKS_ROUTE}>Munkáink</Link>
          </li>
        </ul>

        <ul className="flex flex-col items-start gap-2 text-xs">
          <li className="shadow transition hover:text-green-700">
            <Link href={BOOKING_ROUTE}>Időpontfoglalás</Link>
          </li>
        </ul>

        <ul className="flex flex-col items-start gap-2 text-xs">
          <li className="shadow transition hover:text-green-700">
            <Link href={PRIVACY_POLICY_ROUTE}>Adatvédelmi nyilatkozat</Link>
          </li>
          <li className="shadow transition hover:text-green-700">
            <Link href={TERMS_OF_USE_ROUTE}>Felhasználási feltételek</Link>
          </li>
        </ul>
      </nav>
    </footer>
  )
}

export default Footer
