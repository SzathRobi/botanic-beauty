import cloudinary from 'cloudinary'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'

import ImageList from './components/imageList'
import ImageUpload from './components/imageUpload'

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  // secure: true,
})

const ImageUploadPage = async () => {
  const session = await auth()

  if (!session?.user) {
    redirect('/admin/bejelentkezes')
  }

  // TODO / high: cloudinary CRUD
  // TODO / low: add tags / folders for separating images (for filtering + searching)
  // TODO / low: add infinite scroll pagination

  const cloudinaryData = await cloudinary.v2.api.resources({
    type: 'upload',
    max_results: 200,
  })

  return (
    <section>
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <ImageUpload />
        </div>

        <ImageList resources={cloudinaryData.resources} />
      </div>
    </section>
  )
}

export default ImageUploadPage
