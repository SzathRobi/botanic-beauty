import ImageUpload from "./components/imageUpload";

const ImageUploadPage = async () => {
  // TODO / low: add tags / folders for separating images (for filtering + searching)
  return (
    <section>
      <h1>Kepek feltöltése</h1>
      <ImageUpload />
    </section>
  );
};

export default ImageUploadPage;
