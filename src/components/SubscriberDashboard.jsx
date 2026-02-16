import React, { useState, useEffect } from 'react';
import {
  Users,
  TrendingUp,
  Calendar,
  Download,
  Trash2,
  Search,
  Filter,
  RefreshCw,
  Mail,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';

export default function SubscriberDashboard() {
  const [subscribers, setSubscribers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState('all');
  const [deleteEmail, setDeleteEmail] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [actionResult, setActionResult] = useState(null);

  // Fetch subscribers on mount
  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/get-subscribers');
      const data = await response.json();

      if (data.success) {
        setSubscribers(data.subscribers);
        setStats(data.stats);
      } else {
        setError(data.error || 'Failed to fetch subscribers');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Network error - could not fetch subscribers');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format = 'csv') => {
    try {
      setActionResult({ type: 'info', message: `Downloading ${format.toUpperCase()}...` });

      const response = await fetch(`/api/admin/export-subscribers?format=${format}`);

      if (format === 'csv') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `subscribers-${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `subscribers-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }

      setActionResult({ type: 'success', message: `Downloaded ${format.toUpperCase()} successfully!` });
      setTimeout(() => setActionResult(null), 3000);
    } catch (err) {
      console.error('Export error:', err);
      setActionResult({ type: 'error', message: 'Failed to export subscribers' });
      setTimeout(() => setActionResult(null), 3000);
    }
  };

  const handleDelete = async () => {
    if (!deleteEmail || !deleteConfirm) return;

    try {
      setActionResult({ type: 'info', message: 'Deleting subscriber...' });

      const response = await fetch('/api/admin/delete-subscriber', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: deleteEmail })
      });

      const data = await response.json();

      if (data.success) {
        setActionResult({ type: 'success', message: 'Subscriber deleted successfully!' });
        setDeleteEmail('');
        setDeleteConfirm(false);
        fetchSubscribers(); // Refresh list
      } else {
        setActionResult({ type: 'error', message: data.error || 'Failed to delete subscriber' });
      }
    } catch (err) {
      console.error('Delete error:', err);
      setActionResult({ type: 'error', message: 'Network error - could not delete subscriber' });
    }

    setTimeout(() => setActionResult(null), 3000);
  };

  // Filter subscribers
  const filteredSubscribers = subscribers.filter(sub => {
    const matchesSearch = !searchTerm ||
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.party_data?.childName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterSource === 'all' || sub.source === filterSource;

    return matchesSearch && matchesFilter;
  });

  // Get unique sources for filter dropdown
  const sources = ['all', ...new Set(subscribers.map(s => s.source || 'unknown'))];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={48} className="animate-spin text-pink-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="text-red-600" size={24} />
          <div>
            <p className="font-bold text-red-800">Error Loading Subscribers</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
        <button
          onClick={fetchSubscribers}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Result Banner */}
      {actionResult && (
        <div className={`flex items-center gap-3 p-4 rounded-lg ${
          actionResult.type === 'success' ? 'bg-green-50 border-2 border-green-200' :
          actionResult.type === 'error' ? 'bg-red-50 border-2 border-red-200' :
          'bg-blue-50 border-2 border-blue-200'
        }`}>
          {actionResult.type === 'success' && <CheckCircle className="text-green-600" size={20} />}
          {actionResult.type === 'error' && <AlertCircle className="text-red-600" size={20} />}
          {actionResult.type === 'info' && <Loader2 className="text-blue-600 animate-spin" size={20} />}
          <p className={`font-semibold ${
            actionResult.type === 'success' ? 'text-green-800' :
            actionResult.type === 'error' ? 'text-red-800' :
            'text-blue-800'
          }`}>
            {actionResult.message}
          </p>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-pink-500 p-2 rounded-lg">
                <Users className="text-white" size={20} />
              </div>
              <p className="text-sm font-bold text-gray-600 uppercase">Total Subscribers</p>
            </div>
            <p className="text-4xl font-bold text-gray-800">{stats.total}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-500 p-2 rounded-lg">
                <TrendingUp className="text-white" size={20} />
              </div>
              <p className="text-sm font-bold text-gray-600 uppercase">New This Week</p>
            </div>
            <p className="text-4xl font-bold text-gray-800">{stats.recent}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Calendar className="text-white" size={20} />
              </div>
              <p className="text-sm font-bold text-gray-600 uppercase">With Party Data</p>
            </div>
            <p className="text-4xl font-bold text-gray-800">{stats.withPartyData}</p>
          </div>
        </div>
      )}

      {/* Actions Bar */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by email or child name..."
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all"
              />
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="text-gray-500" size={20} />
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all"
            >
              {sources.map(source => (
                <option key={source} value={source}>
                  {source === 'all' ? 'All Sources' : source}
                </option>
              ))}
            </select>
          </div>

          {/* Export Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-semibold"
            >
              <Download size={16} />
              CSV
            </button>
            <button
              onClick={() => handleExport('json')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-semibold"
            >
              <Download size={16} />
              JSON
            </button>
          </div>

          {/* Refresh */}
          <button
            onClick={fetchSubscribers}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-semibold"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-bold">Email</th>
                <th className="px-6 py-4 text-left font-bold">Source</th>
                <th className="px-6 py-4 text-left font-bold">Child Name</th>
                <th className="px-6 py-4 text-left font-bold">Party Date</th>
                <th className="px-6 py-4 text-left font-bold">Subscribed</th>
                <th className="px-6 py-4 text-left font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <Mail className="mx-auto mb-3 text-gray-400" size={48} />
                    <p className="font-bold text-lg">No subscribers found</p>
                    <p className="text-sm">Try adjusting your search or filter</p>
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">{subscriber.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                        {subscriber.source || 'unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {subscriber.party_data?.childName || '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {subscriber.party_data?.date
                        ? new Date(subscriber.party_data.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {new Date(subscriber.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setDeleteEmail(subscriber.email);
                          setDeleteConfirm(false);
                        }}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete subscriber"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination info */}
        {filteredSubscribers.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing <span className="font-bold">{filteredSubscribers.length}</span> of{' '}
              <span className="font-bold">{subscribers.length}</span> subscribers
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteEmail && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-3 rounded-xl">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Delete Subscriber?</h3>
            </div>

            <p className="text-gray-700 mb-4">
              Are you sure you want to delete <span className="font-bold">{deleteEmail}</span>?
              This action cannot be undone.
            </p>

            <div className="flex items-center gap-2 mb-6">
              <input
                type="checkbox"
                id="delete-confirm"
                checked={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.checked)}
                className="w-4 h-4 text-red-600 focus:ring-red-500"
              />
              <label htmlFor="delete-confirm" className="text-sm text-gray-700">
                Yes, I want to permanently delete this subscriber
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDeleteEmail('');
                  setDeleteConfirm(false);
                }}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={!deleteConfirm}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
