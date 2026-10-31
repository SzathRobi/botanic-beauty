import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { Page } from '@/components/Page'
import { SALON_ID } from '@/constants/salon.constants'
import prisma from '@/lib/db'

import OpeningHoursContainer from './components/openingHoursContainer/OpeningHoursContainer'
import { createInitialOpeningHours } from './utils/create-initial-opening-hours.util'

const SalonOpeningHoursPage = async () => {
  const session = await auth()

  if (!session?.user) {
    redirect('/admin/bejelentkezes')
  }

  const salon = await prisma.salon.findUnique({
    where: {
      id: SALON_ID,
    },
    select: {
      openingHours: true,
      specialOpeningHours: true,
      id: true,
    },
  })

  if (!salon) redirect('/admin/foglalasok')

  if (!salon.openingHours || salon.openingHours.length === 0) {
    const openingHours = await createInitialOpeningHours(salon.id)
    salon.openingHours = openingHours
  }

  return (
    <Page title="Nyitvatartási idő" hasTitleLeftMarginOnMobile>
      <OpeningHoursContainer
        salonOpeningHours={salon.openingHours}
        salonSpecialOpeningHours={salon.specialOpeningHours}
        salonId={salon.id}
      />
    </Page>
  )
}

export default SalonOpeningHoursPage
