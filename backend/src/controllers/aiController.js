import OpenAI from 'openai';
import Transaction from '../models/Transaction.js';
import buildSpendingSummary from '../utils/buildSpendingSummary.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are FinPilot, an AI financial advisor for students and young professionals. 
Be concise, friendly, and practical. Give specific, actionable advice based on the user's spending data. 
Avoid generic advice — always reference the actual numbers from the user's data.`;

export const chat = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'message is required' });
    }

    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(100);
    const summary = buildSpendingSummary(transactions);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `${SYSTEM_PROMPT}\n\nUser's recent spending data: ${summary}`,
        },
        { role: 'user', content: message },
      ],
      max_tokens: 400,
    });

    res.json({ success: true, data: completion.choices[0].message.content });
  } catch (err) {
    next(err);
  }
};

export const getInsights = async (req, res, next) => {
  try {
    const { month } = req.query;
    const filter = { user: req.user._id };

    if (month) {
      const [year, m] = month.split('-');
      const start = new Date(year, m - 1, 1);
      const end = new Date(year, m, 1);
      filter.date = { $gte: start, $lt: end };
    }

    const transactions = await Transaction.find(filter);
    const summary = buildSpendingSummary(transactions);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Based on my spending data, give me 3 short, specific insights and tips to improve my finances. Data: ${summary}`,
        },
      ],
      max_tokens: 300,
    });

    res.json({ success: true, data: completion.choices[0].message.content });
  } catch (err) {
    next(err);
  }
};
