import Image from 'next/image'
import { FaInstagram } from 'react-icons/fa'

import BackgroundBlur from './BackgroundBlur'
import Title from './Title'

const Hairdressers = () => {
  return (
    <section className="relative mb-80 px-2 sm:px-0">
      {/* <Image
        alt="Botanic Beauty Hajszalon növény"
        src="/leaves-vertical.png"
        width={508}
        height={1080}
        className="absolute right-0 top-3/4 -z-10 rotate-[25deg] object-cover sm:right-1/4 md:top-1/2"
      /> */}

      <Title title="Rólam" />

      <div className="px-2 sm:px-0">
        <BackgroundBlur className="relative mx-auto mb-24 flex max-w-5xl flex-col gap-16 sm:flex-row">
          <Image
            alt="Botanic Beauty Hajszalon tulajdonosa, Timi."
            src="/timi.png"
            width={240}
            height={320}
            className="w-full rounded-md object-cover sm:w-auto"
          />

          <div>
            <p className="mb-4 min-w-min text-lg lg:min-w-[400px]">
              <span className="mb-8 block">
                Timi vagyok, a Botanic Beauty Hajszalon tulajdonosa, és nagy
                szenvedéllyel törekszem arra, hogy minden vendégem számára a
                legjobb frizurát alkossam meg. Szakmai tapasztalatom és az új
                trendek iránti érdeklődésem segít abban, hogy mindig a
                legmodernebb és legstílusosabb megoldásokat kínálhassam.
              </span>
              <span>
                Folyamatosan fejlődöm, hogy a legjobbat nyújthassam, és
                fontosnak tartom, hogy a vendégeim megértsék a hajápolás
                alapjait, így a nálam töltött idő ne csak egy frizura
                elkészítéséről szóljon, hanem egy értékes tapasztalatról is.
              </span>
            </p>

            <a
              href="https://www.instagram.com/botanic_beauty_hajszalon"
              target="_blank"
              rel="noreferrer"
            >
              <div className="flex flex-row items-center justify-start gap-2 sm:flex-col sm:justify-center lg:items-start">
                <FaInstagram size={48} className="size-12 text-emerald-600" />
              </div>
            </a>
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
  )
}

export default Hairdressers
