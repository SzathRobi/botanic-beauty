import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60) // Órák számának kiszámítása
  const remainingMinutes = minutes % 60 // Megmaradt percek számának kiszámítása

  if (hours === 0) {
    return `${remainingMinutes} perc` // Ha nincs óra, csak a percek jelennek meg
  }

  if (remainingMinutes === 0) {
    return `${hours} óra` // Ha nincs megmaradt perc, csak az óra jelenik meg
  }

  return `${hours} óra ${remainingMinutes} perc` // Minden más esetben az óra és a perc jelenik meg
}
