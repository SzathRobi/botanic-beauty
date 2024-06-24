import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";

export async function DELETE(request: NextRequest, { params }: any) {
  const id = await params.id;
  try {
    await prisma.booking.delete({
      where: {
        id,
      },
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: true, message: error }, { status: 500 });
  }
}
