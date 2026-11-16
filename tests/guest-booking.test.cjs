// Run with: node --test tests/guest-booking.test.cjs
// Application modules are compiled in memory; database/email calls are mocked.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')
const vm = require('node:vm')
const ts = require('typescript')

const root = path.resolve(__dirname, '..')
const fixedNow = new Date('2026-11-14T07:00:00Z')
class Clock extends Date {
  constructor(...args) {
    super(...(args.length ? args : [fixedNow.getTime()]))
  }
  static now() {
    return fixedNow.getTime()
  }
}

function loader(mocks = {}) {
  const cache = new Map()
  function load(file) {
    file = path.resolve(root, file)
    if (cache.has(file)) return cache.get(file)
    const exports = {}
    cache.set(file, exports)
    const javascript = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      fileName: file,
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText
    const localRequire = (name) => {
      if (Object.hasOwn(mocks, name)) return mocks[name]
      if (name.startsWith('@/') || name.startsWith('.')) {
        const base = name.startsWith('@/')
          ? path.join(root, 'src', name.slice(2))
          : path.resolve(path.dirname(file), name)
        const resolved = [base, base + '.ts', base + '.tsx'].find(
          (candidate) =>
            fs.existsSync(candidate) && fs.statSync(candidate).isFile()
        )
        if (resolved) return load(resolved)
      }
      return require(name)
    }
    vm.runInNewContext(
      javascript,
      {
        exports,
        require: localRequire,
        Date: Clock,
        URLSearchParams,
        process: {
          env: { IS_BOOKING_AVAILABLE: 'true', NODE_ENV: 'production' },
        },
        console: { error() {}, warn() {}, log() {} },
      },
      { filename: file }
    )
    return exports
  }
  return load
}

const plain = (value) => JSON.parse(JSON.stringify(value))
const availability = loader()('src/lib/guest-booking.ts')
const openingHours = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
].map((day) => ({
  day,
  isOpen: true,
  openingHour: '10:00',
  closingHour: '19:00',
}))
const options = (overrides = {}) => ({
  bookings: [],
  openingHours,
  specialOpeningHours: [],
  offDays: [],
  hairdresser: 'Timi',
  duration: 30,
  now: fixedNow,
  ...overrides,
})
const body = (overrides = {}) => ({
  service: { id: '1', name: 'Untrusted client name', price: 1, duration: 1 },
  extraServices: [],
  hairdresser: 'Timi',
  selectedDate: '2026-11-16',
  selectedTimeSlot: '10:00 - 10:30',
  contactInfo: {
    name: 'Teszt Vendég',
    email: 'guest@example.invalid',
    phone: '+36701234567',
    otherInfo: null,
  },
  ...overrides,
})

test('date keys support old guest/admin formats without moving the salon day', () => {
  for (const value of [
    '2026-1-5',
    '2026-01-05',
    '2026-01-04T23:00:00.000Z',
    'Mon Jan 05 2026 00:00:00 GMT+0100',
  ]) {
    assert.equal(availability.getBookingDateKey(value), '2026-01-05')
  }
  assert.equal(availability.getBookingDateKey('2026-2-30'), null)
  assert.equal(availability.getBookingDateKey('invalid'), null)
})

test('availability respects overlapping bookings but permits adjacent appointments', () => {
  const slots = availability.getAvailableTimeSlots(
    '2026-11-16',
    options({
      bookings: [
        {
          selectedDate: '2026-11-15T23:00:00.000Z',
          selectedTimeSlot: '10:30 - 11:00',
          hairdresser: 'Timi',
        },
      ],
    })
  )
  assert.ok(slots.includes('10:00 - 10:30'))
  assert.ok(!slots.includes('10:15 - 10:45'))
  assert.ok(!slots.includes('10:30 - 11:00'))
  assert.ok(slots.includes('11:00 - 11:30'))
})

test('another hairdresser does not block the selected hairdresser', () => {
  assert.ok(
    availability
      .getAvailableTimeSlots(
        '2026-11-16',
        options({
          bookings: [
            {
              selectedDate: '2026-11-16',
              selectedTimeSlot: '10:00 - 11:00',
              hairdresser: 'nem_Timi',
            },
          ],
        })
      )
      .includes('10:00 - 10:30')
  )
})

