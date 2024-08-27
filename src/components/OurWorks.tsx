import Image from "next/image";
import Title from "./Title";
import BackgroundBlur from "./BackgroundBlur";
import Link from "next/link";
import { FaLongArrowAltRight } from "react-icons/fa";

import { OUR_WORKS_ROUTE } from "@/constants/routes.constants";
import FadeInView from "./FadeInView";

const OurWorks = () => {
  return (
    <section>
      <FadeInView>
        <Title title="Munkáink" />

        <div className="px-2 sm:px-0">
          <BackgroundBlur className="mx-auto pb-16">
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 place-items-center">
              <Image
                width={300}
                height={424}
                alt="Botanic Beauty szalonban készult haj 1"
                src="/our-works-1.png"
                className="max-h-[354px] object-cover rounded"
              />
              <Image
                width={300}
                height={424}
                alt="Botanic Beauty szalonban készult haj 2"
                src="/our-works-2.png"
                className="max-h-[354px] object-cover rounded"
              />
              <Image
                width={300}
                height={424}
                alt="Botanic Beauty szalonban készult haj 3"
                src="/our-works-3.png"
                className="max-h-[354px] object-cover rounded"
              />
              <Image
                width={300}
                height={424}
                alt="Botanic Beauty szalonban készult haj 4"
                src="/our-works-4.png"
                className="max-h-[354px] object-cover rounded"
              />
              <Image
                width={300}
                height={424}
                alt="Botanic Beauty szalonban készult haj 5"
                src="/our-works-5.png"
                className="max-h-[354px] object-cover rounded"
              />
              <Image
                width={300}
                height={424}
                alt="Botanic Beauty szalonban készult haj 6"
                src="/our-works-6.png"
                className="max-h-[354px] object-cover rounded"
              />
              <Image
                width={300}
                height={424}
                alt="Botanic Beauty szalonban készult haj 7"
                src="/our-works-7.png"
                className="max-h-[354px] object-cover rounded"
              />
              <Image
                width={300}
                height={424}
                alt="Botanic Beauty szalonban készult haj 8"
                src="/our-works-8.png"
                className="max-h-[354px] object-cover rounded"
              />
              <Image
                width={300}
                height={424}
                alt="Botanic Beauty szalonban készult haj 9"
                src="/our-works-9.png"
                className="max-h-[354px] object-cover rounded"
              />
            </div>
            <Link
              href={OUR_WORKS_ROUTE}
              className="mb-4 text-lg float-right flex items-center justify-start gap-2"
            >
              <span>Még több</span>
              <FaLongArrowAltRight />
            </Link>
          </BackgroundBlur>
        </div>
      </FadeInView>
    </section>
  );
};

export default OurWorks;
