const buildSpendingSummary = (transactions) => {
  const totals = {};
  let totalSpent = 0;
  let totalIncome = 0;

  transactions.forEach(({ type, amount, category }) => {
    if (type === 'expense') {
      totals[category] = (totals[category] || 0) + amount;
      totalSpent += amount;
    } else {
      totalIncome += amount;
    }
  });

  const breakdown = Object.entries(totals)
    .map(([cat, amt]) => `${cat}: $${amt.toFixed(2)}`)
    .join(', ');

  return `Total income: $${totalIncome.toFixed(2)}. Total spent: $${totalSpent.toFixed(2)}. Breakdown by category: ${breakdown || 'no expenses yet'}.`;
};

export default buildSpendingSummary;
