/* eslint-disable prettier/prettier */
import { SALON_ID } from '@/constants/salon.constants'
import prisma from '@/lib/db'

export const getSalon = async () => {
  try {
    return await prisma.salon.findUnique({
      where: { id: SALON_ID },
    })
  } catch (error: any) {
    console.log({ error })
    throw new Error(error.message || error)
  }
}
