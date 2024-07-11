import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";
import { auth } from "@/auth";

export async function PATCH(request: NextRequest, { params }: any) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: true, message: "Unauthenticated" },
      { status: 401 }
    );
  }

  const id = await params.id;

  const data = await request.json();

  try {
    const response = await prisma.booking.update({
      where: {
        id,
      },
      data: {
        contactInfo: data.contactInfo,
      },
    });

    return NextResponse.json(
      { success: true, message: response },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: true, message: error }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: any) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: true, message: "Unauthenticated" },
      { status: 401 }
    );
  }

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
