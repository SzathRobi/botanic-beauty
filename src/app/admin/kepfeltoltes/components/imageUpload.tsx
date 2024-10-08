'use client'

import { CldUploadWidget } from 'next-cloudinary'

import { Button } from '@/components/Button'

// TODO / medium: consolo logok todoja
const ImageUpload = () => {
  return (
    <CldUploadWidget
      onSuccess={(result) => console.log('ezt el kell tárolni', result)}
      onUploadAdded={(result) =>
        console.log('ettől főggően kitörölni vagy megtartani', result)
      }
      uploadPreset="botanic-beauty"
    >
      {({ open }) => {
        return <Button onClick={() => open()}>Kepek feltöltese</Button>
      }}
    </CldUploadWidget>
  )
}

export default ImageUpload
