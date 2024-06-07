"use client";

import { Button } from "@/components/Button";
import { CldUploadWidget } from "next-cloudinary";

const ImageUpload = () => {
  return (
    <CldUploadWidget uploadPreset="botanic-beauty">
      {({ open }) => {
        return <Button onClick={() => open()}>Kepek feltöltese</Button>;
      }}
    </CldUploadWidget>
  );
};

export default ImageUpload;
