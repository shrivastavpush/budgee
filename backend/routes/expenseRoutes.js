const express = require('express')
const {
  addExpense,
  getAllExpense,
  deleteExpense,
  updateExpense,
  downloadExpenseExcel,
  getExpenseOverview,
} = require('../controllers/expenseController')
const { protect } = require('../middleware/authMiddleware')
const { apiLimiter } = require('../middleware/rateLimiter')

const router = express.Router()

router.post('/add', apiLimiter, protect, addExpense)
router.get('/get', apiLimiter, protect, getAllExpense)
router.get('/overview', apiLimiter, protect, getExpenseOverview)
router.get('/downloadexcel', apiLimiter, protect, downloadExpenseExcel)
router.delete('/:id', apiLimiter, protect, deleteExpense)
router.patch('/:id', apiLimiter, protect, updateExpense)

module.exports = router