test('special closures and off days prevent booking', () => {
  assert.equal(
    availability.getAvailableTimeSlots(
      '2026-11-16',
      options({
        specialOpeningHours: [
          {
            date: new Date('2026-11-15T23:00:00Z'),
            isOpen: false,
            openingHour: '10:00',
            closingHour: '19:00',
          },
        ],
      })
    ).length,
    0
  )
  assert.equal(
    availability.getAvailableTimeSlots(
      '2026-11-16',
      options({
        offDays: [{ date: new Date('2026-11-15T23:00:00Z'), person: 'Timi' }],
      })
    ).length,
    0
  )
})

test('special opening hours override weekly closures including closing minutes', () => {
  const slots = availability.getAvailableTimeSlots(
    '2026-11-16',
    options({
      openingHours: [],
      specialOpeningHours: [
        {
          date: new Date('2026-11-16T00:00:00Z'),
          isOpen: true,
          openingHour: '18:00',
          closingHour: '19:30',
        },
      ],
    })
  )
  assert.equal(slots.at(-1), '19:00 - 19:30')
})

test('today remains bookable with a two-hour lead and correct quarter rounding', () => {
  assert.equal(
    availability.getAvailableTimeSlots(
      '2026-11-14',
      options({ now: new Date('2026-11-14T09:00:00Z') })
    )[0],
    '12:00 - 12:30'
  )
  assert.equal(
    availability.getAvailableTimeSlots(
      '2026-11-14',
      options({ now: new Date('2026-11-14T09:00:01Z') })
    )[0],
    '12:15 - 12:45'
  )
  assert.equal(
    availability.getAvailableTimeSlots('2026-11-13', options()).length,
    0
  )
})

test('an entirely closed calendar terminates and an available date can cross months', () => {
  assert.equal(
    availability.findNextAvailableDate(
      '2026-11-14',
      options({ openingHours: [] })
    ),
    null
  )
  assert.equal(availability.findNextAvailableDate('invalid', options()), null)
  assert.equal(
    availability.findNextAvailableDate(
      '2026-11-30',
      options({
        openingHours: [],
        specialOpeningHours: [
          {
            date: new Date('2026-12-01T00:00:00Z'),
            isOpen: true,
            openingHour: '10:00',
            closingHour: '19:00',
          },
        ],
      })
    ),
    '2026-12-01'
  )
})

test('guest reminder instants use Budapest summer and winter offsets', () => {
  assert.equal(
    availability.getGuestBookingStart(body()).toISOString(),
    '2026-11-16T09:00:00.000Z'
  )
  assert.equal(
    availability
      .getGuestBookingStart(body({ selectedDate: '2026-7-16' }))
      .toISOString(),
    '2026-07-16T08:00:00.000Z'
  )
  assert.equal(
    availability.getGuestReminderDelay(
      body(),
      new Date('2026-11-16T01:00:00Z')
    ),
    21600
  )
  assert.equal(
    availability.getGuestReminderDelay(
      body(),
      new Date('2026-11-16T06:00:00Z')
    ),
    null
  )
})

test('Google calendar links keep the salon timezone explicitly', () => {
  const { generateGoogleCalendarLink } = loader()(
    'src/app/api/email/utils/generateGoogleCalendarLink.util.ts'
  )
  const link = new URL(generateGoogleCalendarLink(body()))
  assert.equal(link.searchParams.get('ctz'), 'Europe/Budapest')
  assert.equal(
    link.searchParams.get('dates'),
    '20261116T100000/20261116T103000'
  )
})

function routeHarness(initial = [], overrides = {}) {
  const state = { bookings: [...initial], notifications: [], queries: [] }
  const db = {
    salon: {
      findUnique: async () => ({ openingHours, specialOpeningHours: [] }),
    },
    schedule: { findFirst: async () => ({ offDays: [] }) },
    booking: {
      findMany: async ({ select }) => {
        state.queries.push(select)
        return state.bookings.map((booking) =>
          Object.fromEntries(
            Object.keys(select).map((key) => [key, booking[key]])
          )
        )
      },
      create: async ({ data }) => {
        const booking = { id: 'booking-' + state.bookings.length, ...data }
        state.bookings.push(booking)
        return booking
      },
    },
  }
  Object.assign(db, overrides)
  const load = loader({
    'next/server': {
      NextResponse: {
        json: (data, init) => ({
          data,
          status: init?.status ?? 200,
          headers: init?.headers,
        }),
      },
    },
    '@/auth': {
      auth: async () => {
        throw new Error('Guest booking must not call admin auth')
      },
    },
    '@/lib/db': { __esModule: true, default: db },
    '@/lib/guest-booking-notifications': {
      notifyGuestBooking: async (booking) => {
        state.notifications.push(booking.id)
        return { verificationEmailSent: false, reminderScheduled: false }
      },
    },
  })
  return { state, route: load('src/app/api/booking/route.ts'), load }
}
const request = (data) => ({ json: async () => data })

