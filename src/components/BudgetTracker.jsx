import React, { useMemo } from 'react';
import { DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
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

  const percentage = budgetNum > 0 ? Math.round((totalMid / budgetNum) * 100) : 0;
  const isOver = totalMid > budgetNum && budgetNum > 0;
  const isWarning = percentage >= 80 && !isOver;

  const barColor = isOver ? 'from-red-400 to-red-500' : isWarning ? 'from-amber-400 to-orange-400' : 'from-green-400 to-emerald-400';
  const textColor = isOver ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-green-600';

  if (checklist.length === 0) return null;

  return (
    <div className="mb-6 p-5 bg-white rounded-2xl border-2 border-gray-200 shadow-md">
      <div className="flex items-center gap-2 mb-3">
        <DollarSign className="text-green-500" size={24} />
        <h3 className="text-lg font-bold text-gray-800">Budget Tracker</h3>
      </div>

      {/* Main budget bar */}
      <div className="mb-4">
        <div className="flex justify-between items-end mb-2">
          <span className={`text-2xl font-bold ${textColor}`}>
            {formatCurrency(totalLow)} – {formatCurrency(totalHigh)}
          </span>
          {budgetNum > 0 && (
            <span className="text-sm text-gray-500">
              of {formatCurrency(budgetNum)} budget
            </span>
          )}
        </div>
        {budgetNum > 0 && (
          <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className={`bg-gradient-to-r ${barColor} h-full rounded-full transition-all duration-700`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        )}
        {isOver && (
          <div className="flex items-center gap-2 mt-2 text-red-600">
            <AlertTriangle size={16} />
            <span className="text-sm font-semibold">
              Estimated cost is {formatCurrency(totalMid - budgetNum)} over budget
            </span>
          </div>
        )}
      </div>

      {/* Category breakdown */}
      <div className="space-y-2">
        <p className="text-sm font-bold text-gray-600 flex items-center gap-1">
          <TrendingUp size={14} /> Breakdown by Category
        </p>
        {breakdown.map(cat => {
          const catPercent = budgetNum > 0 ? Math.round((cat.mid / budgetNum) * 100) : 0;
          const color = CATEGORY_COLORS[cat.category] || '#6B7280';
          return (
            <div key={cat.category} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              <span className="text-sm text-gray-700 flex-1 truncate">{cat.category}</span>
              <span className="text-sm font-semibold text-gray-800 tabular-nums">
                {formatCurrency(cat.low)}–{formatCurrency(cat.high)}
              </span>
              {budgetNum > 0 && (
                <span className="text-xs text-gray-400 w-10 text-right">{catPercent}%</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
