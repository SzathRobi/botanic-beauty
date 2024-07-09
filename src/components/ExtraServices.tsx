import React from "react";
import FadeInView from "./FadeInView";
import Title from "./Title";
import BackgroundBlur from "./BackgroundBlur";
import { CalendarCheck, Gem, PawPrint, Vegan } from "lucide-react";

type ServiceCardProps = {
  icon: any;
  title: string;
};

const ServiceCard = ({ icon, title }: ServiceCardProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div>{icon}</div>
      <h3>{title}</h3>
    </div>
  );
};

const ExtraServices = () => {
  return (
    <section className="px-2 sm:px-0 mb-60 grid place-items-center">
      <FadeInView>
        <BackgroundBlur className="mx-auto space-y-24">
          <div className="flex flex-col md:flex-row justify-between gap-10">
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
  );
};

export default ExtraServices;
