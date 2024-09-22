'use client'

import Image from 'next/image'
import { useState } from 'react'
import toast from 'react-hot-toast'

import BackgroundBlur from '@/components/BackgroundBlur'
import { Button } from '@/components/Button'
import FadeInView from '@/components/FadeInView'

type ImageResource = {
  id: string
  public_id: string
  // other properties...
}

type ImageListProps = {
  resources: ImageResource[]
}

const ImageList = ({ resources }: ImageListProps) => {
  const [allImages, setAllImages] = useState([...resources])
  const [selectedImages, setSelectedImages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckboxChange = (imageId: any) => {
    setSelectedImages((prevSelectedImages) =>
      prevSelectedImages.includes(imageId)
        ? prevSelectedImages.filter((id) => id !== imageId)
        : [...prevSelectedImages, imageId]
    )
  }

  const onBulkDelete = async () => {
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/images', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedImages }),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.message)
      }

      const filteredImages = allImages.filter(
        (image) => !selectedImages.includes(image.public_id)
      )
      setAllImages(filteredImages)

      setSelectedImages([])
    } catch (error: any) {
      setError(error.message || error)
      toast.error(error.message || error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FadeInView>
      <BackgroundBlur className="mx-auto">
        <div className="mx-auto grid grid-cols-1 place-items-center gap-8 pb-10 sm:grid-cols-2 md:grid-cols-3">
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
                    className={`rounded-xl object-cover ${
                      selectedImages.includes(image.public_id)
                        ? 'border-4 border-red-500'
                        : ''
                    }`}
                  />
                </label>
              </div>
            ))}
        </div>
      </BackgroundBlur>
      {selectedImages.length > 0 && (
        <div className="fixed bottom-10 right-10 flex justify-end gap-4">
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
  )
}

export default ImageList
