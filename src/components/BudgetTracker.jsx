import React, { useState, useMemo, useEffect } from 'react';
import { DollarSign, TrendingUp, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { sumChecklistCosts, getCostBreakdown, formatCurrency } from '../utils/parseCost';

const CATEGORY_COLORS = {
  'Invitations': '#3B82F6',
  'Decorations': '#EC4899',
  'Food & Cake': '#F59E0B',
  'Dessert Table': '#F97316',
  'Drinks': '#06B6D4',
  'Activity Supplies': '#8B5CF6',
  'Rentals': '#14B8A6',
  'Party Favors': '#F43F5E',
  'Supplies & Cleanup': '#6B7280',
  'Entertainment & Hire': '#A855F7',
};

export default function BudgetTracker({ checklist, budget }) {
  const budgetNum = Number(budget) || 0;
  const { totalLow, totalHigh, totalMid } = useMemo(() => sumChecklistCosts(checklist), [checklist]);
  const breakdown = useMemo(() => getCostBreakdown(checklist), [checklist]);
  const [expanded, setExpanded] = useState(false);

  // Track actual spending per category
  const [actualCosts, setActualCosts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pp_actual_costs')) || {}; } catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem('pp_actual_costs', JSON.stringify(actualCosts));
  }, [actualCosts]);

  const updateActualCost = (category, value) => {
    setActualCosts(prev => ({ ...prev, [category]: value }));
  };

  const totalActual = Object.values(actualCosts).reduce((sum, v) => sum + (Number(v) || 0), 0);
  const hasActualData = Object.values(actualCosts).some(v => v !== '' && v !== undefined && v !== null);

  const displayTotal = hasActualData ? totalActual : totalMid;
  const percentage = budgetNum > 0 ? Math.round((displayTotal / budgetNum) * 100) : 0;
  const isOver = displayTotal > budgetNum && budgetNum > 0;
  const isWarning = percentage >= 80 && !isOver;

  const barColor = isOver ? 'from-red-400 to-red-500' : isWarning ? 'from-amber-400 to-orange-400' : 'from-green-400 to-emerald-400';
  const textColor = isOver ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-green-600';

  if (checklist.length === 0) return null;

  return (
    <div className="mb-6 p-4 sm:p-5 bg-white rounded-2xl border-2 border-gray-200 shadow-md">
      {/* Header — clickable to expand */}
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <DollarSign className="text-green-500" size={24} />
          <h3 className="text-lg font-bold text-gray-800">Budget Tracker</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold ${textColor}`}>
            {hasActualData ? formatCurrency(totalActual) : `${formatCurrency(totalLow)}–${formatCurrency(totalHigh)}`}
            {budgetNum > 0 && <span className="text-gray-400 font-normal"> / {formatCurrency(budgetNum)}</span>}
          </span>
          {expanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
        </div>
      </button>

      {/* Progress bar — always visible */}
      {budgetNum > 0 && (
        <div className="bg-gray-200 rounded-full h-3 overflow-hidden mb-2">
          <div
            className={`bg-gradient-to-r ${barColor} h-full rounded-full transition-all duration-700`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}
      {isOver && (
        <div className="flex items-center gap-2 text-red-600 mb-2">
          <AlertTriangle size={14} />
          <span className="text-xs font-semibold">
            {formatCurrency(displayTotal - budgetNum)} over budget
          </span>
        </div>
      )}

      {/* Expanded: editable category breakdown */}
      {expanded && (
        <div className="mt-4 space-y-3">
          <p className="text-sm font-bold text-gray-600 flex items-center gap-1">
            <TrendingUp size={14} /> Category Breakdown — enter what you actually spent
          </p>

          <div className="space-y-2">
            {breakdown.map(cat => {
              const color = CATEGORY_COLORS[cat.category] || '#6B7280';
              const actualVal = actualCosts[cat.category] ?? '';
              return (
                <div key={cat.category} className="flex items-center gap-2 sm:gap-3 p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-700 truncate">{cat.category}</p>
                    <p className="text-xs text-gray-400">Est: {formatCurrency(cat.low)}–{formatCurrency(cat.high)}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      value={actualVal}
                      onChange={e => updateActualCost(cat.category, e.target.value)}
                      placeholder={cat.mid.toFixed(0)}
                      className="w-16 sm:w-20 px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-right focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary row */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <span className="text-sm font-bold text-gray-700">
              {hasActualData ? 'Total Spent' : 'Estimated Total'}
            </span>
            <span className={`text-lg font-bold ${textColor}`}>
              {hasActualData ? formatCurrency(totalActual) : `${formatCurrency(totalLow)} – ${formatCurrency(totalHigh)}`}
            </span>
          </div>
          {budgetNum > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Remaining Budget</span>
              <span className={`text-sm font-bold ${budgetNum - displayTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {budgetNum - displayTotal >= 0 ? formatCurrency(budgetNum - displayTotal) : `-${formatCurrency(displayTotal - budgetNum)}`}
              </span>
            </div>
          )}
        </div>
      )}

      {!expanded && (
        <p className="text-xs text-gray-400 text-center mt-1">Tap to expand and track actual spending</p>
      )}
    </div>
  );
}
