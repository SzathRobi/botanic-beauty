import Image from 'next/image'

import BackgroundBlur from './BackgroundBlur'
import FadeInView from './FadeInView'
import Title from './Title'

const About = () => {
  return (
    <section className="mb-80 px-2 sm:px-0">
      <Image
        alt="Botanic Beauty Hajszalon növény"
        src="/leaves-vertical.png"
        width={508}
        height={1080}
        className="absolute left-0 top-3/4 -z-10 translate-y-40 -rotate-12 object-cover sm:left-1/4 md:top-1/2"
      />

      <FadeInView>
        <Title title="Szalonról" />

        <BackgroundBlur className="mx-auto space-y-24">
          <div className="flex flex-col-reverse items-center justify-center gap-8 lg:flex-row lg:items-start">
            <p className="min-w-min text-lg lg:min-w-[400px]">
              <span className="mb-8 block">
                Timi vagyok, a szalon tulajdonosa, és nagy szenvedéllyel
                törekszem arra, hogy együtt alkossuk meg a vendéggel a tökéletes
                frizurát. A szalon koncepcióját, fenntarthatóság iránti
                elkötelezettséggel hoztam létre , ezért vegán, állatkísérlet
                mentes termékekkel dolgozom.
              </span>
              <span className="mb-8 block">
                Ebben a szalonban minden a te elképzelésedről és a minőségi, de
                megfizethető és környezetbarát anyagok használatáról szól.
                Hiszek abban, hogy a legjobb eredményeket a vendég egyéniségéhez
                és igényeihez igazodó, közös munka és kommunikáció révén
                érhetjük el. A cél, hogy a frizurád tökéletesen tükrözze a
                személyiséged és a hétköznapokon, otthon is könnyen kezelni
                tudd, és megtanuld helyesen ápolni.
              </span>
              <span>
                Amíg a hajad elkészül, zöldövezeti, nyugodt oázisban pihenhetsz
                Újpesten . Számomra fontos, hogy ne csak gyönyörű frizurával,
                hanem kívűl-belűl megújulva hagyd el a szalont.
              </span>
            </p>

            <Image
              src="/about.png"
              alt="Botanic Beauty Hajszalon"
              width={508}
              height={576}
              className="rounded-md object-cover"
            />
          </div>
        </BackgroundBlur>
      </FadeInView>
    </section>
  )
}

export default About
