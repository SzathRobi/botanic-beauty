export const getI18nDay = (day: string, lang: 'en' | 'hu' = 'hu') => {
  if (lang === 'en') return day

  if (lang === 'hu') {
    if (day === 'Monday' || day === 'monday') return 'hétfő'

    if (day === 'Tuesday' || day === 'tuesday') return 'kedd'

    if (day === 'Wednesday' || day === 'wednesday') return 'szerda'

    if (day === 'Thursday' || day === 'thursday') return 'csütörtök'

    if (day === 'Friday' || day === 'friday') return 'péntek'

    if (day === 'Saturday' || day === 'saturday') return 'szombat'

    if (day === 'Sunday' || day === 'sunday') return 'vasárnap'
  }
}
