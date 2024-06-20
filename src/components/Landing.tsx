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
        priority={true}
        className="relative -z-10 -translate-y-[20%] transform object-cover"
      />
      <div className="px-2 sm:px-0 flex h-full w-full flex-col items-center justify-center">
        <BackgroundBlur className="mb-24 flex flex-col items-center justify-center gap-4">
          <h1 className="text-center text-xl md:text-3xl mb-2">
            Lépj be a fenntartható és személyre szabott hajápolás világába a
            Botanic Beauty fordászatnál!
          </h1>
          <h2 className="text-center mb-12 text-md md:text-xl opacity-75">
            A természet és az egyéniséged ihlette fodrászat Újpesten.
          </h2>
          <Link
            href={BOOKING_ROUTE}
            className="green-glow rounded-md bg-green-700 px-4 py-2 text-xl text-white shadow-green-700 transition"
          >
            Időpontfoglalás
          </Link>
        </BackgroundBlur>
      </div>
    </section>
  );
};

export default Landing;
