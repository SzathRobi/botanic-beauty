import { NextResponse } from "next/server";
import { Resend } from "resend";
import { format } from "date-fns";
import { VerificationEmail } from "@/emails/VerificationEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { booking } = await request.json();

  if (!booking.contactInfo.email || !booking.service) {
    return NextResponse.json(
      { error: true, message: "Invalid data" },
      { status: 400 }
    );
  }

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: booking.contactInfo.email,
      subject: "Visszaigazolás",
      react: VerificationEmail({ booking }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: true, message: error }, { status: 500 });
  }
}
