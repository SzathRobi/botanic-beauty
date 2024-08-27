import { MapPin, Mail, Smartphone } from "lucide-react";

import BackgroundBlur from "./BackgroundBlur";
import Title from "./Title";
import Image from "next/image";
import FadeInView from "./FadeInView";
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE,
} from "@/constants/contact.constants";
import Link from "next/link";

const Contact = () => {
  return (
    <section className="px-2 sm:px-0 min-h-screen mb-40">
      <Image
        alt="Botanic Beauty fodrászat"
        src="/contact-bg.png"
        fill
        className="object-fit min-h-[110vh] -z-10"
      />
      <FadeInView>
        <Title title="Elérhetőség / média" />
        <div>
          <BackgroundBlur className="mx-auto flex max-w-5xl flex-col gap-16 ">
            <div className="flex flex-col items-start justify-center gap-12 sm:flex-row">
              <div className="flex flex-row sm:flex-col items-center justify-start sm:justify-center gap-2">
                <MapPin size={72} className="size-12 md:size-16" />
                <p className="max-w-[20ch] text-sm md:text-base text-left sm:text-center">
                  {CONTACT_ADDRESS}
                </p>
              </div>
              <div className="flex flex-row sm:flex-col items-center justify-start sm:justify-center gap-2">
                <Mail size={72} className="size-12 md:size-16" />
                <p className="min-w-[25ch] text-sm md:text-base max-w-20 md:max-w-auto">
                  {CONTACT_EMAIL}
                </p>
              </div>
              <div className="flex flex-row sm:flex-col items-center justify-start sm:justify-center gap-2">
                <Smartphone size={72} className="size-12 md:size-16" />
                <p className="text-sm md:text-base">{CONTACT_PHONE}</p>
              </div>
            </div>

            <div className="pl-2 sm:pl-0 flex flex-col items-start justify-center gap-12 sm:flex-row">
              <div className="relative flex flex-row sm:flex-col items-center sm:items-start justify-center gap-4 sm:gap-2">
                <div className="relative mx-auto size-12 md:size-16">
                  <a
                    href="https://www.instagram.com/botanic_beauty_hajszalon"
                    target="_blank"
                  >
                    <Image
                      alt="Botanic Beauty hajszalon instagramja"
                      src="/instagram-80x80.png"
                      fill
                      className="object-cover"
                    />
                  </a>
                </div>
                <p className="text-sm md:text-base">instagram</p>
              </div>
              <div className="relative flex flex-row sm:flex-col items-center sm:items-start justify-center gap-4 sm:gap-2">
                <div className="relative mx-auto size-12 md:size-16">
                  <a
                    href="https://www.facebook.com/profile.php?id=61563419040169"
                    target="_blank"
                  >
                    <Image
                      alt="Botanic Beauty hajszalon facebookja"
                      src="/facebook-80x80.png"
                      fill
                      className="object-cover"
                    />
                  </a>
                </div>
                <p className="text-sm md:text-base">facebook</p>
              </div>
            </div>
          </BackgroundBlur>
        </div>
      </FadeInView>
    </section>
  );
};

export default Contact;
