// This serializes guest requests in one server instance. Cross-instance locking
// requires shared database/infrastructure coordination and is intentionally separate.
const pendingBookings = new Map<string, Promise<void>>()

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
