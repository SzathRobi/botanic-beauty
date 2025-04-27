import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/auth'
import prisma from '@/lib/db'

export async function POST(request: NextRequest) {
  const {
    extraServices,
    service,
    hairdresser,
    selectedDate,
    selectedTimeSlot,
    contactInfo,
  } = await request.json()

  if (
    !service ||
    !hairdresser ||
    !selectedDate ||
    !selectedTimeSlot ||
    !contactInfo.name ||
    !contactInfo.email ||
    !contactInfo.phone
  ) {
    return NextResponse.json({ error: true, message: 'Invalid data' })
  }

  try {
    const allBookings = await prisma.booking.findMany({
      where: {
        selectedDate: {
          equals: selectedDate,
        },
      },
    })

    const [newStartTime, newEndTime] = selectedTimeSlot.split(' - ')

    const overlaps = allBookings.some((booking) => {
      const [existingStartTime, existingEndTime] =
        booking.selectedTimeSlot.split(' - ')
      return (
        (newStartTime < existingEndTime && newEndTime > existingStartTime) ||
        (newEndTime > existingStartTime && newStartTime < existingEndTime)
      )
    })

    if (overlaps) {
      return NextResponse.json(
        { error: true, message: 'Overlap with existing booking' },
        { status: 400 }
      )
    }

    const booking = await prisma.booking.create({
      data: {
        service,
        extraServices,
        hairdresser,
        selectedDate,
        selectedTimeSlot,
        contactInfo,
      },
    })

    return NextResponse.json({ success: true, data: booking })
  } catch (error: any) {
    console.error('Error creating booking:', error)
    return NextResponse.json({ error: true, message: error.message })
  }
}

export async function PATCH(request: NextRequest, nextResponse: NextResponse) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json(
      { error: true, message: 'Unauthenticated' },
      { status: 401 }
    )
  }

  const booking = await request.json()

  try {
    await prisma.booking.update({
      where: {
        id: booking.id,
      },
      data: {
        selectedTimeSlot: booking.selectedTimeSlot,
        selectedDate: booking.selectedDate,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: true, message: error })
  }
}
