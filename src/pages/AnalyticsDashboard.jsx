import React, { useState, useEffect } from 'react';
import { Users, DollarSign, PartyPopper, TrendingUp, Award, BarChart3 } from 'lucide-react';
import Header from '../components/Header';

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/analytics/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </>
    );
  }

  if (!stats) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-600">Failed to load analytics</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Track your business metrics and growth</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Users */}
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 rounded-lg p-3">
                  <Users className="text-blue-600" size={24} />
                </div>
                <span className="text-sm text-green-600 font-semibold">
                  +{stats.users.newThisMonth} this month
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats.users.total}</h3>
              <p className="text-gray-600 text-sm">Total Users</p>
            </div>

            {/* Pro Users */}
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 rounded-lg p-3">
                  <Award className="text-purple-600" size={24} />
                </div>
                <span className="text-sm text-gray-600">
                  {stats.subscriptions.conversionRate}% conversion
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats.users.pro}</h3>
              <p className="text-gray-600 text-sm">Pro Subscribers</p>
            </div>

            {/* MRR */}
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 rounded-lg p-3">
                  <DollarSign className="text-green-600" size={24} />
                </div>
                <span className="text-sm text-green-600 font-semibold">
                  ${stats.subscriptions.mrr}/mo
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">
                ${(stats.subscriptions.mrr * 12).toFixed(0)}
              </h3>
              <p className="text-gray-600 text-sm">Annual Run Rate</p>
            </div>

            {/* Total Parties */}
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-pink-100 rounded-lg p-3">
                  <PartyPopper className="text-pink-600" size={24} />
                </div>
                <span className="text-sm text-gray-600">
                  {stats.parties.thisMonth} this month
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats.parties.total}</h3>
              <p className="text-gray-600 text-sm">Total Parties Planned</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* User Growth Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="text-pink-500" size={24} />
                <h3 className="font-bold text-gray-800 text-lg">User Growth (30 Days)</h3>
              </div>

              <div className="space-y-2">
                {Object.entries(stats.growth.byDay).slice(-7).map(([date, count]) => (
                  <div key={date} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-24">
                      {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-pink-500 to-rose-500 h-full rounded-full flex items-center px-2"
                        style={{ width: `${Math.min((count / 10) * 100, 100)}%` }}
                      >
                        <span className="text-xs text-white font-semibold">{count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Themes */}
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="text-purple-500" size={24} />
                <h3 className="font-bold text-gray-800 text-lg">Popular Themes</h3>
              </div>

              <div className="space-y-3">
                {stats.themes.popular.slice(0, 6).map((theme, index) => (
                  <div key={theme.theme} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-pink-500">#{index + 1}</span>
                      <span className="text-gray-700 font-medium">{theme.theme}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{theme.count} parties</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free vs Pro */}
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4">User Distribution</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Free Users</span>
                    <span className="font-semibold text-gray-800">{stats.users.free}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(stats.users.free / stats.users.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Pro Users</span>
                    <span className="font-semibold text-gray-800">{stats.users.pro}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full"
                      style={{ width: `${(stats.users.pro / stats.users.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Referrals */}
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4">Referral Program</h3>
              <div className="text-center">
                <p className="text-4xl font-bold text-pink-600 mb-2">{stats.referrals.total}</p>
                <p className="text-gray-600 text-sm">Total Referrals</p>
              </div>
            </div>

            {/* Conversion Rate */}
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4">Conversion Metrics</h3>
              <div className="text-center">
                <p className="text-4xl font-bold text-green-600 mb-2">{stats.subscriptions.conversionRate}%</p>
                <p className="text-gray-600 text-sm">Free to Pro Conversion</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
