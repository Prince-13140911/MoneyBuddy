// ── MOCK AI SERVICE ───────────────────────────────────────────────────
const delay = (ms = 900) => new Promise((r) => setTimeout(r, ms))

const RESPONSES = [
  (q) => q.toLowerCase().includes('laptop') &&
    "Based on your spending, you have ~₹600 left after fixed expenses this month. A laptop purchase of ~₹1,000-₹1,200 would stretch you thin. I'd recommend saving ₹300/month for 3-4 months and buying next quarter — meanwhile check out refurbished options on Amazon or Best Buy! 💻",
  (q) => q.toLowerCase().includes('overspend') &&
    "Looking at your data, your top overspending categories are **Entertainment (+42%)** and **Shopping (+28%)** compared to last month. I'd suggest setting hard limits: ₹80 for entertainment, ₹150 for shopping. That alone saves ~₹90/month! 📊",
  (q) => q.toLowerCase().includes('save') &&
    "With your current income and expenses, you're saving ~${Math.round(Math.random()*5+18)}% of your income. The 50/30/20 rule recommends 20% minimum. Try automating a ₹150 transfer to savings on payday — you won't miss what you don't see! 💰",
  (q) => (q.toLowerCase().includes('tip') || q.toLowerCase().includes('cut')) &&
    "Here are 3 quick wins to cut expenses:\n\n1. **Cancel unused subscriptions** — audit your bills category, most people waste ₹30-50/month\n2. **Meal prep 3× per week** — can save ₹100-150/month vs eating out\n3. **Use cashback apps** (Rakuten, Honey) for online shopping — easy 2-5% back 🎯",
  (q) => q.toLowerCase().includes('food') &&
    "A healthy budget rule: food should be 10-15% of take-home pay. For a ₹3,500 salary, that's ₹350-525/month total (groceries + dining combined). Your current food spend looks reasonable — just watch dining out, which is typically 3× the cost of cooking at home! 🍽️",
  (q) => q.toLowerCase().includes('track') &&
    "You're saving approximately 18% of your income right now, which is above average. To stay on track: review your budget weekly (5 min), log expenses same-day, and check your savings goal progress every month. You're doing great! 🚀",
]

const FALLBACK_RESPONSES = [
  "Great question! Based on your spending patterns, I'd recommend reviewing your top 3 expense categories and seeing where you can trim 10-15%. Small consistent cuts add up to big savings over a year! 💡",
  "Looking at your financial data, your biggest opportunity is in discretionary spending. Try the 24-hour rule — wait a day before any non-essential purchase over ₹50. You'll be surprised how many you skip! 🎯",
  "Smart financial move: make sure you have 3-6 months of expenses as an emergency fund before aggressive investing. Based on your spending, that's roughly ₹5,000-₹10,000. Build it gradually — even ₹100/month makes a difference! 🛡️",
  "Your spending habits show good discipline! One tip: automate your savings first thing on payday. Pay yourself first, then budget the rest. Even 10% automated savings compounds significantly over time. 📈",
  "I'd suggest the envelope method for your top 3 spending categories. Allocate a set amount each month and stick to it. Digital budgets work great — you're already tracking everything right here in MoneyBuddy! 🗂️",
]

export const sendChatMessage = async (message) => {
  await delay(800 + Math.random() * 600)
  for (const fn of RESPONSES) {
    const res = fn(message)
    if (res) return { data: { data: res } }
  }
  const reply = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)]
  return { data: { data: reply } }
}

export const fetchInsights = async () => {
  await delay(600)
  return {
    data: {
      data: "Your biggest win this month: spending is down 12% vs last month! Top tip: your food spending is ₹40 over budget — cooking 2 more meals at home this week will put you back on track. Keep it up! 🚀",
    },
  }
}
