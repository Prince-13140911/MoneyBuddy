import { validationResult } from 'express-validator';
import Goal from '../models/Goal.js';

export const getGoals = async (req, res, next) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: goals });
  } catch (err) {
    next(err);
  }
};

export const createGoal = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { name, targetAmount, savedAmount, targetDate } = req.body;
    const goal = await Goal.create({
      user: req.user._id,
      name,
      targetAmount,
      savedAmount: savedAmount || 0,
      targetDate,
    });
    res.status(201).json({ success: true, data: goal });
  } catch (err) {
    next(err);
  }
};

export const updateGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    Object.assign(goal, req.body);
    await goal.save();
    res.json({ success: true, data: goal });
  } catch (err) {
    next(err);
  }
};

export const deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }
    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