test('only one same-instance concurrent request wins a contested slot', async () => {
  const { state, route } = routeHarness()
  const results = await Promise.all([
    route.POST(request(body())),
    route.POST(request(body())),
  ])
  assert.deepEqual(results.map((result) => result.status).sort(), [200, 409])
  assert.equal(state.bookings.length, 1)
  assert.equal(state.notifications.length, 1)
})

test('server rejects collisions with legacy ISO admin bookings', async () => {
  const { state, route } = routeHarness([
    { ...body(), selectedDate: '2026-11-15T23:00:00.000Z' },
  ])
  assert.equal((await route.POST(request(body()))).status, 409)
  assert.equal(state.notifications.length, 0)
})

test('canonical service values are stored and email failure does not undo booking', async () => {
  const { state, route } = routeHarness()
  const response = await route.POST(request(body()))
  assert.equal(response.status, 200)
  assert.equal(state.bookings.length, 1)
  assert.equal(state.bookings[0].service.duration, 30)
  assert.equal(state.bookings[0].service.price, 4500)
  assert.equal(response.data.notifications.verificationEmailSent, false)
})

test('invalid payloads and impossible appointment times never create a booking', async () => {
  for (const payload of [
    null,
    {},
    body({ contactInfo: null }),
    body({ contactInfo: { name: ' ', email: 'invalid', phone: '000' } }),
    body({ selectedDate: '2026-2-30' }),
    body({ selectedDate: '2020-1-1' }),
    body({ selectedTimeSlot: '03:00 - 03:01' }),
    body({ extraServices: [{ id: '1' }, { id: '1' }] }),
  ]) {
    const { state, route } = routeHarness()
    assert.equal((await route.POST(request(payload))).status, 400)
    assert.equal(state.bookings.length, 0)
    assert.equal(state.notifications.length, 0)
  }
})

test('missing salon configuration fails closed', async () => {
  const { route } = routeHarness([], {
    schedule: { findFirst: async () => null },
  })
  assert.equal((await route.POST(request(body()))).status, 503)
})

test('availability refresh exposes only occupancy data and is not cacheable', async () => {
  const { state, route } = routeHarness([
    { id: 'private-id', ...body(), finalPrice: 10000 },
  ])
  const response = await route.GET()
  assert.deepEqual(Object.keys(response.data.data[0]).sort(), [
    'hairdresser',
    'selectedDate',
    'selectedTimeSlot',
  ])
  assert.equal(response.headers['Cache-Control'], 'no-store')
  assert.deepEqual(plain(state.queries[0]), {
    selectedDate: true,
    selectedTimeSlot: true,
    hairdresser: true,
  })
})

test('legacy guest email endpoints remain compatible without sending or scheduling', async () => {
  const { load } = routeHarness()
  for (const file of [
    'src/app/api/email/verification/route.ts',
    'src/app/api/email/schedule/route.ts',
  ]) {
    assert.equal((await load(file).POST()).data.success, true)
  }
})

test('notification handler detects provider errors and cancels untracked reminder jobs', async () => {
  const deleted = []
  let published
  const load = loader({
    resend: {
      Resend: class {
        emails = {
          send: async () => ({ error: { message: 'Rejected email' } }),
        }
      },
    },
    '@upstash/qstash': {
      Client: class {
        messages = { delete: async (id) => deleted.push(id) }
        publishJSON = async (value) => {
          published = value
          return { messageId: 'reminder-job' }
        }
      },
    },
    '@/emails/VerificationEmail': { VerificationEmail: () => null },
    '@/lib/db': {
      __esModule: true,
      default: {
        booking: {
          update: async () => {
            throw new Error('Database update failed')
          },
        },
      },
    },
  })
  const result = await load(
    'src/lib/guest-booking-notifications.ts'
  ).notifyGuestBooking({ id: 'saved-booking', ...body() })
  assert.deepEqual(plain(result), {
    verificationEmailSent: false,
    reminderScheduled: false,
  })
  assert.equal(Number.isFinite(published.delay), true)
  assert.equal(published.body.selectedDate, '2026-11-16')
  assert.deepEqual(deleted, ['reminder-job'])
})

