// On initial mount, move the document to the current time after layout settles.
// Navigation, filtering and later booking updates must not move the page again.
export const startCalendarAutoScroll = (
  root: HTMLElement,
  getTime: () => Date
) => {
  const page = root.ownerDocument.defaultView
  const gutter = root.querySelector<HTMLElement>('.rbc-time-gutter')
  if (!page || !gutter) return () => undefined

  let stopped = false
  let frame: number | undefined
  let lastPosition: string | undefined
  let observer: ResizeObserver | undefined
  const interactionEvents = [
    'wheel',
    'touchstart',
    'pointerdown',
    'keydown',
  ] as const

  const stop = () => {
    stopped = true
    if (frame !== undefined) page.cancelAnimationFrame(frame)
    observer?.disconnect()
    page.removeEventListener('load', schedule)
    for (const event of interactionEvents) page.removeEventListener(event, stop)
  }
  const schedule = () => {
    if (stopped || frame !== undefined) return
    frame = page.requestAnimationFrame(() => {
      frame = undefined
      if (stopped || root.ownerDocument.readyState !== 'complete') return

      const time = getTime()
      if (!Number.isFinite(time.getTime())) return stop()
      const hour = gutter.querySelectorAll<HTMLElement>('.rbc-timeslot-group')[
        time.getHours()
      ]
      const rect = hour?.getBoundingClientRect()
      if (!rect || rect.height <= 0) {
        lastPosition = undefined
        return
      }
      const headerHeight =
        root.ownerDocument.querySelector('header')?.getBoundingClientRect()
          .height ?? 0
      const top = Math.max(
        0,
        page.scrollY +
          rect.top +
          (rect.height * time.getMinutes()) / 60 -
          headerHeight -
          24
      )
      const position = `${top}:${rect.height}`
      if (position !== lastPosition) {
        lastPosition = position
        schedule()
        return
      }
      stop()
      page.scrollTo({ top, behavior: 'auto' })
    })
  }

  for (const event of interactionEvents)
    page.addEventListener(event, stop, { passive: true })
  page.addEventListener('load', schedule)
  if (typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(schedule)
    observer.observe(root)
    observer.observe(gutter)
  }
  schedule()
  return stop
}
