import Image from 'next/image'
import Link from 'next/link'
import { FaLongArrowAltRight } from 'react-icons/fa'

import { OUR_WORKS_ROUTE } from '@/constants/routes.constants'

import BackgroundBlur from './BackgroundBlur'
import FadeInView from './FadeInView'
import Title from './Title'

const OurWorks = () => {
  return (
    <section className="relative">
      <Image
        alt="Botanic Beauty Hajszalon növény"
        src="/contact-plant.png"
        width={628}
        height={770}
        className="absolute -left-12 bottom-full -z-10 translate-y-3/4 -rotate-[25deg] transform object-cover sm:left-0"
      />

      <FadeInView>
        <Title title="Munkáink" />

        <div className="px-2 sm:px-0">
          <BackgroundBlur className="mx-auto pb-16">
            <div className="mb-8 grid grid-cols-1 place-items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Image
                width={300}
                height={424}
                alt="Botanic Beauty szalonban készult haj 1"
                src="/our-works-1.png"
                className="max-h-[354px] rounded object-cover"
              />
              <Image
                width={300}
                height={424}
                alt="Botanic Beauty szalonban készult haj 2"
                src="/our-works-2.png"
                className="max-h-[354px] rounded object-cover"
              />
              <Image
                width={300}
                height={424}
                alt="Botanic Beauty szalonban készult haj 3"
                src="/our-works-3.png"
                className="max-h-[354px] rounded object-cover"
              />
              <Image
                width={300}
                height={424}
                alt="Botanic Beauty szalonban készult haj 4"
                src="/our-works-4.png"
                className="max-h-[354px] rounded object-cover"
              />
              <Image
                width={300}
                height={424}
                alt="Botanic Beauty szalonban készult haj 5"
                src="/our-works-5.png"
                className="max-h-[354px] rounded object-cover"
              />
              <Image
                width={300}
                height={424}
                alt="Botanic Beauty szalonban készult haj 6"
                src="/our-works-6.png"
                className="max-h-[354px] rounded object-cover"
              />
              <Image
                width={300}
                height={424}
                alt="Botanic Beauty szalonban készult haj 7"
                src="/our-works-7.png"
                className="max-h-[354px] rounded object-cover"
              />
              <Image
                width={300}
                height={424}
                alt="Botanic Beauty szalonban készult haj 8"
                src="/our-works-8.png"
                className="max-h-[354px] rounded object-cover"
              />
              <Image
                width={300}
                height={424}
                alt="Botanic Beauty szalonban készult haj 9"
                src="/our-works-9.png"
                className="max-h-[354px] rounded object-cover"
              />
            </div>
            <Link
              href={OUR_WORKS_ROUTE}
              className="float-right mb-4 flex items-center justify-start gap-2 text-lg"
            >
              <span>Még több</span>
              <FaLongArrowAltRight />
            </Link>
          </BackgroundBlur>
        </div>
      </FadeInView>
    </section>
  )
}

export default OurWorks
