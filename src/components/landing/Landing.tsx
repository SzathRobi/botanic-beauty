import Image from 'next/image'
import Link from 'next/link'

import { BOOKING_ROUTE } from '@/constants/routes.constants'

import landingBg from '../../../public/landing-bg.png'
import BackgroundBlur from '../BackgroundBlur'
import { LanidngWeaveSvg } from './LandingWaveSvg'
import ShinyButton from './ShinyButton'

const Landing = async () => {
  const isBookingAvailable = process.env.IS_BOOKING_AVAILABLE === 'true'

  return (
    <section className="relative h-screen">
      <div>
        <Image
          alt="Botanic Beauty Hajszalon belső tere, Újpest, 4. kerület"
          src={landingBg}
          priority={true}
          fill
          quality={100}
          sizes="100vw"
          placeholder="blur"
          className="absolute -z-10 object-cover"
        />

        <LanidngWeaveSvg />
      </div>
      <div className="flex h-full w-full flex-col items-center justify-center px-2 sm:px-0">
        <BackgroundBlur className="mb-24 mt-16 flex flex-col items-center justify-center gap-4 bg-black/60">
          <h1 className="-mb-2 text-center text-xl md:text-2xl 2xl:text-4xl">
            Tökéletes haj, fenntartható alapanyagokkal.
          </h1>

          <h2 className="mb-3 text-center text-xl md:text-2xl 2xl:text-4xl">
            Lépj ki tőlünk gyönyörű hajjal és új önbizalommal!
          </h2>

          <h3 className="text-md mb-12 text-center opacity-75 md:text-xl 2xl:text-2xl">
            A természet és az egyéniséged ihlette hajszalon, Újpesten.
          </h3>

          {isBookingAvailable && (
            <Link href={BOOKING_ROUTE}>
              <ShinyButton className="2xl:text-xl">
                Foglalj időpontot
              </ShinyButton>
            </Link>
          )}
        </BackgroundBlur>
      </div>
    </section>
  )
}

export default Landing
