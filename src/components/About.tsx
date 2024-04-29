import BackgroundBlur from "./BackgroundBlur";
import Title from "./Title";

const About = () => {
  return (
    <section className="px-2 sm:px-0 mb-60 sm:mb-20">
      <Title title="Rólunk" />
      <BackgroundBlur className="mx-auto">
        <p className="text-lg ">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris at mi
          commodo, mollis nunc id, facilisis nunc. Donec feugiat gravida porta.
          Proin viverra lobortis vestibulum. Morbi tincidunt scelerisque massa
          at ultrices. Sed id hendrerit odio, sit amet ullamcorper turpis. Fusce
          pulvinar vel ex non fermentum. Integ vel ex non fermentum. Integ
          semper vitae, feugiat id ex. Suspendisse auctor egestas dui vitae
          malesuada.
        </p>
      </BackgroundBlur>
    </section>
  );
};

export default About;
