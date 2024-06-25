import Image from "next/image";
import BackgroundBlur from "./BackgroundBlur";
import Title from "./Title";
import FadeInView from "./FadeInView";

const About = () => {
  return (
    <section className="px-2 sm:px-0 mb-60">
      <FadeInView>
        <Title title="Szalonról" />
        <BackgroundBlur className="mx-auto space-y-24">
          <div className="flex gap-8 flex-col md:flex-row">
            {/* <div className="relative min-h-64 min-w-64 md:min-w-96 md:min-h-96">
              <Image
                alt=""
                src="/about-salon-bg.webp"
                fill
                className="object-cover"
              />
            </div> */}
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
  );
};

export default About;
