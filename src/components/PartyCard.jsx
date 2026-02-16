import React, { useState } from 'react';
import { Calendar, Users, Tag, Trash2, FolderOpen, CheckCircle, Clock } from 'lucide-react';

export default function PartyCard({ party, onLoad, onDelete, isActive }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(party.id);
    setIsDeleting(false);
    setShowDeleteConfirm(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date set';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`bg-white rounded-2xl p-5 shadow-lg border-2 transition-all hover:shadow-xl ${
      isActive ? 'border-pink-400 ring-2 ring-pink-200' : 'border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 mb-1">{party.name}</h3>
          {isActive && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-semibold">
              <CheckCircle size={14} />
              Active
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        {party.date && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={16} className="text-pink-500" />
            <span>{formatDate(party.date)}</span>
          </div>
        )}
        {party.theme && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Tag size={16} className="text-pink-500" />
            <span>{party.theme}</span>
          </div>
        )}
        {party.guestCount && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users size={16} className="text-pink-500" />
            <span>{party.guestCount} guests</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Clock size={14} />
          <span>Updated {getTimeAgo(party.updatedAt)}</span>
        </div>
      </div>

      {/* Actions */}
      {!showDeleteConfirm ? (
        <div className="flex gap-2">
          <button
            onClick={() => onLoad(party.id)}
            disabled={isActive}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <FolderOpen size={18} />
            {isActive ? 'Current Party' : 'Load Party'}
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 border-2 border-red-300 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-all flex items-center justify-center"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <p className="text-sm text-red-700 font-semibold mb-2">Delete this party?</p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
