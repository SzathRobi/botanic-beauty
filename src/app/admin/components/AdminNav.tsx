import { auth } from '@/auth'

import AdminNavList from './AdminNavList'

const AdminNav = async () => {
  const session = await auth()

  if (!session?.user) return null

  return (
    <div className="fixed bottom-0 left-0 z-20 w-full md:relative md:w-fit">
      <AdminNavList />
    </div>
  )
}

export default AdminNav
