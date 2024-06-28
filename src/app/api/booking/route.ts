import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const {
    extraService,
    service,
    hairdresser,
    selectedDate,
    selectedTimeSlot,
    contactInfo,
  } = await request.json();

  if (
    !service ||
    !hairdresser ||
    !selectedDate ||
    !selectedTimeSlot ||
    !contactInfo.name ||
    !contactInfo.email ||
    !contactInfo.phone
  ) {
    return NextResponse.json({ error: true, message: "Invalid data" });
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

    const booking = await prisma.booking.create({
      data: {
        service,
        extraService,
        hairdresser,
        selectedDate,
        selectedTimeSlot,
        contactInfo,
      },
    });

    return NextResponse.json({ success: true, data: booking });
  } catch (error: any) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ error: true, message: error.message });
  }
}

export async function PATCH(request: NextRequest, nextResponse: NextResponse) {
  const booking = await request.json();

  try {
    await prisma.booking.update({
      where: {
        id: booking.id,
      },
      data: {
        selectedTimeSlot: booking.selectedTimeSlot,
        selectedDate: booking.selectedDate,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: true, message: error });
  }
}
