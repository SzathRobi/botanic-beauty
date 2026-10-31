import { OpeningHour } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/auth'
import prisma from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ salonId: string }> }
) {
  const salonId = (await params).salonId

  const session = await auth()

  if (!session?.user)
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })

  const salon = await prisma.salon.findUnique({
    where: {
      id: salonId,
    },
    select: {
      id: true,
    },
  })

  if (!salon)
    return NextResponse.json({ error: 'Salon not found' }, { status: 404 })

  const { openingHours }: { openingHours: OpeningHour[] } = await request.json()

  if (!openingHours || openingHours.length === 0)
    return NextResponse.json({ error: 'No data provided' }, { status: 400 })

  try {
    await prisma.salon.update({
      where: {
        id: salonId,
      },
      data: {
        openingHours,
      },
    })

    return NextResponse.json(
      {
        message: 'Opening hours updated successfully',
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}
