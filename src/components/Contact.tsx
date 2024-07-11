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

const Contact = () => {
  return (
    <section className="px-2 sm:px-0 min-h-screen mb-60">
      <Image
        alt=""
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
                <MapPin size={72} />
                <p className="max-w-[20ch] text-left sm:text-center">
                  {CONTACT_ADDRESS}
                </p>
              </div>
              <div className="flex flex-row sm:flex-col items-center justify-start sm:justify-center gap-2">
                <Mail size={72} />
                <p>{CONTACT_EMAIL}</p>
              </div>
              <div className="flex flex-row sm:flex-col items-center justify-start sm:justify-center gap-2">
                <Smartphone size={72} />
                <p>{CONTACT_PHONE}</p>
              </div>
            </div>

            <div className="pl-2 sm:pl-0 flex flex-col items-start justify-center gap-12 sm:flex-row">
              <div className="relative flex flex-row sm:flex-col items-center sm:items-start justify-center gap-4 sm:gap-2">
                <div className="relative mx-auto size-16">
                  <Image
                    alt=""
                    src="/instagram-80x80.png"
                    fill
                    className="object-cover"
                  />
                </div>
                <p>instagramm/bbh</p>
              </div>
              <div className="relative flex flex-row sm:flex-col items-center sm:items-start justify-center gap-4 sm:gap-2">
                <div className="relative mx-auto size-16">
                  <Image
                    alt=""
                    src="/facebook-80x80.png"
                    fill
                    className="object-cover"
                  />
                </div>
                <p>facebook/bbh</p>
              </div>
            </div>
          </BackgroundBlur>
        </div>
      </FadeInView>
    </section>
  );
};

export default Contact;
