const Expense = require('../models/Expense')
const factory = require('./transactionControllerFactory')

const h = factory({
  Model: Expense,
  field: 'category',
  label: 'Category',
  entity: 'Expense',
})

exports.addExpense = h.add
exports.getAllExpense = h.getAll
exports.deleteExpense = h.remove
exports.updateExpense = h.update
exports.downloadExpenseExcel = h.downloadExcel
exports.getExpenseOverview = h.overview
