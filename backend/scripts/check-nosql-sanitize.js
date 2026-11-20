/**
 * Self-check: sanitize strips NoSQL operators; IDs stay literal ObjectIds.
 * Run: node scripts/check-nosql-sanitize.js
 */
const assert = require('assert')
const mongoose = require('mongoose')
const { sanitize } = require('../middleware/sanitize')

const poisoned = sanitize({ $ne: null })
assert.deepStrictEqual(poisoned, {}, 'operator keys must be stripped')

const nested = sanitize({ userId: { $gt: '' }, ok: 'x' })
assert.deepStrictEqual(
  nested,
  { userId: {}, ok: 'x' },
  'nested operator keys must be stripped'
)
assert.ok(
  !mongoose.isValidObjectId(nested.userId),
  'emptied operator object is not a valid ObjectId'
)

const id = '507f1f77bcf86cd799439011'
assert.strictEqual(sanitize(id), id, 'plain strings pass through')

const cleaned = sanitize(id)
assert.ok(typeof cleaned === 'string' && mongoose.isValidObjectId(cleaned))
const oid = new mongoose.Types.ObjectId(cleaned)
assert.strictEqual(String(oid), id)

const bad = sanitize({ $ne: null })
assert.strictEqual(typeof bad, 'object')
assert.ok(
  !mongoose.isValidObjectId(bad),
  'sanitized operator object is not a valid ObjectId'
)

console.log('check-nosql-sanitize: ok')
