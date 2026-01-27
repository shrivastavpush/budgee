const xlsx = require('xlsx');
const mongoose = require('mongoose');
const Income = require('../models/Income');

// add income
exports.addIncome = async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized, user not found" });
  }

  try {
    const { icon, source, amount, date } = req.body;

    //checking for missing fields - Basic validation
    if (!source || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: new Date(date)
    });

    await newIncome.save();
    res.status(200).json(newIncome);

  } catch (error) {
    next(error);
  }
};

// get all income with pagination
exports.getAllIncome = async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized, user not found" });
  }

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 0; // 0 means no limit (all docs)
    const skip = (page - 1) * limit;

    let query = Income.find({ userId }).sort({ date: -1 });

    if (limit > 0) {
      query = query.skip(skip).limit(limit);
    }

    const income = await query;
    const total = await Income.countDocuments({ userId });

    res.json({
      data: income,
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

// delete income
exports.deleteIncome = async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized, user not found" });
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "Income not found" });
  }

  try {
    const deletedIncome = await Income.findOneAndDelete({ _id: new mongoose.Types.ObjectId(req.params.id), userId });

    if (!deletedIncome) {
      return res.status(404).json({ message: "Income not found or unauthorized access" });
    }

    res.json({ message: "Income deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// downlaod excel
exports.downloadIncomeExcel = async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized, user not found' });
  }

  try {
    const income = await Income.find({ userId }).sort({ date: -1 });

    //Preparing data for Excel
    const data = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, 'Income');

    const buffer = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' });

    res.setHeader('Content-Disposition', 'attachment; filename="income_details.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    res.send(buffer);

  } catch (error) {
    next(error);
  }
};

// update incomes
exports.updateIncome = async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized, user not found" });
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "Income not found" });
  }

  try {
    const { icon, source, amount, date } = req.body;
    // Verify param is string (safe-guard)
    const incomeIdStr = String(req.params.id);
    const userIdStr = String(req.user.id);

    // Explicitly cast body fields to break taint flow
    const updateData = {
      icon: String(icon || ''),
      source: String(source),
      amount: Number(amount),
      date: new Date(date)
    };

    // Find and update the income
    const updatedIncome = await Income.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(incomeIdStr),
        userId: userIdStr
      },
      updateData,
      { new: true }
    );

    if (!updatedIncome) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.status(200).json(updatedIncome);
  } catch (error) {
    next(error);
  }
};