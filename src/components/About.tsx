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
                Újpesti hajszalonomban a célom, hogy vendégeimnek egyedi és
                személyre szabott frizurákat kínáljak. A szalon koncepciója a
                fenntarthatóság iránti elkötelezettségemre épül, amiben az
                Eleven Australia professzionális, vegán és állatkísérlet-mentes
                termékei segítenek, hogy a hajápolás egyszerre legyen
                környezettudatos és minőségi.
              </span>
              <span className="mb-8 block">
                Minden szolgáltatásom a vendég elképzeléseire és a minőségi,
                megfizethető, környezetbarát anyagok használatára összpontosít.
                Hiszek abban, hogy a legjobb eredményeket a vendég egyéniségéhez
                és igényeihez igazodó közös munka és kommunikáció révén érhetjük
                el. Célom, hogy a frizurád tökéletesen tükrözze a személyiséged,
                és hogy a mindennapokban, otthon is könnyen kezelni tudd azt.
              </span>
              <span>
                Amíg a hajad készül, zöldövezeti, nyugodt oázisomban pihenhetsz,
                ahol a nyugalom és a harmónia biztosítja a tökéletes élményt.
                Fontos számomra, hogy ne csak gyönyörű frizurával, hanem
                kívül-belül megújulva távozz a szalonból.
              </span>
            </p>

            <Image
              src="/about.png"
              alt="Botanic Beauty Hajszalon belső tere, Újpest, 4. kerület"
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
