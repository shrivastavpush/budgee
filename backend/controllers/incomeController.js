const xlsx = require('xlsx')
const mongoose = require('mongoose')
const Income = require('../models/Income')

// add income
exports.addIncome = async (req, res) => {
  const userId = req.user.id
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized, user not found" });
  }

  try {
    const { icon, source, amount, date } = req.body

    //checking for missing fields
    if (!source || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: new Date(date)
    })

    await newIncome.save()
    res.status(200).json(newIncome)

  } catch (error) {
    // console.error("Error adding income:", error);
    res.status(500).json({ message: "Server Error" })
  }
}

// get all income
exports.getAllIncome = async (req, res) => {
  const userId = req.user.id
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized, user not found" });
  }

  try {
    const income = await Income.find({ userId }).sort({ date: -1 })
    res.json(income)

  } catch (error) {
    // console.error("Error adding income:", error);
    res.status(500).json({ message: "Server Error" })
  }
}

// delete income
exports.deleteIncome = async (req, res) => {
  const userId = req.user.id
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized, user not found" });
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "Income not found" });
  }

  try {
    const deletedIncome = await Income.findOneAndDelete({ _id: new mongoose.Types.ObjectId(req.params.id), userId })

    if (!deletedIncome) {
      return res.status(404).json({ message: "Income not found or unauthorized access" })
    }

    res.json({ message: "Income deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" })
  }
}

// downlaod excel
exports.downloadIncomeExcel = async (req, res) => {
  const userId = req.user.id
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized, user not found' });
  }

  try {
    const income = await Income.find({ userId }).sort({ date: -1 })

    //Preparing data for Excel
    const data = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date,
    }))

    const wb = xlsx.utils.book_new()
    const ws = xlsx.utils.json_to_sheet(data)
    xlsx.utils.book_append_sheet(wb, ws, 'Income')

    const buffer = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' })

    res.setHeader('Content-Disposition', 'attachment; filename="income_details.xlsx"')
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

    res.send(buffer)

  } catch (error) {
    res.status(500).json({ message: "Server Error" })
  }
}

// update incomes
exports.updateIncome = async (req, res) => {
  const userId = req.user.id
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized, user not found" });
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "Income not found" });
  }

  try {
    const { icon, source, amount, date } = req.body
    // Verify param is string (safe-guard)
    const incomeIdStr = String(req.params.id);
    const userIdStr = String(req.user.id);

    // Find and update the income
    const updatedIncome = await Income.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(incomeIdStr),
        userId: userIdStr
      },
      {
        icon,
        source,
        amount,
        date: new Date(date)
      },
      { new: true }
    )

    if (!updatedIncome) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.status(200).json(updatedIncome)
  } catch (error) {
    res.status(500).json({ message: "Server Error" })
  }
}