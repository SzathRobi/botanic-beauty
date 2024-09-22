import { Booking } from '@prisma/client'

import prisma from '@/lib/db'

export const createBooking = async (booking: Booking) => {
  return await prisma.booking.create({
    data: booking,
  })
}

export const modifyBooking = async (booking: Booking) => {
  return await prisma.booking.update({
    where: {
      id: booking.id,
    },
    data: booking,
  })
}

export const getBookings = async () => {
  try {
    return await prisma.booking.findMany()
  } catch (error: any) {
    console.log({ error })
    throw new Error(error.message || error)
  }
}
