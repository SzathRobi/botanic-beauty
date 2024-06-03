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
              <Image width={300} height={424} alt="" src="/our-works-1.png" />
              <Image width={300} height={424} alt="" src="/our-works-2.png" />
              <Image width={300} height={424} alt="" src="/our-works-3.png" />
              <Image width={300} height={424} alt="" src="/our-works-4.png" />
              <Image width={300} height={424} alt="" src="/our-works-5.png" />
              <Image width={300} height={424} alt="" src="/our-works-6.png" />
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
