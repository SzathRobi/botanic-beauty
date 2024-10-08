import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'

export const metadata: Metadata = {
  title: 'Botanic Beauty Hajszalon| Admin',
}

const AdminPage = async () => {
  const session = await auth()

  if (!session?.user) {
    redirect('/admin/bejelentkezes')
  }

  redirect('/admin/foglalasok')
}

export default AdminPage
