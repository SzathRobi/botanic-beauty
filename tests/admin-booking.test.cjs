// Run with node --test tests/admin-booking.test.cjs
// Local DB integration: set RUN_LOCAL_DB_TESTS=1 before running.
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

function loader(mocks = {}, globals = {}) {
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
        ...globals,
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
  isOpen: !['saturday', 'sunday'].includes(day),
  openingHour: '10:00',
  closingHour: '19:00',
}))
const service = {
  id: '1',
  name: 'Mosás + Szárítás (rövid, váll feletti hossz)',
  duration: 30,
  price: 4500,
  category: 'Szárítás - Styling',
}
const fixture = (overrides = {}) => ({
  id: 'one',
  service,
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
  createdAt: fixedNow,
  updatedAt: fixedNow,
  finalPrice: 9000,
  isFinanceDone: true,
  remindenEmailJobId: null,
  ...overrides,
})
const request = (value) => ({ json: async () => value })
const context = (id = 'one') => ({ params: Promise.resolve({ id }) })

function harness({
  bookings = [fixture()],
  user = { name: 'Test admin' },
  db: actualDb,
  updateFails = false,
  deleteFails = false,
} = {}) {
  const state = {
    bookings: [...bookings],
    sequence: [],
    offDays: [],
    specialOpeningHours: [],
  }
  const db = actualDb ?? {
    salon: {
      findUnique: async () => ({
        openingHours,
        specialOpeningHours: state.specialOpeningHours,
      }),
    },
    schedule: { findFirst: async () => ({ offDays: state.offDays }) },
    booking: {
      findUnique: async ({ where }) =>
        state.bookings.find((booking) => booking.id === where.id) ?? null,
      findMany: async () => [...state.bookings],
      update: async ({ where, data }) => {
        if (updateFails) throw new Error('Expected database failure')
        state.sequence.push('update')
        const saved = {
          ...state.bookings.find((booking) => booking.id === where.id),
          ...data,
        }
        state.bookings = state.bookings.map((booking) =>
          booking.id === where.id ? saved : booking
        )
        return saved
      },
      delete: async ({ where }) => {
        if (deleteFails) throw new Error('Expected database failure')
        state.sequence.push('delete')
        state.bookings = state.bookings.filter(
          (booking) => booking.id !== where.id
        )
      },
    },
  }
  const load = loader({
    'next/server': {
      NextResponse: {
        json: (data, init) => ({ data, status: init?.status ?? 200 }),
      },
    },
    '@/lib/db': { __esModule: true, default: db },
    '@/auth': { auth: async () => (user ? { user } : null) },
    './admin-booking-notifications': {
      notifyAdminBookingChange: async (previous, booking) => {
        state.sequence.push('notify-change')
        return {
          booking,
          notifications: { emailSent: false, reminderUpdated: false },
        }
      },
      notifyAdminBookingDeletion: async () => {
        state.sequence.push('notify-delete')
        return { emailSent: false, reminderUpdated: false }
      },
    },
  })
  return { state, load, route: load('src/app/api/booking/[id]/route.ts') }
}

test('admin edit preserves ID, finance data and returns persisted values before notification', async () => {
  const { route, state } = harness()
  const response = await route.PATCH(
    request({
      selectedDate: '2026-11-16',
      selectedTimeSlot: '10:00 - 10:30',
      contactInfo: { ...fixture().contactInfo, name: 'Új név' },
    }),
    context()
  )
  assert.equal(response.status, 200)
  assert.equal(response.data.data.id, 'one')
  assert.equal(response.data.id, 'one')
  assert.equal(response.data.data.finalPrice, 9000)
  assert.equal(response.data.data.isFinanceDone, true)
  assert.equal(response.data.data.contactInfo.name, 'Új név')
  assert.deepEqual(state.sequence, ['update', 'notify-change'])
})

