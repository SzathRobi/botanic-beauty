import React from "react";
import FadeInView from "./FadeInView";
import Title from "./Title";
import BackgroundBlur from "./BackgroundBlur";
import { Crown, PawPrint, Rocket, Sun } from "lucide-react";

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
    <section className="px-2 sm:px-0 mb-60">
      <FadeInView>
        <Title title="Extra szolgáltatások" />
        <BackgroundBlur className="mx-auto space-y-24">
          <div className="flex flex-col md:flex-row justify-between gap-10">
            <FadeInView delay={0}>
              <ServiceCard icon={<Crown size={64} />} title="Felszabadítás" />
            </FadeInView>

            <FadeInView delay={0.2}>
              <ServiceCard icon={<Sun size={64} />} title="Nappal is nyitva" />
            </FadeInView>

            <FadeInView delay={0.4}>
              <ServiceCard icon={<Rocket size={64} />} title="Rakéta csapat" />
            </FadeInView>

            <FadeInView delay={0.6}>
              <ServiceCard
                icon={<PawPrint size={64} />}
                title="Krokodilbarát"
              />
            </FadeInView>
          </div>
        </BackgroundBlur>
      </FadeInView>
    </section>
  );
};

export default ExtraServices;
