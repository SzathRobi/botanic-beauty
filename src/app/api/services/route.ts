import { serviceFormSchema } from "@/app/admin/szolgaltatasok/schemas/serviceForm.schema";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ success: true, message: "success" });

  //   const services = await prisma.service.findMany();
  //   return NextResponse.json(services);
  // }

  // export async function POST(request: Request) {
  //   const service = await request.json();

  //   const validatedFiels = serviceFormSchema.safeParse(service);

  //   if (!validatedFiels.success) {
  //     // console.log(validatedFiels.error.issues);
  //     return NextResponse.json(
  //       { error: true, message: "Helytelen adatok" },
  //       { status: 400 }
  //     );
  //   }

  //   try {
  //     await prisma.service.create({
  //       data: service,
  //     });
  //   } catch (error) {
  //     return NextResponse.json({ error: true, message: error }, { status: 500 });
  //   }

  //   return NextResponse.json({ success: true, message: "Sikeres hozzáadás" });
  // }

  // export async function DELETE(request: Request) {
  //   const { id } = await request.json();
  //   try {
  //     await prisma.service.delete({
  //       where: {
  //         id,
  //       },
  //     });
  //     return NextResponse.json({ success: true }, { status: 200 });
  //   } catch (error) {
  //     return NextResponse.json({ error: true, message: error }, { status: 500 });
  //   }
}