test('both admin endpoints reject occupied slots, including legacy ISO dates', async () => {
  const { route, load, state } = harness({
    bookings: [
      fixture(),
      fixture({
        id: 'two',
        selectedDate: '2026-11-15T23:00:00.000Z',
        selectedTimeSlot: '11:00 - 11:30',
      }),
    ],
  })
  const body = {
    id: 'one',
    selectedDate: '2026-11-16',
    selectedTimeSlot: '11:00 - 11:30',
  }
  assert.equal((await route.PATCH(request(body), context())).status, 409)
  assert.equal(
    (await load('src/app/api/booking/route.ts').PATCH(request(body))).status,
    409
  )
  assert.equal(state.sequence.length, 0)
})

test('adjacent appointments and another hairdresser are allowed', async () => {
  const { route } = harness({
    bookings: [
      fixture(),
      fixture({ id: 'two', selectedTimeSlot: '11:00 - 11:30' }),
      fixture({
        id: 'three',
        hairdresser: 'nem_Timi',
        selectedTimeSlot: '10:30 - 11:00',
      }),
    ],
  })
  assert.equal(
    (
      await route.PATCH(
        request({
          selectedDate: '2026-11-16',
          selectedTimeSlot: '10:30 - 11:00',
        }),
        context()
      )
    ).status,
    200
  )
})

test('admin can move to today without the guest two-hour rule, including closing boundary', async () => {
  const { route, state } = harness()
  state.specialOpeningHours = [
    {
      date: new Date('2026-11-14T00:00:00Z'),
      isOpen: true,
      openingHour: '07:00',
      closingHour: '19:00',
    },
  ]
  assert.equal(
    (
      await route.PATCH(
        request({
          selectedDate: '2026-11-14',
          selectedTimeSlot: '08:30 - 09:00',
        }),
        context()
      )
    ).status,
    200
  )
  assert.equal(
    (
      await route.PATCH(
        request({
          selectedDate: '2026-11-16',
          selectedTimeSlot: '18:30 - 19:00',
        }),
        context()
      )
    ).status,
    200
  )
})

test('admins may override opening hours and closed days while staff off days remain enforced', async () => {
  for (const slot of ['09:45 - 10:15', '20:00 - 20:30']) {
    const { route } = harness()
    assert.equal(
      (
        await route.PATCH(
          request({ selectedDate: '2026-11-16', selectedTimeSlot: slot }),
          context()
        )
      ).status,
      200
    )
  }
  const { route, state } = harness()
  state.offDays = [{ date: new Date('2026-11-16T23:00:00Z'), person: 'Timi' }]
  assert.equal(
    (
      await route.PATCH(
        request({
          selectedDate: '2026-11-17',
          selectedTimeSlot: '10:00 - 10:30',
        }),
        context()
      )
    ).status,
    400
  )
  state.offDays = []
  state.specialOpeningHours = [
    {
      date: new Date('2026-11-16T23:00:00Z'),
      isOpen: false,
      openingHour: '10:00',
      closingHour: '19:00',
    },
  ]
  assert.equal(
    (
      await route.PATCH(
        request({
          selectedDate: '2026-11-17',
          selectedTimeSlot: '20:00 - 20:30',
        }),
        context()
      )
    ).status,
    200
  )
  assert.equal(
    (
      await route.PATCH(
        request({
          selectedDate: '2026-11-21',
          selectedTimeSlot: '20:00 - 20:30',
        }),
        context()
      )
    ).status,
    200
  )
  assert.equal(
    (
      await route.PATCH(
        request({
          selectedDate: '2026-11-21',
          selectedTimeSlot: '23:45 - 00:15',
        }),
        context()
      )
    ).status,
    400
  )
})

test('opening-hour overrides never permit collisions', async () => {
  const { route } = harness({
    bookings: [
      fixture(),
      fixture({ id: 'late', selectedTimeSlot: '20:00 - 20:30' }),
    ],
  })
  assert.equal(
    (
      await route.PATCH(
        request({
          selectedDate: '2026-11-16',
          selectedTimeSlot: '20:00 - 20:30',
        }),
        context()
      )
    ).status,
    409
  )
})

test('special Saturday openings are supported', async () => {
  const { route, state } = harness()
  state.specialOpeningHours = [
    {
      date: new Date('2026-11-20T23:00:00Z'),
      isOpen: true,
      openingHour: '10:00',
      closingHour: '19:30',
    },
  ]
  assert.equal(
    (
      await route.PATCH(
        request({
          selectedDate: '2026-11-21',
          selectedTimeSlot: '19:00 - 19:30',
        }),
        context()
      )
    ).status,
    200
  )
})

