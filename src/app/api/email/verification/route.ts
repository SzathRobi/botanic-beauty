import { NextResponse } from "next/server";
import { Resend } from "resend";
import { format } from "date-fns";
import { VerificationEmail } from "@/emails/VerificationEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { booking } = await request.json();

  if (!booking.contactInfo.email || booking.services.length === 0) {
    return NextResponse.json({ error: true, message: "Invalid data" });
  }

  const bookingWithFormattedDate = {
    ...booking,
    selectedDate: format(booking.selectedDate, "yyyy-MM-dd"),
  };

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: booking.contactInfo.email,
      subject: "Visszaigazolás",
      react: VerificationEmail({ booking: bookingWithFormattedDate }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: true, message: error }, { status: 500 });
  }
}
