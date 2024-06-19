"use client";

import BackgroundBlur from "@/components/BackgroundBlur";
import { Button } from "@/components/Button";
import FadeInView from "@/components/FadeInView";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

type ImageResource = {
  id: string;
  public_id: string;
  // other properties...
};

type ImageListProps = {
  resources: ImageResource[];
};

const ImageList = ({ resources }: ImageListProps) => {
  const [allImages, setAllImages] = useState([...resources]);
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckboxChange = (imageId: any) => {
    setSelectedImages((prevSelectedImages) =>
      prevSelectedImages.includes(imageId)
        ? prevSelectedImages.filter((id) => id !== imageId)
        : [...prevSelectedImages, imageId]
    );
  };

  const onBulkDelete = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/images", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedImages }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message);
      }

      const filteredImages = allImages.filter(
        (image) => !selectedImages.includes(image.public_id)
      );
      setAllImages(filteredImages);

      setSelectedImages([]);
    } catch (error: any) {
      setError(error.message || error);
      toast.error(error.message || error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FadeInView>
      <BackgroundBlur className="mx-auto">
        <div className="pb-10 mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 place-items-center gap-8">
          {allImages.length &&
            allImages.map((image: any) => (
              <div key={image.public_id}>
                <label>
                  <input
                    type="checkbox"
                    name={image.public_id}
                    id={image.public_id}
                    className="hidden"
                    onChange={() => handleCheckboxChange(image.public_id)}
                  />
                  <Image
                    alt=""
                    src={image.url}
                    width={320}
                    height={424}
                    className={`object-cover rounded-xl ${
                      selectedImages.includes(image.public_id)
                        ? "border-4 border-red-500"
                        : ""
                    }`}
                  />
                </label>
              </div>
            ))}
        </div>
      </BackgroundBlur>
      {selectedImages.length > 0 && (
        <div className="flex justify-end gap-4 fixed bottom-10 right-10">
          <div>
            <Button
              variant="destructive"
              onClick={onBulkDelete}
              isLoading={isLoading}
            >
              Törlés
            </Button>
          </div>
          {/* <Button variant="secondary">Módosítás</Button> */}
        </div>
      )}
    </FadeInView>
  );
};

export default ImageList;