test('request queue releases its lock after a failed save', async () => {
  const { withGuestBookingLock } = loader()('src/lib/guest-booking-lock.ts')
  const first = withGuestBookingLock('same-day', async () => {
    throw new Error('Expected failure')
  })
  const second = withGuestBookingLock('same-day', async () => 'released')
  await assert.rejects(first, /Expected failure/)
  assert.equal(await second, 'released')
})

function hookRenderer() {
  const state = []
  let cursor = 0
  return {
    hooks: {
      useState(initial) {
        const index = cursor++
        if (!(index in state))
          state[index] = typeof initial === 'function' ? initial() : initial
        return [
          state[index],
          (value) => {
            state[index] =
              typeof value === 'function' ? value(state[index]) : value
          },
        ]
      },
      useRef(initial) {
        const index = cursor++
        if (!(index in state)) state[index] = { current: initial }
        return state[index]
      },
      useMemo: (compute) => compute(),
      useEffect() {},
    },
    render(Component, props) {
      cursor = 0
      return Component(props)
    },
  }
}

function findElement(node, predicate) {
  if (!node || typeof node !== 'object') return null
  if (predicate(node)) return node
  for (const child of [node.props?.children].flat(Infinity)) {
    const match = findElement(child, predicate)
    if (match) return match
  }
  return null
}

test('guest calendar clears stale slots and permits selecting today', () => {
  const renderer = hookRenderer()
  const changed = []
  const load = loader({
    react: renderer.hooks,
    './AvailableDatesForm.override.css': {},
    'react-day-picker': { DayPicker: 'DayPicker' },
    '@/components/Button': { Button: 'button' },
  })
  const Component = load(
    'src/app/idopontfoglalas/components/AvailableDatesForm.tsx'
  ).default
  const tree = renderer.render(Component, {
    bookings: [],
    selectedDate: new Date(2026, 10, 16),
    selectedTimeSlot: '10:00 - 11:00',
    setSelectedDate: (date) => changed.push(['date', date]),
    setSelectedTimeSlot: (slot) => changed.push(['slot', slot]),
    selectedService: { duration: 30 },
    selectedExtraServices: [],
    selectedHairdresser: 'Timi',
    schedule: { offDays: [] },
    isBookingConfigured: true,
    openingHours,
    specialOpeningHours: [],
    incrementActiveStep() {},
    decrementActiveStep() {},
  })
  const calendar = findElement(tree, (node) => node.type === 'DayPicker')
  assert.equal(calendar.props.disabled(new Date(2026, 10, 14)), false)
  const next = findElement(
    tree,
    (node) => node.type === 'button' && node.props.children === 'Tovább'
  )
  assert.equal(next.props.disabled, true)
  calendar.props.onSelect(new Date(2026, 10, 17))
  assert.deepEqual(
    changed.map(([field]) => field),
    ['slot', 'date']
  )
  assert.equal(changed[0][1], null)
})

