import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: {
      type: String,
      enum: ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Other'],
      default: 'Other',
    },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Transaction', transactionSchema);
