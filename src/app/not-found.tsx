import Image from 'next/image'
import Link from 'next/link'

import BackgroundBlur from '@/components/BackgroundBlur'
import {
  BOOKING_ROUTE,
  HOME_ROUTE,
  OUR_WORKS_ROUTE,
  PRICES_ROUTE,
} from '@/constants/routes.constants'

export default function NotFound() {
  return (
    <div className="relative grid h-screen w-full place-items-center text-white">
      <BackgroundBlur className="flex flex-col items-center justify-center">
        <h2 className="mb-4 text-3xl">Hoppá</h2>
        <p className="mb-8">404 - Az oldal nem található</p>
        <p className="mb-4 text-xl">Elérhető oldalaink:</p>

        <div className="grid grid-cols-2 gap-4">
          <Link
            className="text-xl font-medium underline underline-offset-2 transition-colors hover:text-emerald-700"
            href={HOME_ROUTE}
          >
            Főoldal
          </Link>
          <Link
            className="text-xl font-medium underline underline-offset-2 transition-colors hover:text-emerald-700"
            href={BOOKING_ROUTE}
          >
            Időpontfoglalás
          </Link>
          <Link
            className="text-xl font-medium underline underline-offset-2 transition-colors hover:text-emerald-700"
            href={PRICES_ROUTE}
          >
            Árlista
          </Link>
          <Link
            className="text-xl font-medium underline underline-offset-2 transition-colors hover:text-emerald-700"
            href={OUR_WORKS_ROUTE}
          >
            Munkáink
          </Link>
        </div>
      </BackgroundBlur>

      <Image
        alt="Botanic Beauty Hajszalon növény"
        src="/not-found-bg.png"
        width={480}
        height={660}
        className="absolute bottom-0 right-0 -z-10 object-cover"
      />
    </div>
  )
}
