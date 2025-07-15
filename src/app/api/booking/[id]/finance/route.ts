import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/lib/db'

export async function POST(request: NextRequest, { params }: any) {
  const id = await params.id

  const {
    bleachMaterialUsage,
    dyeMaterialUsage,
    finalPrice,
    extraHaircutPrice,
    miracleBoosterPrice,
    financeComment,
    isPaidWithCard,
    tips,
    discountPercentage,
  } = await request.json()

  if (
    finalPrice === null ||
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
        finalPrice,
        isFinanceDone: true,
        extraHaircutPrice,
        miracleBoosterPrice,
        isPaidWithCard,
        financeComment,
        tips,
        discountPercentage,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: true, message: error }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
