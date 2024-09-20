import { auth } from "@/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { email, name, phone, hairdressers, otherInfo } = body;

  if (!email || !name || !phone || !hairdressers) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const existingCustomer = await prisma.customer.findUnique({
    where: {
      email,
    },
  });

  if (existingCustomer) {
    if (existingCustomer.hairdressers.length === 2) {
      return NextResponse.json({}, { status: 200 });
    }

    if (
      existingCustomer.hairdressers.includes("Timi") &&
      hairdressers === "nem_Timi"
    ) {
      try {
        await prisma.customer.update({
          where: {
            email,
          },
          data: {
            email,
            name,
            otherInfo,
            phone,
            hairdressers: {
              push: "nem_Timi",
            },
          },
        });
      } catch (error) {
        console.log({ error });
        return NextResponse.json({}, { status: 500 });
      }

      return NextResponse.json({}, { status: 200 });
    }

    if (
      existingCustomer.hairdressers.includes("nem_Timi") &&
      hairdressers === "Timi"
    ) {
      try {
        await prisma.customer.update({
          where: {
            email,
          },
          data: {
            email,
            name,
            otherInfo,
            phone,
            hairdressers: {
              push: "Timi",
            },
          },
        });
      } catch (error) {
        console.log({ error });
        return NextResponse.json({}, { status: 500 });
      }

      return NextResponse.json({}, { status: 200 });
    }

    return NextResponse.json({}, { status: 200 });
  }

  try {
    await prisma.customer.create({
      data: {
        email,
        name,
        phone,
        hairdressers: [...hairdressers],
        otherInfo: otherInfo ? otherInfo : null,
      },
    });
  } catch (error) {
    console.log({ error });
    return NextResponse.json({}, { status: 500 });
  }

  return NextResponse.json({}, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();

  if (!session?.user) return redirect("/admin/bejelentkezes");

  const selectedEmails = await req.json();

  if (!selectedEmails || selectedEmails.length === 0) {
    return NextResponse.json(
      { message: "Nem megfelelő adatok" },
      { status: 400 }
    );
  }

  try {
    await prisma.customer.deleteMany({
      where: {
        email: {
          in: selectedEmails,
        },
      },
    });

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { message: "Hiba történt az adatok feldolgozásában." },
      { status: 500 }
    );
  }
}
