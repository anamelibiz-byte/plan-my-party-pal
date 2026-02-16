import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

export default function SavePartyModal({
  isOpen,
  onClose,
  onSave,
  defaultName,
  partyData,
  isSaving
}) {
  const [partyName, setPartyName] = useState(defaultName);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    if (!partyName.trim()) {
      setError('Please enter a party name');
      return;
    }

    const result = await onSave(partyName);

    if (result.requiresUpgrade) {
      // Don't close modal - let parent handle upgrade flow
      setError(result.message);
    } else if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Failed to save party');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Save Party</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Party name input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Party Name
            </label>
            <input
              type="text"
              value={partyName}
              onChange={(e) => setPartyName(e.target.value)}
              placeholder="e.g., Emma's 5th Birthday"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
              autoFocus
            />
          </div>

          {/* Party preview */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <p className="text-xs text-gray-500 font-semibold uppercase">Preview</p>
            {partyData.childName && (
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Child:</span> {partyData.childName}{partyData.age ? `, ${partyData.age}` : ''}
              </p>
            )}
            {partyData.theme && (
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Theme:</span> {partyData.theme}
              </p>
            )}
            {partyData.date && (
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Date:</span> {new Date(partyData.date).toLocaleDateString()}
              </p>
            )}
            {partyData.guestCount && (
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Guests:</span> {partyData.guestCount}
              </p>
            )}
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
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Party
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