test('contact-only changes remain possible for historical custom-length bookings', async () => {
  const { route } = harness({
    bookings: [
      fixture({ selectedDate: '2024-1-1', selectedTimeSlot: '10:00 - 10:45' }),
    ],
  })
  assert.equal(
    (
      await route.PATCH(
        request({
          selectedDate: '2024-1-1',
          selectedTimeSlot: '10:00 - 10:45',
          contactInfo: fixture().contactInfo,
        }),
        context()
      )
    ).status,
    200
  )
})

test('failed database changes never trigger notifications', async () => {
  const { route, state } = harness({ updateFails: true, deleteFails: true })
  assert.equal(
    (
      await route.PATCH(
        request({
          selectedDate: '2026-11-16',
          selectedTimeSlot: '10:00 - 10:30',
        }),
        context()
      )
    ).status,
    500
  )
  assert.equal((await route.DELETE(request({}), context())).status, 500)
  assert.equal(state.sequence.length, 0)
})

test('deletion succeeds even if notifications fail, and repeated deletion returns 404', async () => {
  const { route, state } = harness()
  const response = await route.DELETE(request({}), context())
  assert.equal(response.status, 200)
  assert.equal(response.data.notifications.emailSent, false)
  assert.deepEqual(state.sequence, ['delete', 'notify-delete'])
  assert.equal((await route.DELETE(request({}), context())).status, 404)
})

test('admin endpoints require login and safely parse awaited route params', async () => {
  const { route, state } = harness({ user: null })
  assert.equal((await route.PATCH(request({}), context())).status, 401)
  assert.equal((await route.DELETE(request({}), context())).status, 401)
  assert.equal(state.sequence.length, 0)
  const authenticated = harness().route
  assert.equal(
    (
      await authenticated.PATCH(
        {
          json: async () => {
            throw new Error('Malformed JSON')
          },
        },
        context()
      )
    ).status,
    400
  )
  assert.equal(
    (
      await authenticated.PATCH(
        request({
          selectedDate: '2026-11-16',
          selectedTimeSlot: '10:00 - 10:30',
        }),
        context('missing')
      )
    ).status,
    404
  )
})

test('calendar mapper round-trip keeps date, ID, zero amounts and false flags', () => {
  const load = loader()
  const { mapBookingToEvent } = load(
    'src/app/admin/mappers/mapBookingToEvent.mapper.ts'
  )
  const { mapEventToBooking } = load(
    'src/app/admin/mappers/mapEventToBooking.mapper.ts'
  )
  const event = mapBookingToEvent(
    fixture({
      selectedDate: '2026-11-15T23:00:00.000Z',
      finalPrice: 0,
      tips: 0,
      isPaidWithCard: false,
    })
  )
  assert.equal(event.start.getDate(), 16)
  assert.equal(event.start.getHours(), 10)
  assert.equal(event.finalPrice, 0)
  assert.equal(event.isPaidWithCard, false)
  assert.equal(mapEventToBooking(event).selectedDate, '2026-11-16')
  assert.equal(mapEventToBooking(event).id, 'one')
})

test('all extras are included in end time independently of order', () => {
  const { calculateBookingEndTime } = loader()(
    'src/app/admin/foglalasok/utils/bookingTime.ts'
  )
  assert.equal(
    calculateBookingEndTime('10:00', service, [
      { duration: 0 },
      { duration: 30 },
    ]),
    '11:00'
  )
  assert.equal(
    calculateBookingEndTime('10:00', { ...service, duration: 60 }, [
      { duration: 30 },
    ]),
    '11:30'
  )
  assert.equal(calculateBookingEndTime('', service, []), '')
  assert.equal(calculateBookingEndTime('23:45', service, []), '')
})

