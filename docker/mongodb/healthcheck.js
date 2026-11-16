// A single-node replica set enables Prisma's MongoDB transactions locally.
// This runs inside this project's container and never connects to another MongoDB.
try {
  rs.status()
} catch (error) {
  if (error.code !== 94 && error.codeName !== 'NotYetInitialized') throw error
  rs.initiate({
    _id: 'botanic-beauty-rs',
    members: [{ _id: 0, host: 'localhost:27017' }],
  })
}

quit(db.hello().isWritablePrimary ? 0 : 1)
