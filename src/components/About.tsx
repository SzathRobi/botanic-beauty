import Image from "next/image";
import BackgroundBlur from "./BackgroundBlur";
import Title from "./Title";
import FadeInView from "./FadeInView";

const About = () => {
  return (
    <section className="px-2 sm:px-0 mb-60">
      <FadeInView>
        <Title title="Rólunk" />
        <BackgroundBlur className="mx-auto space-y-24">
          <div className="flex gap-8 flex-col md:flex-row">
            <div className="relative min-h-64 min-w-64 md:min-w-96 md:min-h-96">
              <Image
                alt=""
                src="/about-salon-bg.webp"
                fill
                className="object-cover"
              />
            </div>
            <p className="text-lg mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris at
              mi commodo, mollis nunc id, facilisis nunc. Donec feugiat gravida
              porta. Proin viverra lobortis vestibulum. Morbi tincidunt
              scelerisque massa at ultrices. Sed id hendrerit odio, sit amet
              ullamcorper turpis. Fusce pulvinar vel ex non fermentum. Integ vel
              ex non fermentum. Integ semper vitae, feugiat id ex. Suspendisse
              auctor egestas dui vitae malesuada.
            </p>
          </div>
        </BackgroundBlur>
      </FadeInView>
    </section>
  );
};

export default About;