test('filtering after a drag keeps other hairdressers, and failed drags keep the original time', async () => {
  const renderer = hookRenderer()
  let fail = false
  const errors = []
  const load = loader({
    react: renderer.hooks,
    '@/components/BackgroundBlur': {},
    '../bigCalendar/BigCalendar': { __esModule: true, default: 'BigCalendar' },
    '../../utils/bookingApi': {
      updateBooking: async () => {
        if (fail) throw new Error('Occupied')
        return {
          data: fixture({ selectedTimeSlot: '12:00 - 12:30' }),
          notifications: {},
        }
      },
      getNotificationWarning: () => null,
    },
    'react-hot-toast': {
      __esModule: true,
      default: { error: (error) => errors.push(error), success() {} },
    },
  })
  const Component = load(
    'src/app/admin/foglalasok/components/bigCalendarContainer/BigCalendarContainer.tsx'
  ).default
  const props = {
    bookings: [fixture(), fixture({ id: 'two', hairdresser: 'nem_Timi' })],
    offDays: [],
    openingHours,
    specialOpeningHours: [],
    bookingsByEmail: {},
  }
  const render = () => renderer.render(Component, props)
  const calendar = () =>
    findElement(render(), (node) => node.type === 'BigCalendar')
  findElement(
    render(),
    (node) => node.type === 'input' && node.props.value === 'Timi'
  ).props.onChange({ target: { value: 'Timi' } })
  await calendar().props.onEventDrop({
    event: calendar().props.calendarEvents[0],
    start: new Date(2026, 10, 16, 12),
    end: new Date(2026, 10, 16, 12, 30),
  })
  findElement(
    render(),
    (node) => node.type === 'input' && node.props.value === 'all'
  ).props.onChange({ target: { value: 'all' } })
  assert.equal(calendar().props.calendarEvents.length, 2)
  assert.equal(calendar().props.calendarEvents[0].start.getHours(), 12)
  fail = true
  await calendar().props.onEventDrop({
    event: calendar().props.calendarEvents[0],
    start: new Date(2026, 10, 16, 13),
    end: new Date(2026, 10, 16, 13, 30),
  })
  assert.equal(calendar().props.calendarEvents[0].start.getHours(), 12)
  assert.equal(calendar().props.calendarEvents[0].isLoaderEvent, false)
  assert.equal(errors.length, 1)
  calendar().props.setCalendarEvents((previous) =>
    previous.filter((event) => event.id !== 'one')
  )
  findElement(
    render(),
    (node) => node.type === 'input' && node.props.value === 'Timi'
  ).props.onChange({ target: { value: 'Timi' } })
  findElement(
    render(),
    (node) => node.type === 'input' && node.props.value === 'all'
  ).props.onChange({ target: { value: 'all' } })
  assert.deepEqual(
    plain(calendar().props.calendarEvents.map((event) => event.id)),
    ['two']
  )
})

test('obsolete queued reminders skip deleted or moved bookings', async () => {
  let current = null
  let sends = 0
  const load = loader({
    'next/server': {
      NextResponse: {
        json: (data, init) => ({ data, status: init?.status ?? 200 }),
      },
    },
    '@upstash/qstash/nextjs': {
      verifySignatureAppRouter: (callback) => callback,
    },
    '@/lib/db': {
      __esModule: true,
      default: { booking: { findUnique: async () => current } },
    },
    '@/emails/ReminderEmail': { __esModule: true, default: () => null },
    resend: {
      Resend: class {
        emails = {
          send: async () => {
            sends++
            return { error: null }
          },
        }
      },
    },
  })
  const route = load('src/app/api/email/reminder/route.ts')
  assert.equal((await route.POST(request(fixture()))).data.skipped, true)
  current = fixture({ selectedTimeSlot: '11:00 - 11:30' })
  assert.equal((await route.POST(request(fixture()))).data.skipped, true)
  current = fixture()
  assert.equal((await route.POST(request(fixture()))).data.success, true)
  assert.equal(sends, 1)
})

