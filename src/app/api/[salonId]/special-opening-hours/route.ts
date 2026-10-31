import { SpecialOpeningHour } from '@prisma/client'
import { isSameDay } from 'date-fns'
import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/auth'
import prisma from '@/lib/db'

import { areDatesUnique } from './utils/areDatesUnique.util'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ salonId: string }> }
) {
  const salonId = (await params).salonId

  const session = await auth()

  if (!session?.user)
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })

  const { specialOpeningHours }: { specialOpeningHours: SpecialOpeningHour[] } =
    await request.json()

  if (!specialOpeningHours || specialOpeningHours.length === 0)
    return NextResponse.json({ error: 'No data provided' }, { status: 400 })

  if (!areDatesUnique(specialOpeningHours))
    return NextResponse.json({ error: 'Dates must be unique' }, { status: 400 })

  const salon = await prisma.salon.findUnique({
    where: {
      id: salonId,
    },
    select: {
      specialOpeningHours: true,
    },
  })

  if (!salon) {
    return NextResponse.json({ error: 'Salon not found' }, { status: 404 })
  }

  try {
    await prisma.salon.update({
      where: {
        id: salonId,
      },
      data: {
        specialOpeningHours: [
          ...specialOpeningHours,
          ...salon.specialOpeningHours,
        ],
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error creating special opening hour' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ salonId: string }> }
) {
  const salonId = (await params).salonId

  const session = await auth()

  if (!session?.user)
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })

  const { specialOpeningHours }: { specialOpeningHours: SpecialOpeningHour[] } =
    await request.json()

  if (!specialOpeningHours || specialOpeningHours.length === 0)
    return NextResponse.json({ error: 'No data provided' }, { status: 400 })

  const salon = await prisma.salon.findUnique({
    where: {
      id: salonId,
    },
    select: {
      specialOpeningHours: true,
    },
  })

  if (!salon) {
    return NextResponse.json({ error: 'Salon not found' }, { status: 404 })
  }

  const isBulkUpdate = specialOpeningHours.length > 1

  const modifiedSpecialOpeningHours: SpecialOpeningHour[] =
    salon.specialOpeningHours.map((salonOpeningHour): SpecialOpeningHour => {
      if (isSameDay(salonOpeningHour.date, specialOpeningHours[0].date)) {
        return specialOpeningHours[0]
      }

      return salonOpeningHour
    })

  try {
    await prisma.salon.update({
      where: {
        id: salonId,
      },
      data: {
        specialOpeningHours: isBulkUpdate
          ? specialOpeningHours
          : modifiedSpecialOpeningHours,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error updating special opening hour' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ salonId: string }> }
) {
  const salonId = (await params).salonId

  const session = await auth()

  if (!session?.user)
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })

  const { date }: { date: Date } = await request.json()

  if (!date)
    return NextResponse.json({ error: 'No data provided' }, { status: 400 })

  const salon = await prisma.salon.findUnique({
    where: {
      id: salonId,
    },
    select: {
      specialOpeningHours: true,
    },
  })

  if (!salon) {
    return NextResponse.json({ error: 'Salon not found' }, { status: 404 })
  }

  const filteredSpecialOpeningHours: SpecialOpeningHour[] =
    salon.specialOpeningHours.filter(
      (openingHour) => !isSameDay(openingHour.date, date)
    )

  try {
    await prisma.salon.update({
      where: {
        id: salonId,
      },
      data: {
        specialOpeningHours: filteredSpecialOpeningHours,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error deleting special opening hour' },
      { status: 500 }
    )
  }
}
