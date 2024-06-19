import cloudinary from "cloudinary";
import ImageUpload from "./components/imageUpload";
import ImageList from "./components/imageList";

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  // secure: true,
});

const ImageUploadPage = async () => {
  // TODO / high: cloudinary CRUD
  // TODO / low: add tags / folders for separating images (for filtering + searching)

  const { resources } = await cloudinary.v2.api.resources({
    type: "upload",
  });

  return (
    <section>
      <h1>Kepek feltöltése</h1>

      <div className="mb-10">
        <ImageUpload />
      </div>

      <ImageList resources={resources} />
    </section>
  );
};

export default ImageUploadPage;
