'use client' // Error components must be Client Components

import Link from 'next/link'

import BackgroundBlur from '@/components/BackgroundBlur'

export default function Error() {
  return (
    <div className="grid h-screen w-full place-items-center">
      <BackgroundBlur className="flex flex-col items-center justify-center gap-8">
        <h2 className="text-xl">
          Hoppá, valami hiba történt az online foglalóval. Kérlek próbáld meg
          később.
        </h2>

        <Link href="/">Vissza a főoldalra</Link>
      </BackgroundBlur>
    </div>
  )
}
