import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import prisma from '@/lib/db'

import CustomersContainer from './components/CustomersContainer'

const CustomersPage = async () => {
  const session = await auth()

  if (!session?.user)
    redirect('/admin/bejelentkezes?callbackUrl=/admin/ugyfelek')

  const customers = await prisma.customer.findMany()

  return (
    <div className="mb-10">
      <CustomersContainer salonCustomers={customers} />
    </div>
  )
}

export default CustomersPage
