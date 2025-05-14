import 'react-day-picker/dist/style.css'

import { ReactNode } from 'react'

import AdminNav from './components/AdminNav'

type AdminLayoutProps = {
  children: ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="dark flex min-h-screen flex-col-reverse gap-4 pb-10 pt-20 sm:gap-0 md:flex-row md:pb-0 md:pt-16">
      <AdminNav />
      <div className="flex-1 px-2 pt-4 lg:pt-16 2xl:pt-10">{children}</div>
    </div>
  )
}

export default AdminLayout
