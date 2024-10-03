import {
  CalendarCheck,
  Gem,
  PawPrint,
  SquareParking,
  Vegan,
} from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { FaRegCreditCard } from 'react-icons/fa'

import BackgroundBlur from './BackgroundBlur'
import FadeInView from './FadeInView'

type ServiceCardProps = {
  icon: any
  title: string
  description: string
}

const ServiceCard = ({ icon, title, description }: ServiceCardProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="text-emerald-600">{icon}</div>
      <h4 className="min-w-max text-lg font-medium">{title}</h4>
      <p className="px-8 text-center text-neutral-200 sm:px-0">{description}</p>
    </div>
  )
}

const ExtraServices = () => {
  return (
    <section className="relative mb-80 grid min-h-fit place-items-center px-2 sm:px-0">
      <Image
        alt="Botanic Beauty Hajszalon növény"
        src="/leaves-vertical.png"
        width={508}
        height={1080}
        className="absolute right-0 top-3/4 -z-10 rotate-[25deg] object-cover sm:right-1/4 md:top-1/2"
      />

      <FadeInView>
        <BackgroundBlur className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-y-24 md:grid-cols-3">
            <FadeInView delay={0}>
              <ServiceCard
                description="Gyors és könnyű foglalás a szalonba, akár pár perc alatt."
                icon={<CalendarCheck size={64} />}
                title="Könnyű bejelentkezés"
              />
            </FadeInView>

            <FadeInView delay={0.2}>
              <ServiceCard
                description="Fodrász termékeim kivétel nélkül vegánok"
                icon={<Vegan size={64} />}
                title="Vegán termékek"
              />
            </FadeInView>

            <FadeInView delay={0.4}>
              <ServiceCard
                description="Hozd magaddal a szalonomba a kiskedvenced is."
                icon={<PawPrint size={64} />}
                title="Állatbarát hely"
              />
            </FadeInView>

            <FadeInView delay={0}>
              <ServiceCard
                description="Legfőbb célom, hogy elégedett legyél a hajaddal."
                icon={<Gem size={64} />}
                title="Kiemelt figyelem"
              />
            </FadeInView>

            <FadeInView delay={0.2}>
              <ServiceCard
                description="Fizess kártyával gyorsan és egyszerűen"
                icon={<FaRegCreditCard size={64} />}
                title="Kártyás fizetés"
              />
            </FadeInView>

            <FadeInView delay={0.4}>
              <ServiceCard
                description="Újpesti Hajszalonunk környékén mindenhol díjmentes"
                icon={<SquareParking size={64} />}
                title="Ingyenes parkolás"
              />
            </FadeInView>
          </div>
        </BackgroundBlur>
      </FadeInView>
    </section>
  )
}

export default ExtraServices
