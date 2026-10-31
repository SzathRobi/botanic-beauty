import { SpecialOpeningHour } from '@prisma/client'
import { format } from 'date-fns'

export function areDatesUnique(hours: SpecialOpeningHour[]): boolean {
  const seen = new Set<string>()
  for (const hour of hours) {
    const formattedDate = format(hour.date, 'yyyy-MM-dd')
    if (seen.has(formattedDate)) {
      return false
    }
    seen.add(formattedDate)
  }
  return true
}
