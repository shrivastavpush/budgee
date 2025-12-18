const xlsx = require('xlsx')
const Expense = require('../models/Expense')

// add Expense
exports.addExpense = async (req, res) => {
  const userId = req.user.id
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized, user not found" });
  }

  try {
    const { icon, category, amount, date } = req.body

    //checking for missing fields
    if (!category || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newExpense = new Expense({
      userId,
      icon,
      category,
      amount,
      date: new Date(date)
    })

    await newExpense.save()
    res.status(200).json(newExpense)

  } catch (error) {
    // console.error("Error adding Expense:", error);
    res.status(500).json({ message: "Server Error" })
  }
}

// get all Expense
exports.getAllExpense = async (req, res) => {
  const userId = req.user.id
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized, user not found" });
  }

  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 })
    res.json(expense)

  } catch (error) {
    // console.error("Error adding Expense:", error);
    res.status(500).json({ message: "Server Error" })
  }
}

// delete Expense
exports.deleteExpense = async (req, res) => {
  const userId = req.user.id
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized, user not found" });
  }

  try {
    const deletedExpense = await Expense.findOneAndDelete({ _id: req.params.id, userId })

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found or unauthorized access" })
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" })
  }
}

// downlaod excel
exports.downloadExpenseExcel = async (req, res) => {
  const userId = req.user.id
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized, user not found' });
  }

  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 })

    //Preparing data for Excel
    const data = expense.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: item.date,
    }))

    const wb = xlsx.utils.book_new()
    const ws = xlsx.utils.json_to_sheet(data)
    xlsx.utils.book_append_sheet(wb, ws, 'Expense')

    const buffer = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' })

    res.setHeader('Content-Disposition', 'attachment; filename="expense_details.xlsx"')
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

    res.send(buffer)

  } catch (error) {
    res.status(500).json({ message: "Server Error" })
  }
}

// update expense
exports.updateExpense = async (req, res) => {
  const userId = req.user.id
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized, user not found" });
  }

  try {
    const { icon, category, amount, date } = req.body
    const expenseId = req.params.id

    // Find and update the expense
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: expenseId, userId },
      { icon, category, amount, date: new Date(date) },
      { new: true }
    )

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json(updatedExpense)
  } catch (error) {
    res.status(500).json({ message: "Server Error" })
  }
}