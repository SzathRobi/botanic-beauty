import type { SpecialOpeningHour } from '@prisma/client'

import { type CollectionConfig } from './collection-model'

export const specialHoursCollection: CollectionConfig<SpecialOpeningHour> = {
  label: 'Speciális nyitvatartások',
  getId: (h) => new Date(h.date).toISOString(),
  searchPlaceholder: 'Dátum vagy nyitvatartás…',
  search: (h) => [
    new Date(h.date).toLocaleDateString('hu-HU'),
    new Date(h.date).toISOString().slice(0, 10),
    h.openingHour,
    h.closingHour,
    h.isOpen ? 'nyitva' : 'zárva',
  ],
  sorts: [{ id: 'date', label: 'Dátum', value: (h) => new Date(h.date) }],
  defaultSort: 'date:asc',
  filters: [
    {
      id: 'status',
      label: 'Nyitvatartás',
      value: (h) => (h.isOpen ? 'open' : 'closed'),
      options: [
        { value: 'open', label: 'Nyitva' },
        { value: 'closed', label: 'Zárva' },
      ],
    },
  ],
}
