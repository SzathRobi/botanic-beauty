// This serializes booking mutations in one server process. Cross-instance locking
// requires shared database/infrastructure coordination and is intentionally separate.
// Next.js can load the same helper in separate route bundles; share their queue.
const lockState = globalThis as typeof globalThis & {
  bookingMutationLocks?: Map<string, Promise<void>>
}
const pendingBookings = (lockState.bookingMutationLocks ??= new Map<
  string,
  Promise<void>
>())

export const withGuestBookingLock = async <T>(
  key: string,
  action: () => Promise<T>
): Promise<T> => {
  const previous = pendingBookings.get(key) ?? Promise.resolve()
  let release!: () => void
  const current = new Promise<void>((resolve) => {
    release = resolve
  })
  pendingBookings.set(key, current)
  await previous
  try {
    return await action()
  } finally {
    release()
    if (pendingBookings.get(key) === current) pendingBookings.delete(key)
  }
}
