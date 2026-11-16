import type { TService } from '@prisma/client'

import { getGuestServiceDuration, timeToMinutes } from '@/lib/guest-booking'

export const calculateBookingEndTime = (
  startTime: string,
  service: TService,
  extras: TService[]
) => {
  const start = timeToMinutes(startTime)
  if (start === null) return ''
  const end = start + getGuestServiceDuration(service, extras)
  if (end >= 24 * 60 || end <= start) return ''
  return `${String(Math.floor(end / 60)).padStart(2, '0')}:${String(end % 60).padStart(2, '0')}`
}