test('admin form recalculates all extras and releases loading state after failed saves', async () => {
  const renderer = hookRenderer()
  const values = {
    hairdresser: 'Timi',
    service,
    extraServices: [
      { id: '2', name: 'Booster', duration: 0 },
      { id: '1', name: 'Haircut', duration: 30 },
    ],
    startTime: '10:00',
    endTime: '11:00',
    ...fixture().contactInfo,
  }
  let fail = true
  let closed = false
  let events = [fixture()]
  const load = loader({
    react: renderer.hooks,
    './BigCalendarEventForm.override.css': {},
    '@/components/ui/Checkbox': { Checkbox: 'Checkbox' },
    '@/components/ui/Separator': { Separator: 'Separator' },
    'react-day-picker': { DayPicker: 'DayPicker' },
    'react-hook-form': {
      useForm: () => ({
        handleSubmit: (callback) => callback,
        getValues: (key) => (key ? values[key] : values),
        setValue: (key, value) => {
          values[key] = value
        },
      }),
    },
    '@hookform/resolvers/zod': { zodResolver() {} },
    '@/components/Button': { Button: 'button' },
    '@/components/ui/Form': Object.fromEntries(
      [
        'Form',
        'FormField',
        'FormItem',
        'FormControl',
        'FormLabel',
        'FormMessage',
      ].map((name) => [name, name])
    ),
    '@/components/ui/Input': { Input: 'Input' },
    '@/components/ui/Select': Object.fromEntries(
      [
        'Select',
        'SelectContent',
        'SelectItem',
        'SelectTrigger',
        'SelectValue',
      ].map((name) => [name, name])
    ),
    '../../utils/bookingApi': {
      updateBooking: async () => {
        if (fail) throw new Error('Occupied')
        return {
          data: fixture({ remindenEmailJobId: 'fresh-job' }),
          notifications: {},
        }
      },
      getNotificationWarning: () => null,
    },
    'react-hot-toast': {
      __esModule: true,
      default: { error() {}, success() {} },
    },
  })
  const { mapBookingToEvent } = load(
    'src/app/admin/mappers/mapBookingToEvent.mapper.ts'
  )
  const Component = load(
    'src/app/admin/foglalasok/components/bigCalendarEventForm/BigCalendarEventForm.tsx'
  ).default
  const props = {
    calendarEvent: { event: mapBookingToEvent(fixture()) },
    setCalendarEvents: (update) => {
      events = update(events)
    },
    setIsDialogOpen: (value) => {
      closed = !value
    },
    offDays: [],
    openingHours,
    specialOpeningHours: [],
  }
  const render = () => renderer.render(Component, props)
  let tree = render()
  assert.equal(
    findElement(tree, (node) => node.type === 'DayPicker').props.disabled(
      new Date(2026, 10, 21)
    ),
    false
  )
  const startField = findElement(
    tree,
    (node) => node.type === 'FormField' && node.props.name === 'startTime'
  )
  const startInput = findElement(
    startField.props.render({
      field: {
        onChange: (value) => {
          values.startTime = value
        },
      },
    }),
    (node) => node.type === 'Input'
  )
  startInput.props.onChange({ target: { value: '11:00' } })
  assert.equal(values.endTime, '12:00')
  const serviceField = findElement(
    tree,
    (node) => node.type === 'FormField' && node.props.name === 'service'
  )
  const select = findElement(
    serviceField.props.render({ field: { value: service } }),
    (node) => node.type === 'Select'
  )
  select.props.onValueChange(
    load('src/constants/services.constants.ts').SERVICES[1].name
  )
  assert.equal(values.endTime, '12:15')
  await findElement(tree, (node) => node.type === 'form').props.onSubmit(values)
  tree = render()
  assert.equal(
    findElement(
      tree,
      (node) => node.type === 'button' && node.props.type === 'submit'
    ).props.disabled,
    false
  )
  assert.equal(closed, false)
  fail = false
  await findElement(tree, (node) => node.type === 'form').props.onSubmit(values)
  assert.equal(closed, true)
  assert.equal(events[0].id, 'one')
  assert.equal(events[0].remindenEmailJobId, 'fresh-job')
})

