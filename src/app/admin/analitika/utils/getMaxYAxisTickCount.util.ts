export const getMaxYAxisTickCount = (
  items: any[],
  property: string
): number => {
  if (items.length === 0) return 0

  return Math.max(...items.map((item) => item[property])) + 1
}
