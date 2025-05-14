import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/lib/db'

export async function PATCH(request: NextRequest, { params }: any) {
  const id = await params.id

  const {
    bleachMaterialUsage,
    dyeMaterialUsage,
    price,
    extraHaircutPrice,
    miracleBoosterPrice,
  } = await request.json()

  if (
    price === null ||
    bleachMaterialUsage === null ||
    dyeMaterialUsage === null
  ) {
    return NextResponse.json(
      { error: true, message: 'Invalid data' },
      { status: 400 }
    )
  }

  try {
    await prisma.booking.update({
      where: {
        id,
      },
      data: {
        bleachMaterialUsage,
        dyeMaterialUsage,
        finalPrice: price,
        isFinanceDone: true,
        extraHaircutPrice,
        miracleBoosterPrice,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: true, message: error }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
