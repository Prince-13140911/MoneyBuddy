import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    month: { type: String, required: true }, // e.g. "2026-03"
    income: { type: Number, default: 0 },
    limits: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

// One budget per user per month
budgetSchema.index({ user: 1, month: 1 }, { unique: true });

export default mongoose.model('Budget', budgetSchema);
