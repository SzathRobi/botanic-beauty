import Image from "next/image";
import BackgroundBlur from "./BackgroundBlur";
import Title from "./Title";
import Link from "next/link";

const Hairdressers = () => {
  return (
    <section className="mb-48 sm:mb-96">
      <Image
        alt=""
        src="/hairdressers-bg.png"
        fill
        className="object-fit min-h-[110vh]"
      />
      <Title title="Fodrászaink" />

      <div className="px-2 sm:px-0">
        <BackgroundBlur className="relative mx-auto mb-24 flex max-w-5xl flex-col gap-16 sm:flex-row">
          <Image
            alt=""
            src="/timi.png"
            width={240}
            height={320}
            className="w-full sm:w-auto rounded-md object-cover"
          />

          <div>
            <p className="mb-12 text-2xl">Timi</p>
            <p className="text-lg mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris at
              mi commodo, mollis nunc id, facilisis nunc. Donec feugiat gravida
              porta. Proin viverra lobortis vestibulum. Morbi tincidunt
              scelerisque massa at ultrices. Sed id hendrerit odio, sit amet
              ullamcorper turpis.
            </p>

            <Link
              prefetch={false}
              href="https://www.instagram.com/l.timi_hairstyle?igsh=MW1kYXhkMmVrcXM0eQ=="
            >
              <Image
                src="/instagram-80x80.png"
                width={48}
                height={48}
                alt="instagram logo"
              />
            </Link>
          </div>
        </BackgroundBlur>

        {/* <BackgroundBlur className="relative mx-auto mb-24 flex max-w-5xl flex-col gap-16 sm:flex-row-reverse">
          <Image
            alt=""
            src="/timi.png"
            width={240}
            height={320}
            className="w-full sm:w-auto rounded-md object-cover"
          />

          <div>
            <p className="mb-12 text-2xl">Timi</p>
            <p className="text-lg mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris at
              mi commodo, mollis nunc id, facilisis nunc. Donec feugiat gravida
              porta. Proin viverra lobortis vestibulum. Morbi tincidunt
              scelerisque massa at ultrices. Sed id hendrerit odio, sit amet
              ullamcorper turpis.
            </p>

            <Link
              prefetch={false}
              href="https://www.instagram.com/l.timi_hairstyle?igsh=MW1kYXhkMmVrcXM0eQ=="
            >
              <Image
                src="/instagram-80x80.png"
                width={48}
                height={48}
                alt="instagram logo"
              />
            </Link>
          </div>
        </BackgroundBlur> */}
      </div>
    </section>
  );
};

export default Hairdressers;
