import { SearchParamService } from '../types/searchParamService.type'

// TODO: mindet ellenőrizni
export const getServiceIdByName = (
  name: SearchParamService
): null | `${number}` => {
  if (name === 'noi-hajvagas') return '6'

  if (name === 'ferfi-hajvagas') return '8'

  if (name === 'hajfestes') return '15'

  if (name === 'ombre-hajfestes') return '18'

  if (name === 'balayage-hajfestes') return '18'

  // TODO: ez tuti rossz
  if (name === 'hajapolas') return '16'

  if (name === 'keratinos-hajkezeles') return '17'

  if (name === 'szokites') return '19'

  if (name === 'hajkiegyenesites') return '3'

  if (name === 'hajgondorites') return '3'

  if (name === 'frufru-vagas') return '7'

  return null
}
