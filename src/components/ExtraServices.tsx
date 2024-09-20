import { CalendarCheck, Gem, PawPrint, Vegan } from 'lucide-react'
import React from 'react'

import BackgroundBlur from './BackgroundBlur'
import FadeInView from './FadeInView'

type ServiceCardProps = {
  icon: any
  title: string
}

const ServiceCard = ({ icon, title }: ServiceCardProps) => {
  return (
    <div className="flex min-w-max flex-col items-center justify-center gap-4">
      <div>{icon}</div>
      <h3 className="min-w-max">{title}</h3>
    </div>
  )
}

const ExtraServices = () => {
  return (
    <section className="mb-40 grid min-h-fit place-items-center px-2 sm:px-0">
      <FadeInView>
        <BackgroundBlur className="mx-auto min-w-[300px] space-y-24">
          <div className="flex flex-col justify-between gap-10 md:flex-row lg:gap-28">
            <FadeInView delay={0}>
              <ServiceCard
                icon={<CalendarCheck size={64} />}
                title="Könnyű bejelentkezés"
              />
            </FadeInView>

            <FadeInView delay={0.2}>
              <ServiceCard icon={<Vegan size={64} />} title="Vegán termékek" />
            </FadeInView>

            <FadeInView delay={0.4}>
              <ServiceCard
                icon={<PawPrint size={64} />}
                title="Állatbarát hely"
              />
            </FadeInView>

            <FadeInView delay={0.6}>
              <ServiceCard icon={<Gem size={64} />} title="Kiemelt figyelem" />
            </FadeInView>
          </div>
        </BackgroundBlur>
      </FadeInView>
    </section>
  )
}

export default ExtraServices
