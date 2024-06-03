import { IoLocationSharp, IoMail } from "react-icons/io5";
import { FaMobileAlt } from "react-icons/fa";

import BackgroundBlur from "./BackgroundBlur";
import Title from "./Title";
import Image from "next/image";
import FadeInView from "./FadeInView";

const Contact = () => {
  return (
    <section className="min-h-screen">
      <Image
        alt=""
        src="/contact-bg.png"
        fill
        className="object-fit min-h-[110vh] -z-10"
      />
      <FadeInView>
        <Title title="Elérhetőség / média" />
        <div className="px-2 sm:px-0">
          <BackgroundBlur className="mx-auto flex max-w-5xl flex-col gap-16 ">
            <div className="flex flex-col items-start justify-center gap-12 sm:flex-row">
              <div className="flex flex-row sm:flex-col items-center justify-start sm:justify-center gap-2">
                <IoLocationSharp
                  size={80}
                  className="green-glow-text text-green-700"
                />
                <p className="max-w-sm text-left sm:text-center">
                  1045. Budapest,
                  <br /> Széchenyi tér 4. (Újpest)
                </p>
              </div>
              <div className="flex flex-row sm:flex-col items-center justify-start sm:justify-center gap-2">
                <IoMail size={80} className="green-glow-text text-green-700" />
                <p>email@email.com</p>
              </div>
              <div className="flex flex-row sm:flex-col items-center justify-start sm:justify-center gap-2">
                <FaMobileAlt
                  size={80}
                  className="green-glow-text text-green-700"
                />
                <p>+36 30 4204200</p>
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
