import cloudinary from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  // secure: true,
});

export async function DELETE(request: NextRequest) {
  const { selectedImages } = await request.json();

  if (!selectedImages || selectedImages.length === 0) {
    return NextResponse.json(
      { error: true, message: "Nem megfelelő adatok" },
      { status: 400 }
    );
  }

  try {
    await cloudinary.v2.api.delete_resources(selectedImages);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: true, message: error }, { status: 500 });
  }
}