test('guest contact submission prevents double clicks and recovers after a failed save', async () => {
  const renderer = hookRenderer()
  let submitted = 0
  let advanced = 0
  let complete
  const errors = []
  const values = body().contactInfo
  const load = loader({
    react: renderer.hooks,
    'react-hook-form': {
      useForm: () => ({
        handleSubmit: (callback) => callback,
        getValues: () => values,
      }),
    },
    '@hookform/resolvers/zod': { zodResolver() {} },
    'react-hot-toast': {
      __esModule: true,
      default: { error: (message) => errors.push(message) },
    },
    '@/components/Button': { Button: 'button' },
    '@/components/ui/Form': { Form: 'Form', FormField: 'FormField' },
    '@/components/ui/Input': {},
    '@/components/ui/TextArea': {},
  })
  const Component = load(
    'src/app/idopontfoglalas/components/ContactForm.tsx'
  ).default
  const props = {
    contactInfo: values,
    saveContactInfo() {},
    decrementActiveStep() {},
    incrementActiveStep: () => advanced++,
    submitBooking: async () => {
      submitted++
      await new Promise((resolve) => {
        complete = resolve
      })
    },
  }
  let tree = renderer.render(Component, props)
  const submit = findElement(tree, (node) => node.type === 'form').props
    .onSubmit
  const first = submit(values)
  await submit(values)
  assert.equal(submitted, 1)
  tree = renderer.render(Component, props)
  assert.equal(
    findElement(
      tree,
      (node) => node.type === 'button' && node.props.children === 'Foglalás'
    ).props.disabled,
    true
  )
  complete()
  await first
  assert.equal(advanced, 1)

  tree = renderer.render(Component, {
    ...props,
    submitBooking: async () => {
      throw new Error('Unavailable slot')
    },
  })
  await findElement(tree, (node) => node.type === 'form').props.onSubmit(values)
  tree = renderer.render(Component, props)
  assert.equal(
    findElement(
      tree,
      (node) => node.type === 'button' && node.props.children === 'Foglalás'
    ).props.disabled,
    false
  )
  assert.equal(advanced, 1)
  assert.equal(errors.length, 1)
})

test('extra service checkboxes use the saved selection after remounting', () => {
  const load = loader({
    '@/lib/utils': { formatDuration: (duration) => duration + ' perc' },
  })
  const Component = load(
    'src/app/idopontfoglalas/components/ExtraServiceCard.tsx'
  ).default
  const tree = Component({
    extraService: { id: '1', name: 'Hajvágás', duration: 30 },
    isExtraServiceSelected: true,
    selectExtraService() {},
    removeExtraService() {},
  })
  assert.equal(
    findElement(tree, (node) => node.type === 'input').props.checked,
    true
  )
})

test('going back to services does not duplicate a previously selected extra', () => {
  const renderer = hookRenderer()
  const componentNames = [
    'ServicesForm',
    'AvailableDatesForm',
    'ContactForm',
    'HairdresserForm',
    'Stepper',
    'SummaryForm',
  ]
  const mocks = {
    react: renderer.hooks,
    'framer-motion': { motion: { div: 'div' } },
    '@/components/BackgroundBlur': {
      __esModule: true,
      default: 'BackgroundBlur',
    },
  }
  for (const name of componentNames)
    mocks['./' + name] = { __esModule: true, default: name }
  const Component = loader(mocks)(
    'src/app/idopontfoglalas/components/MultiStepForm.tsx'
  ).default
  const props = {
    bookings: [],
    schedule: { offDays: [] },
    serviceId: '13',
    openingHours,
    specialOpeningHours: [],
  }
  const renderServices = () =>
    findElement(
      renderer.render(Component, props),
      (node) => node.type === 'ServicesForm'
    )
  const extra = { id: '1', duration: 30 }
  renderServices().props.selectExtraService(extra)
  renderServices().props.selectExtraService(extra)
  assert.equal(renderServices().props.selectedExtraServices.length, 1)
})

test('successful notifications store the reminder ID on the existing booking', async () => {
  const updates = []
  const sent = []
  const load = loader({
    resend: {
      Resend: class {
        emails = {
          send: async (value) => {
            sent.push(value)
            return { data: { id: 'email-id' }, error: null }
          },
        }
      },
    },
    '@upstash/qstash': {
      Client: class {
        publishJSON = async () => ({ messageId: 'reminder-id' })
      },
    },
    '@/emails/VerificationEmail': { VerificationEmail: () => null },
    '@/lib/db': {
      __esModule: true,
      default: { booking: { update: async (value) => updates.push(value) } },
    },
  })
  const result = await load(
    'src/lib/guest-booking-notifications.ts'
  ).notifyGuestBooking({ id: 'existing-booking', ...body() })
  assert.deepEqual(plain(result), {
    verificationEmailSent: true,
    reminderScheduled: true,
  })
  assert.equal(sent[0].to, 'guest@example.invalid')
  assert.deepEqual(plain(updates), [
    {
      where: { id: 'existing-booking' },
      data: { remindenEmailJobId: 'reminder-id' },
    },
  ])
})
