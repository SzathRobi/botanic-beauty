import BackgroundBlur from "@/components/BackgroundBlur";
import FadeInView from "@/components/FadeInView";
import Transition from "@/components/Transition";
import cloudinary from "cloudinary";
import Image from "next/image";

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  // secure: true,
});

const OurWorksPage = async () => {
  const { resources } = await cloudinary.v2.api.resources({
    type: "upload",
  });

  return (
    <Transition>
      <section className="pt-24">
        {/* <h1> OurWorksPage {resources.length}</h1> */}
        <BackgroundBlur className="!max-w-6xl mx-auto grid place-items-center">
          <div className="columns-2 md:columns-3 gap-8">
            {resources.length &&
              resources.map((image: any, index: number) => (
                <FadeInView key={image.public_id}>
                  <Image
                    alt=""
                    src={image.url}
                    width={320}
                    height={424}
                    className="object-cover mb-6 rounded-xl"
                  />
                </FadeInView>
              ))}
          </div>
        </BackgroundBlur>
      </section>
    </Transition>
  );
};

export default OurWorksPage;
