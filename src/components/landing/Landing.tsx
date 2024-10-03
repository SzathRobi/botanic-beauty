import Image from 'next/image'
import Link from 'next/link'

import { BOOKING_ROUTE } from '@/constants/routes.constants'

import BackgroundBlur from '../BackgroundBlur'
import { LanidngWeaveSvg } from './LandingWaveSvg'
import ShinyButton from './ShinyButton'

const Landing = async () => {
  return (
    <section className="h-screen">
      <div>
        <Image
          alt="Botanic Beauty Hajszalon"
          src="/landing-bg.jpg"
          // width={1920}
          // height={1080}
          fill
          quality={'100'}
          priority={true}
          className="absolute -z-10 object-cover md:-top-24"
        />

        <LanidngWeaveSvg />
      </div>
      <div className="flex h-full w-full flex-col items-center justify-center px-2 sm:px-0">
        <BackgroundBlur className="mb-24 mt-16 flex flex-col items-center justify-center gap-4 bg-black/50">
          <h1 className="mb-2 text-center text-xl md:text-2xl 2xl:text-3xl">
            Lépj be a fenntartható és személyre szabott hajápolás világába a
            Botanic Beauty hajszalonnál!
          </h1>

          <h2 className="text-md mb-12 text-center opacity-75 md:text-xl">
            A természet és az egyéniséged ihlette hajszalon Újpesten.
          </h2>

          <Link href={BOOKING_ROUTE}>
            <ShinyButton>Foglalj időpontot</ShinyButton>
          </Link>
        </BackgroundBlur>
      </div>
    </section>
  )
}

export default Landing
