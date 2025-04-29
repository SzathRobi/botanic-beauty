import prisma from '@/lib/db'

export const getCustomers = async () => {
  try {
    return await prisma.customer.findMany()
  } catch (error: any) {
    console.log({ error })
    throw new Error(error.message || error)
  }
}
