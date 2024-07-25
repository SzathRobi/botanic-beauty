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

  const { contactInfo, selectedDate, selectedTimeSlot } = await request.json();

  if (!contactInfo || !selectedDate || !selectedTimeSlot) {
    return NextResponse.json(
      { error: true, message: "Invalid data" },
      { status: 400 }
    );
  }

  try {
    const allBookings = await prisma.booking.findMany({
      where: {
        selectedDate: {
          equals: selectedDate,
        },
      },
    });

    const [newStartTime, newEndTime] = selectedTimeSlot.split(" - ");

    const overlaps = allBookings.some((booking) => {
      const [existingStartTime, existingEndTime] =
        booking.selectedTimeSlot.split(" - ");
      return (
        (newStartTime < existingEndTime && newEndTime > existingStartTime) ||
        (newEndTime > existingStartTime && newStartTime < existingEndTime)
      );
    });

    if (overlaps) {
      return NextResponse.json(
        { error: true, message: "Overlap with existing booking" },
        { status: 400 }
      );
    }

    const response = await prisma.booking.update({
      where: {
        id,
      },
      data: {
        contactInfo,
        selectedDate,
        selectedTimeSlot,
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
