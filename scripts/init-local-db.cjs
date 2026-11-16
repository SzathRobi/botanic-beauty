const { execFileSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')
const { PrismaClient } = require('@prisma/client')

// Deliberately do not read DATABASE_URL from .env or the process: initialization
// must only touch this project's local Docker database, never the live database.
const localUrl =
  'mongodb://127.0.0.1:27018/botanic_beauty?replicaSet=botanic-beauty-rs&directConnection=true'
const root = path.resolve(__dirname, '..')
const salonConstants = fs.readFileSync(
  path.join(root, 'src/constants/salon.constants.ts'),
  'utf8'
)
const salonId = salonConstants.match(/\bSALON_ID\s*=\s*['"]([^'"]+)['"]/)?.[1]
if (!salonId)
  throw new Error('Cannot read SALON_ID from the application configuration')

const prisma = new PrismaClient({ datasources: { db: { url: localUrl } } })

async function main() {
  console.log('Initializing local MongoDB at 127.0.0.1:27018/botanic_beauty')
  // Apply the existing schema/indexes only to this explicitly local database.
  // No schema file is generated or modified, and data-loss acceptance is disabled.
  execFileSync(
    process.execPath,
    [require.resolve('prisma/build/index.js'), 'db', 'push', '--skip-generate'],
    {
      cwd: root,
      env: { ...process.env, DATABASE_URL: localUrl },
      stdio: 'inherit',
    }
  )

  await prisma.$transaction(async (tx) => {
    await tx.salon.upsert({
      where: { id: salonId },
      update: {},
      create: {
        id: salonId,
        openingHours: [
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
        })),
        specialOpeningHours: [],
      },
    })
    if (!(await tx.schedule.findFirst())) {
      await tx.schedule.create({ data: { offDays: [] } })
    }
  })
  console.log(
    'Local database ready: salon opening hours and an empty staff schedule are configured.'
  )
  console.log('Existing local records were preserved. No live data was copied.')
}

main()
  .catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
