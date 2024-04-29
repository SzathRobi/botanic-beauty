import Link from "next/link";
import Image from "next/image";
import BackgroundBlur from "./BackgroundBlur";
import { BOOKING_ROUTE } from "@/constants/routes.constants";

const Landing = async () => {
  return (
    <section className="h-screen">
      <Image
        alt=""
        src="/landing-bg.png"
        fill
        className="relative -z-10 -translate-y-[20%] transform object-cover"
      />
      <div className="px-2 sm:px-0 flex h-full w-full flex-col items-center justify-center">
        <BackgroundBlur className="mb-24 flex flex-col items-center justify-center gap-4">
          <h1 className="text-center text-xl md:text-3xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ac
            volutpat arcu, at lacinia tellus. Etiam nec magna ante.
          </h1>
        </BackgroundBlur>
        <Link
          href={BOOKING_ROUTE}
          className="green-glow rounded-md bg-green-700 px-4 py-2 text-lg text-white shadow-green-700 transition"
        >
          Időpontfoglalás
        </Link>
      </div>
    </section>
  );
};

export default Landing;
