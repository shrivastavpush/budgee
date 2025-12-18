const express = require('express')
const {
  addIncome,
  getAllIncome,
  deleteIncome,
  updateIncome,
  downloadIncomeExcel
} = require('../controllers/incomeController')
const { protect } = require('../middleware/authMiddleware')
const { apiLimiter } = require('../middleware/rateLimiter')

const router = express.Router()

router.post("/add", apiLimiter, protect, addIncome)
router.get("/get", apiLimiter, protect, getAllIncome)
router.get("/downloadexcel", apiLimiter, protect, downloadIncomeExcel)
router.delete("/:id", apiLimiter, protect, deleteIncome)
router.patch("/:id", apiLimiter, protect, updateIncome)

module.exports = router