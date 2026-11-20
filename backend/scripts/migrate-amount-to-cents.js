// One-off, idempotent migration: copies legacy decimal `amount` into integer
// `amountCents` for Income and Expense. Safe to re-run; the old `amount` field
// is left in place so you can roll back. Run BEFORE deploying the cents code:
//   node scripts/migrate-amount-to-cents.js
require('dotenv').config()
const mongoose = require('mongoose')

const migrate = async (collection) => {
  const res = await collection.updateMany(
    { amountCents: { $exists: false }, amount: { $type: 'number' } },
    [
      {
        $set: { amountCents: { $round: [{ $multiply: ['$amount', 100] }, 0] } },
      },
    ]
  )
  console.log(`${collection.collectionName}: migrated ${res.modifiedCount}`)
}

;(async () => {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not set')
  await mongoose.connect(process.env.MONGO_URI)
  const db = mongoose.connection.db
  await migrate(db.collection('incomes'))
  await migrate(db.collection('expenses'))
  await mongoose.disconnect()
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
