import Budget from '../models/Budget.js';

export const getBudget = async (req, res, next) => {
  try {
    const { month } = req.query;
    const filter = { user: req.user._id };
    if (month) filter.month = month;

    const budgets = await Budget.find(filter).sort({ month: -1 });
    res.json({ success: true, data: budgets });
  } catch (err) {
    next(err);
  }
};

export const upsertBudget = async (req, res, next) => {
  try {
    const { month, income, limits } = req.body;
    if (!month) {
      return res.status(400).json({ success: false, message: 'month is required' });
    }

    const budget = await Budget.findOneAndUpdate(
      { user: req.user._id, month },
      { income, limits },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, data: budget });
  } catch (err) {
    next(err);
  }
};
