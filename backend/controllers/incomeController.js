const Income = require('../models/Income')
const factory = require('./transactionControllerFactory')

const h = factory({
  Model: Income,
  field: 'source',
  label: 'Source',
  entity: 'Income',
})

exports.addIncome = h.add
exports.getAllIncome = h.getAll
exports.deleteIncome = h.remove
exports.updateIncome = h.update
exports.downloadIncomeExcel = h.downloadExcel
exports.getIncomeOverview = h.overview
