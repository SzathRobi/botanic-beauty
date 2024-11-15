'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { IoMenu } from 'react-icons/io5'

import {
  BOOKING_ROUTE,
  HOME_ROUTE,
  OUR_WORKS_ROUTE,
  PRICES_ROUTE,
  SERVICES_ROUTE,
} from '@/constants/routes.constants'

type HamburgerMenuProps = {
  user: any
}

const HamburgerMenu = ({ user }: HamburgerMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="block md:hidden">
      <button
        aria-label="Toggle Menu"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <IoMenu size={24} />
      </button>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ ease: 'easeInOut', duration: 0.75 }}
            exit={{ opacity: 0 }}
            className="absolute right-0 top-0 flex h-svh w-full bg-black/70 backdrop-blur-md"
            onClick={() => setIsMenuOpen(false)}
          >
            {/* <div className="flex-1" onClick={() => setIsMenuOpen(false)} /> */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ ease: 'easeInOut', duration: 0.75 }}
              exit={{ opacity: 0, x: 32 }}
              className="absolute right-0 top-0 h-full"
            >
              <X size={24} className="my-4 ml-auto mr-8" />

              <ul className="flex h-full flex-col items-end gap-6 bg-gradient-to-b from-black/80 to-black/60 px-8 py-4">
                <li className="shadow transition hover:text-emerald-700">
                  <Link href={HOME_ROUTE}>Főoldal</Link>
                </li>

                <li className="shadow transition hover:text-emerald-700">
                  <Link href={BOOKING_ROUTE}>Időpontfoglalás</Link>
                </li>

                <li className="shadow transition hover:text-emerald-700">
                  <Link href={PRICES_ROUTE}>Árlista</Link>
                </li>

                <li className="shadow transition hover:text-emerald-700">
                  <Link href={SERVICES_ROUTE}>Szolgáltatásaink</Link>
                </li>

                <li className="shadow transition hover:text-emerald-700">
                  <Link href={OUR_WORKS_ROUTE}>Munkáink</Link>
                </li>

                {user && (
                  <li className="shadow transition hover:text-emerald-700">
                    <Link href="/admin">Admin</Link>
                  </li>
                )}
              </ul>
            </motion.div>
            <div className="h-full" onClick={() => setIsMenuOpen(false)}></div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  )
}

export default HamburgerMenu
