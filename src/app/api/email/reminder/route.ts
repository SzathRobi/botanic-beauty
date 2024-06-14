import ReminderEmail from "@/emails/ReminderEmail";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const { booking } = await request.json();

  if (!booking) {
    return NextResponse.json({ error: true, message: "Invalid data" });
  }

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: booking.contactInfo.email,
      subject: "Emlékeztető",
      react: ReminderEmail({ booking }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: true, message: error }, { status: 500 });
  }
}
