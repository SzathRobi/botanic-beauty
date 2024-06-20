import cloudinary from "cloudinary";
import ImageUpload from "./components/imageUpload";
import ImageList from "./components/imageList";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  // secure: true,
});

const ImageUploadPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/bejelentkezes");
  }

  // TODO / high: cloudinary CRUD
  // TODO / low: add tags / folders for separating images (for filtering + searching)
  // TODO / low: add infinite scroll pagination

  const cloudinaryData = await cloudinary.v2.api.resources({
    type: "upload",
    max_results: 200,
  });

  return (
    <section>
      <h1>Kepek feltöltése</h1>

      <div className="mb-10">
        <ImageUpload />
      </div>

      <ImageList resources={cloudinaryData.resources} />
    </section>
  );
};

export default ImageUploadPage;
