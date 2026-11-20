/**
 * Self-check: mongo-sanitize + $eq filters block operator injection.
 * Run: node scripts/check-nosql-sanitize.js
 */
const assert = require('assert')
const mongoose = require('mongoose')
const sanitize = require('mongo-sanitize')

const asObjectId = (raw) => {
  const id = sanitize(raw)
  if (typeof id !== 'string' || !mongoose.isValidObjectId(id)) return null
  return new mongoose.Types.ObjectId(id)
}

assert.deepStrictEqual(sanitize({ $ne: null }), {})
assert.strictEqual(asObjectId({ $ne: null }), null)
assert.strictEqual(asObjectId({ $gt: '' }), null)

const id = '507f1f77bcf86cd799439011'
const userId = asObjectId(sanitize(id))
assert.ok(userId instanceof mongoose.Types.ObjectId)
assert.strictEqual(String(userId), id)

// downloadExcel-style filter: literal compare via $eq
const filter = { userId: { $eq: userId } }
assert.deepStrictEqual(Object.keys(filter.userId), ['$eq'])
assert.ok(filter.userId.$eq instanceof mongoose.Types.ObjectId)

const days = Math.min(
  Math.max(parseInt(sanitize({ $gt: 0 }), 10) || 30, 1),
  365
)
assert.strictEqual(days, 30)

console.log('check-nosql-sanitize: ok')
