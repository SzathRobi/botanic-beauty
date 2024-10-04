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
      <p className="px-0 text-center text-neutral-200">{description}</p>
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
          <div className="grid grid-cols-1 gap-x-4 gap-y-24 md:grid-cols-2 lg:grid-cols-3">
            <FadeInView delay={0}>
              <ServiceCard
                description="Gyors és egyszerű foglalás a Botanic Beauty hajszalonban, akár pár perc alatt. Élvezd a zökkenőmentes online időpontfoglalást!"
                icon={<CalendarCheck size={64} />}
                title="Könnyű bejelentkezés"
              />
            </FadeInView>

            <FadeInView delay={0.2}>
              <ServiceCard
                description="A hajápolás fenntarthatóságáért: kizárólag vegán, természetes összetevőkből készült fodrászati termékeket használok, hogy a hajad a legjobbat kapja."
                icon={<Vegan size={64} />}
                title="Vegán termékek"
              />
            </FadeInView>

            <FadeInView delay={0.4}>
              <ServiceCard
                description="Szeretettel várom a kedvenceidet is! Állatbarát hajszalonomba bátran hozd magaddal a kiskedvenced."
                icon={<PawPrint size={64} />}
                title="Állatbarát hely"
              />
            </FadeInView>

            <FadeInView delay={0}>
              <ServiceCard
                description="Minden vendégemre egyedileg figyelek, hogy biztosan elégedett légy a végeredménnyel!"
                icon={<Gem size={64} />}
                title="Kiemelt figyelem"
              />
            </FadeInView>

            <FadeInView delay={0.2}>
              <ServiceCard
                description="Egyszerű és gyors kártyás fizetés a Botanic Beauty hajszalonban. Élvezd a kényelmet, és válassz a különböző fizetési lehetőségekből!"
                icon={<FaRegCreditCard size={64} />}
                title="Kártyás fizetés"
              />
            </FadeInView>

            <FadeInView delay={0.4}>
              <ServiceCard
                description="Újpesti hajszalonom környékén mindenhol díjmentes parkolás áll rendelkezésre, így kényelmesen érkezhetsz hozzám!"
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