test('reminder rescheduling handles missing jobs, provider rejection and fresh persisted IDs', async () => {
  for (const scenario of ['no-job', 'missing-job', 'publish-failure']) {
    let stored = fixture({ selectedTimeSlot: '11:00 - 11:30' })
    const deleted = []
    const load = loader({
      '@/emails/ModifierEmail': { __esModule: true, default: () => null },
      '@/emails/CancelEmail': { __esModule: true, default: () => null },
      resend: {
        Resend: class {
          emails = {
            send: async () => ({ error: { message: 'Email rejected' } }),
          }
        },
      },
      '@upstash/qstash': {
        Client: class {
          messages = {
            delete: async (id) => {
              deleted.push(id)
              if (scenario === 'missing-job') throw { status: 404 }
            },
          }
          publishJSON = async () => {
            if (scenario === 'publish-failure')
              throw new Error('Expected outage')
            return { messageId: 'fresh-job' }
          }
        },
      },
      '@/lib/db': {
        __esModule: true,
        default: {
          booking: {
            update: async ({ data }) => {
              stored = { ...stored, ...data }
              return stored
            },
          },
        },
      },
    })
    const response = await load(
      'src/lib/admin-booking-notifications.ts'
    ).notifyAdminBookingChange(
      fixture({ remindenEmailJobId: scenario === 'no-job' ? null : 'old-job' }),
      stored
    )
    assert.equal(response.notifications.emailSent, false)
    assert.equal(
      response.notifications.reminderUpdated,
      scenario !== 'publish-failure'
    )
    assert.equal(
      response.booking.remindenEmailJobId,
      scenario === 'publish-failure' ? null : 'fresh-job'
    )
    assert.equal(deleted.length, scenario === 'no-job' ? 0 : 1)
  }
})

test(
  'local MongoDB integration: conflict, adjacent move, contact edit and deletion',
  { skip: process.env.RUN_LOCAL_DB_TESTS !== '1' },
  async () => {
    const { PrismaClient } = require('@prisma/client')
    const { randomUUID } = require('node:crypto')
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: 'mongodb://127.0.0.1:27018/botanic_beauty?replicaSet=botanic-beauty-rs&directConnection=true',
        },
      },
    })
    const ids = [randomUUID(), randomUUID()]
    try {
      for (const [index, id] of ids.entries()) {
        const { createdAt, updatedAt, ...data } = fixture({
          id,
          selectedDate: '2030-1-7',
          selectedTimeSlot: index ? '11:00 - 11:30' : '10:00 - 10:30',
        })
        await prisma.booking.create({ data })
      }
      const { route } = harness({ db: prisma })
      assert.equal(
        (
          await route.PATCH(
            request({
              selectedDate: '2030-1-7',
              selectedTimeSlot: '11:00 - 11:30',
            }),
            context(ids[0])
          )
        ).status,
        409
      )
      assert.equal(
        (
          await route.PATCH(
            request({
              selectedDate: '2030-1-7',
              selectedTimeSlot: '10:30 - 11:00',
            }),
            context(ids[0])
          )
        ).status,
        200
      )
      const edited = await route.PATCH(
        request({
          selectedDate: '2030-1-7',
          selectedTimeSlot: '10:30 - 11:00',
          contactInfo: { ...fixture().contactInfo, name: 'Helyi admin teszt' },
        }),
        context(ids[0])
      )
      assert.equal(edited.data.data.id, ids[0])
      assert.equal(
        (await prisma.booking.findUnique({ where: { id: ids[0] } })).contactInfo
          .name,
        'Helyi admin teszt'
      )
      assert.equal(
        (await route.DELETE(request({}), context(ids[0]))).status,
        200
      )
      assert.equal(
        await prisma.booking.findUnique({ where: { id: ids[0] } }),
        null
      )
    } finally {
      await prisma.booking.deleteMany({ where: { id: { in: ids } } })
      await prisma.$disconnect()
    }
  }
)

test('staff off-day markers keep the selected calendar date in late evening', () => {
  const { isOffDayOfTimi, isOffDayOfNemTimi } = loader()(
    'src/app/admin/foglalasok/utils/offDay.ts'
  )
  const days = [{ date: new Date('2026-11-15T23:00:00Z'), person: 'Timi' }]
  assert.equal(isOffDayOfTimi(new Date(2026, 10, 16, 22, 30), days), true)
  assert.equal(isOffDayOfNemTimi(new Date(2026, 10, 16, 22, 30), days), false)
})
