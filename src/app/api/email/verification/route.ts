import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { contactInfo } = await request.json();
  const { email, name, phone, otherInfo } = contactInfo;

  if (!email || !name || !phone) {
    return NextResponse.json({ error: true, message: "Invalid data" });
  }

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Visszaigazolás",
      html: `<p>Kedves ${name}! Az email címed: ${email} </p> <p>Telefonszám: ${phone}</p> <p>Megjegyzés: ${otherInfo}</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: true, message: error });
  }
}
