import React, { useState } from 'react';
import { X, Send, AlertCircle, Users, Eye, Edit3 } from 'lucide-react';

export default function CollaboratorInvite({
  isOpen,
  onClose,
  onSend,
  partyId,
  isSending
}) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('editor');
  const [error, setError] = useState(null);

  const handleSend = async () => {
    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    const result = await onSend(email, role);

    if (result.success) {
      setEmail('');
      setRole('editor');
      setError(null);
      onClose();
    } else {
      setError(result.error || 'Failed to send invitation');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Users size={24} className="text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Invite Collaborator</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Email input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="spouse@email.com"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              autoFocus
            />
          </div>

          {/* Role selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Permission Level
            </label>
            <div className="space-y-2">
              {/* Editor option */}
              <label className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                role === 'editor' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
              }`}>
                <input
                  type="radio"
                  name="role"
                  value="editor"
                  checked={role === 'editor'}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Edit3 size={16} className="text-purple-600" />
                    <span className="font-semibold text-gray-800">Editor</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Can edit all party details, checklist, timeline, and RSVP list
                  </p>
                </div>
              </label>

              {/* Viewer option */}
              <label className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                role === 'viewer' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
              }`}>
                <input
                  type="radio"
                  name="role"
                  value="viewer"
                  checked={role === 'viewer'}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye size={16} className="text-gray-600" />
                    <span className="font-semibold text-gray-800">Viewer</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Can view all details but cannot make changes
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={isSending}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSending ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                Sending...
              </>
            ) : (
              <>
                <Send size={20} />
                Send Invitation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
