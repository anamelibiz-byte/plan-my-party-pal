export function parseCost(costStr) {
  if (!costStr || costStr === '$0' || costStr === '') return { low: 0, high: 0, mid: 0 };
  const cleaned = costStr.replace(/[^0-9.\-]/g, '');
  const parts = cleaned.split('-').map(Number).filter(n => !isNaN(n) && n > 0);
  if (parts.length === 0) return { low: 0, high: 0, mid: 0 };
  if (parts.length === 1) return { low: parts[0], high: parts[0], mid: parts[0] };
  return { low: parts[0], high: parts[1], mid: (parts[0] + parts[1]) / 2 };
}

export function sumChecklistCosts(items) {
  let totalLow = 0, totalHigh = 0, totalMid = 0;
  items.forEach(item => {
    const { low, high, mid } = parseCost(item.estimatedCost);
    totalLow += low;
    totalHigh += high;
    totalMid += mid;
  });
  return { totalLow: Math.round(totalLow), totalHigh: Math.round(totalHigh), totalMid: Math.round(totalMid) };
}

export function getCostBreakdown(items) {
  const byCategory = {};
  items.forEach(item => {
    const cat = item.category || 'Other';
    if (!byCategory[cat]) byCategory[cat] = { category: cat, low: 0, high: 0, mid: 0, count: 0 };
    const { low, high, mid } = parseCost(item.estimatedCost);
    byCategory[cat].low += low;
    byCategory[cat].high += high;
    byCategory[cat].mid += mid;
    byCategory[cat].count += 1;
  });
  return Object.values(byCategory)
    .map(c => ({ ...c, low: Math.round(c.low), high: Math.round(c.high), mid: Math.round(c.mid) }))
    .sort((a, b) => b.mid - a.mid);
}

export function formatCurrency(amount) {
  return '$' + Math.round(amount).toLocaleString();
}
