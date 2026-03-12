import { validationResult } from 'express-validator';
import Transaction from '../models/Transaction.js';

export const getTransactions = async (req, res, next) => {
  try {
    const { month, category } = req.query;
    const filter = { user: req.user._id };

    if (month) {
      const [year, m] = month.split('-');
      const start = new Date(year, m - 1, 1);
      const end = new Date(year, m, 1);
      filter.date = { $gte: start, $lt: end };
    }
    if (category) filter.category = category;

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.json({ success: true, data: transactions });
  } catch (err) {
    next(err);
  }
};

export const addTransaction = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { title, amount, type, category, date } = req.body;
    const transaction = await Transaction.create({
      user: req.user._id,
      title,
      amount,
      type,
      category,
      date: date || Date.now(),
    });
    res.status(201).json({ success: true, data: transaction });
  } catch (err) {
    next(err);
  }
};

export const updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    Object.assign(transaction, req.body);
    await transaction.save();
    res.json({ success: true, data: transaction });
  } catch (err) {
    next(err);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

export const getSummary = async (req, res, next) => {
  try {
    const { month } = req.query;
    const filter = { user: req.user._id, type: 'expense' };

    if (month) {
      const [year, m] = month.split('-');
      const start = new Date(year, m - 1, 1);
      const end = new Date(year, m, 1);
      filter.date = { $gte: start, $lt: end };
    }

    const summary = await Transaction.aggregate([
      { $match: filter },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
    ]);

    const result = summary.reduce((acc, { _id, total }) => {
      acc[_id] = total;
      return acc;
    }, {});

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
