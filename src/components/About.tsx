import BackgroundBlur from './BackgroundBlur'
import FadeInView from './FadeInView'
import Title from './Title'

const About = () => {
  return (
    <section className="mb-40 px-2 sm:px-0">
      <FadeInView>
        <Title title="Szalonról" />

        <BackgroundBlur className="mx-auto space-y-24">
          <div className="flex flex-col gap-8 md:flex-row">
            <p className="text-lg md:text-center">
              Timi vagyok, a szalon tulajdonosa, és nagy szenvedéllyel törekszem
              arra, hogy együtt alkossuk meg a vendéggel a tökéletes frizurát. A
              szalon koncepcióját, fenntarthatóság iránti elkötelezettséggel
              hoztam létre , ezért vegán, állatkísérlet mentes termékekkel
              dolgozom. Ebben a szalonban minden a te elképzelésedről és a
              minőségi, de megfizethető és környezetbarát anyagok használatáról
              szól. Hiszek abban, hogy a legjobb eredményeket a vendég
              egyéniségéhez és igényeihez igazodó, közös munka és kommunikáció
              révén érhetjük el. A cél, hogy a frizurád tökéletesen tükrözze a
              személyiséged és a hétköznapokon, otthon is könnyen kezelni tudd,
              és megtanuld helyesen ápolni. Amíg a hajad elkészül, zöldövezeti,
              nyugodt oázisban pihenhetsz Újpesten . Számomra fontos, hogy ne
              csak gyönyörű frizurával, hanem kívűl-belűl megújulva hagyd el a
              szalont.
            </p>
          </div>
        </BackgroundBlur>
      </FadeInView>
    </section>
  )
}

export default About
