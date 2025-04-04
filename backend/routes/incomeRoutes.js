const express = require('express')
const {
    addIncome,
    getAllIncome,
    deleteIncome,
    updateIncome,
    downloadIncomeExcel
} = require('../controllers/incomeController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.post("/add", protect, addIncome)
router.get("/get", protect, getAllIncome)
router.get("/downloadexcel", protect, downloadIncomeExcel)
router.delete("/:id", protect, deleteIncome)
router.patch("/:id", protect, updateIncome)

module.exports = router