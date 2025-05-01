export const getProgressString = (n: number): string => {
  const step = ((n - 1) % 5) + 1 // így 5 helyett nem 0 jön ki
  return `${step}/5`
}
