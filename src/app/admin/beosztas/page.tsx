import { redirect } from 'next/navigation'

import { getSchedule } from '@/actions/schedule'
import { auth } from '@/auth'
import BackgroundBlur from '@/components/BackgroundBlur'

import Schedules from './components/Schedules'

const AdminHairdresserSchedulePage = async () => {
  const session = await auth()

  if (!session?.user) {
    redirect('/admin/bejelentkezes')
  }

  const schedule = await getSchedule()

  return (
    <div className="min-h-[calc(100vh-80px)] w-full lg:pt-14">
      <BackgroundBlur className="mx-auto !max-w-fit">
        <Schedules schedule={schedule} />
      </BackgroundBlur>
    </div>
  )
}

export default AdminHairdresserSchedulePage
