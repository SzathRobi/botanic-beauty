import { redirect } from 'next/navigation'

import { getCustomers } from '@/actions/customer.action'
import { auth } from '@/auth'

import CustomersContainer from './components/CustomersContainer'

const CustomersPage = async () => {
  const session = await auth()

  if (!session?.user)
    redirect('/admin/bejelentkezes?callbackUrl=/admin/ugyfelek')

  const customers = await getCustomers()

  return (
    <div className="mb-10">
      <CustomersContainer salonCustomers={customers} />
    </div>
  )
}

export default CustomersPage
