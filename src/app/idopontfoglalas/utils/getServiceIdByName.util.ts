import { SearchParamService } from '../types/searchParamService.type'

export const getServiceIdByName = (
  name: SearchParamService
): null | `${number}` => {
  if (name === 'noi-hajvagas') return '6'

  if (name === 'ferfi-hajvagas') return '8'

  if (name === 'hajgondorites') return '4'

  if (name === 'tofestes') return '13'

  if (name === 'toszokites') return '14'

  if (name === 'hajfestes') return '15'

  if (name === 'szinfelfrissites') return '16'

  if (name === 'balayage-ombre') return '18'

  if (name === 'szokites-szinkorrekcio') return '21'

  return null
}
