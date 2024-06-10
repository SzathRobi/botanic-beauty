import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, nextResponse: NextResponse) {
  const { services, hairdresser, selectedDate, selectedTimeSlot, contactInfo } =
    await request.json();

  if (
    !services ||
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
    const booking = await prisma.booking.create({
      data: {
        services,
        hairdresser,
        selectedDate,
        selectedTimeSlot,
        contactInfo,
      },
    });
    return NextResponse.json({ success: true });
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
