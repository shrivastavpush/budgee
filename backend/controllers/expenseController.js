const xlsx = require('xlsx');
const mongoose = require('mongoose');
const Expense = require('../models/Expense');

// add Expense
exports.addExpense = async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized, user not found" });
  }

  try {
    const { icon, category, amount, date } = req.body;

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
    });

    await newExpense.save();
    res.status(200).json(newExpense);

  } catch (error) {
    next(error);
  }
};

// get all Expense with pagination
exports.getAllExpense = async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized, user not found" });
  }

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 0; // 0 means no limit (all docs)
    const skip = (page - 1) * limit;

    let query = Expense.find({ userId }).sort({ date: -1 });

    if (limit > 0) {
      query = query.skip(skip).limit(limit);
    }

    const expense = await query;
    const total = await Expense.countDocuments({ userId });

    res.json({
      data: expense,
      pagination: {
        total,
        page,
        limit,
        pages: limit > 0 ? Math.ceil(total / limit) : 1
      }
    });

  } catch (error) {
    next(error);
  }
};

// delete Expense
exports.deleteExpense = async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized, user not found" });
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "Expense not found" });
  }

  try {
    const deletedExpense = await Expense.findOneAndDelete({ _id: new mongoose.Types.ObjectId(req.params.id), userId });

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found or unauthorized access" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// downlaod excel
exports.downloadExpenseExcel = async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized, user not found' });
  }

  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });

    //Preparing data for Excel
    const data = expense.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: item.date,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, 'Expense');

    const buffer = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' });

    res.setHeader('Content-Disposition', 'attachment; filename="expense_details.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    res.send(buffer);

  } catch (error) {
    next(error);
  }
};

// update expense
exports.updateExpense = async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized, user not found" });
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "Expense not found" });
  }

  try {
    const { icon, category, amount, date } = req.body;
    // Verify param is string (safe-guard)
    const expenseIdStr = String(req.params.id);
    const userIdStr = String(req.user.id);

    // Explicitly cast body fields to break taint flow
    const updateData = {
      icon: String(icon || ''),
      category: String(category),
      amount: Number(amount),
      date: new Date(date)
    };

    // Find and update the expense
    const updatedExpense = await Expense.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(expenseIdStr),
        userId: userIdStr
      },
      updateData,
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json(updatedExpense);
  } catch (error) {
    next(error);
  }
};