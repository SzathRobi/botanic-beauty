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

  prisma.booking
    .create({
      data: {
        services,
        hairdresser,
        selectedDate,
        selectedTimeSlot,
        contactInfo,
      },
    })
    .catch((error) => {
      return NextResponse.json({ error: true, message: error });
    });

  return NextResponse.json({ success: true });
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
