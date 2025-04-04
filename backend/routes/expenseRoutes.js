const express = require('express')
const {
    addExpense,
    getAllExpense,
    deleteExpense,
    updateExpense,
    downloadExpenseExcel
} = require('../controllers/expenseController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.post("/add", protect, addExpense)
router.get("/get", protect, getAllExpense)
router.get("/downloadexcel", protect, downloadExpenseExcel)
router.delete("/:id", protect, deleteExpense)
router.patch("/:id", protect, updateExpense)

module.exports = router