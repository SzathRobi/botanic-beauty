import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import prisma from "@/lib/db";
// import { isEmployeeUser, isSubscribedUser } from '@/utils'

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user)
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const customers = await request.json();

  if (!customers || customers.length === 0)
    return NextResponse.json({ error: "No data provided" }, { status: 400 });

  await prisma.customer.createMany({
    data: customers,
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
