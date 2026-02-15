import React, { useState, useMemo, useEffect } from 'react';
import { DollarSign, TrendingUp, AlertTriangle, ChevronDown, ChevronUp, Printer, Lock } from 'lucide-react';
import { sumChecklistCosts, getCostBreakdown, formatCurrency } from '../utils/parseCost';
import { hasFeature } from '../config/tiers';
import { useTier } from '../context/TierContext';

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

export default function BudgetTracker({ checklist, budget, userTier = 'free', partyData = {} }) {
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

  const printBudget = () => {
    const printWindow = window.open('', '_blank');
    const budgetHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Budget Tracker - ${partyData.childName || 'Party'}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            color: #1f2937;
          }
          h1 {
            color: #059669;
            border-bottom: 3px solid #10b981;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .party-info {
            background: #f3f4f6;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .budget-summary {
            background: ${isOver ? '#fee2e2' : isWarning ? '#fef3c7' : '#d1fae5'};
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid ${isOver ? '#dc2626' : isWarning ? '#f59e0b' : '#10b981'};
          }
          .budget-summary h2 {
            margin: 0 0 10px 0;
            color: ${isOver ? '#dc2626' : isWarning ? '#d97706' : '#059669'};
          }
          .category {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            margin-bottom: 8px;
            background: #f9fafb;
            border-left: 4px solid #6b7280;
            border-radius: 4px;
          }
          .category-name {
            font-weight: 600;
            color: #374151;
          }
          .category-estimate {
            color: #6b7280;
            font-size: 0.875rem;
          }
          .category-actual {
            font-weight: 700;
            color: #059669;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 15px;
            margin-top: 20px;
            border-top: 2px solid #d1d5db;
            font-weight: bold;
            font-size: 1.125rem;
          }
          .remaining-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 15px;
            color: ${budgetNum - displayTotal >= 0 ? '#059669' : '#dc2626'};
            font-weight: 600;
          }
          @media print {
            body { margin: 20px; }
          }
        </style>
      </head>
      <body>
        <h1>💰 Budget Tracker</h1>

        <div class="party-info">
          <strong>${partyData.childName || 'Party'}'s ${partyData.theme || ''} Party</strong><br/>
          ${partyData.date ? `Date: ${partyData.date}<br/>` : ''}
          ${partyData.guestCount ? `Guests: ${partyData.guestCount}<br/>` : ''}
          Total Budget: ${formatCurrency(budgetNum)}
        </div>

        <div class="budget-summary">
          <h2>${hasActualData ? 'Total Spent' : 'Estimated Total'}: ${hasActualData ? formatCurrency(totalActual) : `${formatCurrency(totalLow)} – ${formatCurrency(totalHigh)}`}</h2>
          ${budgetNum > 0 ? `<p style="margin: 0; font-size: 1.125rem;">Budget Progress: ${percentage}%</p>` : ''}
          ${isOver ? `<p style="margin: 10px 0 0 0; font-weight: bold;">⚠️ ${formatCurrency(displayTotal - budgetNum)} over budget</p>` : ''}
        </div>

        <h3 style="margin-bottom: 15px;">Category Breakdown</h3>
        ${breakdown.map(cat => {
          const actualVal = actualCosts[cat.category];
          return `
            <div class="category">
              <div>
                <div class="category-name">${cat.category}</div>
                <div class="category-estimate">Est: ${formatCurrency(cat.low)}–${formatCurrency(cat.high)}</div>
              </div>
              <div class="category-actual">
                ${actualVal ? formatCurrency(Number(actualVal)) : formatCurrency(cat.mid)}
              </div>
            </div>
          `;
        }).join('')}

        <div class="total-row">
          <span>${hasActualData ? 'Total Spent' : 'Estimated Total'}</span>
          <span>${hasActualData ? formatCurrency(totalActual) : `${formatCurrency(totalLow)} – ${formatCurrency(totalHigh)}`}</span>
        </div>

        ${budgetNum > 0 ? `
          <div class="remaining-row">
            <span>Remaining Budget</span>
            <span>${budgetNum - displayTotal >= 0 ? formatCurrency(budgetNum - displayTotal) : `-${formatCurrency(displayTotal - budgetNum)}`}</span>
          </div>
        ` : ''}

        <p style="margin-top: 30px; color: #6b7280; font-size: 0.875rem; text-align: center;">
          Generated by Plan My Party Pal • www.planmypartypal.com
        </p>
      </body>
      </html>
    `;

    printWindow.document.write(budgetHTML);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 250);
  };

  const canPrint = hasFeature(userTier, 'printChecklist');
  const { requireFeature } = useTier();

  if (checklist.length === 0) return null;

  return (
    <div className="mb-6 p-4 sm:p-5 bg-white rounded-2xl border-2 border-gray-200 shadow-md">
      {/* Header with print button for Pro users */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setExpanded(!expanded)} className="flex-1 flex items-center justify-between">
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
        {canPrint ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              printBudget();
            }}
            className="ml-3 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center gap-1 text-sm font-bold no-print"
            title="Print Budget"
          >
            <Printer size={16} />
            <span className="hidden sm:inline">Print</span>
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              requireFeature('printChecklist');
            }}
            className="ml-3 flex items-center gap-1.5 text-xs sm:text-sm text-purple-600 hover:text-purple-800 font-semibold transition-colors no-print whitespace-nowrap"
            title="Upgrade to Pro to download the budget tracker"
          >
            <Lock size={14} className="flex-shrink-0" />
            <span className="hidden sm:inline">Want to download the budget tracker?</span>
            <span className="sm:hidden">Download</span>
            <span className="hidden sm:inline underline">Unlock Pro</span>
          </button>
        )}
      </div>

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
