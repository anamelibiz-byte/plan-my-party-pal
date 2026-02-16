import React, { useState } from 'react';
import { Trash2, Mail, Clock, CheckCircle, Eye, Edit3 } from 'lucide-react';

export default function CollaboratorsList({ collaborators, onRemove, currentUserEmail }) {
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleRemove = async (collaboratorId) => {
    await onRemove(collaboratorId);
    setConfirmDelete(null);
  };

  const getInitials = (email) => {
    return email.substring(0, 2).toUpperCase();
  };

  const getStatusBadge = (status) => {
    if (status === 'accepted') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-lg">
          <CheckCircle size={12} />
          Accepted
        </span>
      );
    }
    if (status === 'pending') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-lg">
          <Clock size={12} />
          Pending
        </span>
      );
    }
    return null;
  };

  const getRoleIcon = (role) => {
    return role === 'editor' ? (
      <Edit3 size={14} className="text-purple-600" />
    ) : (
      <Eye size={14} className="text-gray-600" />
    );
  };

  if (!collaborators || collaborators.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex p-4 bg-gray-100 rounded-full mb-3">
          <Mail size={32} className="text-gray-400" />
        </div>
        <p className="text-gray-600 font-medium">No collaborators yet</p>
        <p className="text-sm text-gray-500 mt-1">Invite someone to help plan this party!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {collaborators.map((collab) => (
        <div
          key={collab.id}
          className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 transition-all"
        >
          <div className="flex items-center gap-3 flex-1">
            {/* Avatar */}
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {getInitials(collab.email)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-gray-800 truncate">{collab.email}</p>
                {getStatusBadge(collab.status)}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {getRoleIcon(collab.role)}
                <span className="capitalize">{collab.role}</span>
              </div>
            </div>
          </div>

          {/* Remove button */}
          {confirmDelete === collab.id ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemove(collab.id)}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Confirm
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(collab.id)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Remove collaborator"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
