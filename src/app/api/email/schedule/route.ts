import { NextRequest, NextResponse } from "next/server";
import { NextCron } from "nextcron";

const nextcron = new NextCron({
  apiKey: process.env.CRON_API_KEY || "",
});

export async function POST(request: NextRequest) {
  const { booking, emailDelayInMiliseconds } = await request.json();

  if (!booking || !emailDelayInMiliseconds) {
    return NextResponse.json({ error: true, message: "Invalid data" });
  }

  try {
    const response = await nextcron.publish({
      topic: "reminder",
      target: "https://botanic-beauty.vercel.app/api/email/reminder",
      method: "POST",
      data: booking,
      options: {
        delay: emailDelayInMiliseconds,
      },
    });

    return NextResponse.json({ success: true, message: response });
  } catch (error) {
    return NextResponse.json({ error: true, message: error });
  }
}
