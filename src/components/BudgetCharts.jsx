import React from 'react';
import { PieChart, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';

export default function BudgetCharts({ budgetData, totalBudget }) {
  // Calculate totals
  const totalSpent = budgetData.reduce((sum, item) => sum + (parseFloat(item.actualCost) || 0), 0);
  const totalEstimated = budgetData.reduce((sum, item) => sum + (parseFloat(item.estimatedCost) || 0), 0);
  const remaining = totalBudget - totalSpent;
  const percentageUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // Group by category
  const categoryTotals = budgetData.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = { estimated: 0, actual: 0, count: 0 };
    }
    acc[category].estimated += parseFloat(item.estimatedCost) || 0;
    acc[category].actual += parseFloat(item.actualCost) || 0;
    acc[category].count += 1;
    return acc;
  }, {});

  // Category colors
  const categoryColors = {
    'Invitations': '#3b82f6',
    'Decorations': '#ec4899',
    'Food & Cake': '#f59e0b',
    'Dessert Table': '#f97316',
    'Drinks': '#06b6d4',
    'Activity Supplies': '#8b5cf6',
    'Rentals': '#14b8a6',
    'Party Favors': '#f43f5e',
    'Supplies & Cleanup': '#6b7280',
    'Entertainment & Hire': '#a855f7',
    'Other': '#9ca3af',
  };

  // Calculate percentages for pie chart
  const total = Object.values(categoryTotals).reduce((sum, cat) => sum + cat.actual, 0);
  const categories = Object.entries(categoryTotals)
    .map(([name, data]) => ({
      name,
      value: data.actual,
      percentage: total > 0 ? (data.actual / total) * 100 : 0,
      color: categoryColors[name] || '#9ca3af',
    }))
    .filter(cat => cat.value > 0)
    .sort((a, b) => b.value - a.value);

  // Create simple SVG pie chart
  let currentAngle = 0;
  const pieSlices = categories.map((cat) => {
    const sliceAngle = (cat.percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle = endAngle;

    // Convert to radians
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    // Calculate coordinates
    const x1 = 50 + 45 * Math.cos(startRad);
    const y1 = 50 + 45 * Math.sin(startRad);
    const x2 = 50 + 45 * Math.cos(endRad);
    const y2 = 50 + 45 * Math.sin(endRad);

    const largeArc = sliceAngle > 180 ? 1 : 0;

    return {
      ...cat,
      path: `M 50 50 L ${x1} ${y1} A 45 45 0 ${largeArc} 1 ${x2} ${y2} Z`,
    };
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Budget */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-blue-700">Total Budget</span>
            <DollarSign className="text-blue-600" size={20} />
          </div>
          <p className="text-2xl font-bold text-blue-900">${totalBudget.toFixed(2)}</p>
        </div>

        {/* Total Spent */}
        <div className={`bg-gradient-to-br ${
          percentageUsed > 100 ? 'from-red-50 to-red-100' : 'from-green-50 to-green-100'
        } rounded-xl p-4 border-2 ${
          percentageUsed > 100 ? 'border-red-200' : 'border-green-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Total Spent</span>
            <TrendingUp className={percentageUsed > 100 ? 'text-red-600' : 'text-green-600'} size={20} />
          </div>
          <p className={`text-2xl font-bold ${percentageUsed > 100 ? 'text-red-900' : 'text-green-900'}`}>
            ${totalSpent.toFixed(2)}
          </p>
          <p className="text-xs text-gray-600 mt-1">{percentageUsed.toFixed(1)}% of budget</p>
        </div>

        {/* Remaining */}
        <div className={`bg-gradient-to-br ${
          remaining < 0 ? 'from-orange-50 to-orange-100' : 'from-purple-50 to-purple-100'
        } rounded-xl p-4 border-2 ${
          remaining < 0 ? 'border-orange-200' : 'border-purple-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Remaining</span>
            {remaining < 0 && <AlertCircle className="text-orange-600" size={20} />}
          </div>
          <p className={`text-2xl font-bold ${remaining < 0 ? 'text-orange-900' : 'text-purple-900'}`}>
            ${Math.abs(remaining).toFixed(2)}
            {remaining < 0 && <span className="text-sm ml-1">over</span>}
          </p>
        </div>
      </div>

      {/* Budget Progress Bar */}
      <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-800">Budget Progress</h3>
          <span className="text-sm font-semibold text-gray-600">
            ${totalSpent.toFixed(2)} / ${totalBudget.toFixed(2)}
          </span>
        </div>
        <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              percentageUsed > 100
                ? 'bg-gradient-to-r from-red-500 to-red-600'
                : percentageUsed > 80
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                : 'bg-gradient-to-r from-green-500 to-green-600'
            }`}
            style={{ width: `${Math.min(percentageUsed, 100)}%` }}
          >
            <div className="h-full w-full opacity-30 bg-white animate-pulse"></div>
          </div>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-800">
            {percentageUsed.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Pie Chart */}
      {categories.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="text-pink-500" size={24} />
            <h3 className="font-bold text-gray-800">Spending by Category</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* SVG Pie Chart */}
            <div className="flex justify-center">
              <svg viewBox="0 0 100 100" className="w-64 h-64">
                {pieSlices.map((slice, index) => (
                  <path
                    key={index}
                    d={slice.path}
                    fill={slice.color}
                    stroke="white"
                    strokeWidth="1"
                  />
                ))}
              </svg>
            </div>

            {/* Legend */}
            <div className="space-y-3">
              {categories.map((cat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: cat.color }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-800">${cat.value.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{cat.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
        <h3 className="font-bold text-gray-800 mb-4">Category Breakdown</h3>
        <div className="space-y-3">
          {Object.entries(categoryTotals)
            .sort((a, b) => b[1].actual - a[1].actual)
            .map(([category, data]) => (
              <div key={category} className="border-b border-gray-100 pb-3 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800">{category}</span>
                  <span className="text-sm text-gray-500">({data.count} items)</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Estimated:</span>
                    <span className="ml-2 font-semibold text-blue-600">${data.estimated.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Actual:</span>
                    <span className="ml-2 font-semibold text-green-600">${data.actual.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
