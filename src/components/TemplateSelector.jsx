import React, { useState } from 'react';
import { Sparkles, Users, DollarSign, MapPin, CheckCircle, X } from 'lucide-react';
import { getTemplatesByAge, partyTemplates } from '../data/partyTemplates';

export default function TemplateSelector({ childAge, onSelectTemplate, onClose }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = childAge ? getTemplatesByAge(childAge) : partyTemplates;

  const handleSelect = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>

          <div className="flex items-center gap-3">
            <Sparkles className="text-white" size={32} />
            <div>
              <h2 className="text-2xl font-bold text-white">Choose a Party Template</h2>
              <p className="text-white/90 text-sm">Start with a pre-made plan and customize it</p>
            </div>
          </div>
        </div>

        {/* Template Grid */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
                  selectedTemplate?.id === template.id
                    ? 'border-pink-500 bg-pink-50 shadow-lg'
                    : 'border-gray-200 hover:border-pink-300 hover:shadow-md'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-800">{template.name}</h3>
                  {selectedTemplate?.id === template.id && (
                    <div className="bg-pink-500 rounded-full p-1">
                      <CheckCircle className="text-white" size={16} />
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>

                {/* Details */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Users size={16} className="text-pink-500" />
                    <span>{template.guestCount} guests</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <DollarSign size={16} className="text-green-600" />
                    <span>${template.budget}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin size={16} className="text-blue-500" />
                    <span>{template.venue}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Sparkles size={16} className="text-purple-500" />
                    <span>Ages {template.ageRange[0]}-{template.ageRange[1]}</span>
                  </div>
                </div>

                {/* Activities Preview */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Suggested Activities:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.suggestedActivities.slice(0, 3).map((activity, idx) => (
                      <span key={idx} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {templates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No templates found for this age group</p>
              <button
                onClick={() => {
                  setSelectedTemplate(null);
                  onClose();
                }}
                className="text-pink-600 font-semibold hover:text-pink-700"
              >
                Start from scratch instead
              </button>
            </div>
          )}

          {/* Selected Template Details */}
          {selectedTemplate && (
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 border-2 border-pink-200">
              <h4 className="font-bold text-gray-800 mb-3">What's Included:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                {selectedTemplate.checklist.slice(0, 6).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle size={14} className="text-green-600" />
                    <span>{item.task}</span>
                  </div>
                ))}
                {selectedTemplate.checklist.length > 6 && (
                  <div className="text-sm text-gray-500">
                    + {selectedTemplate.checklist.length - 6} more items...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-700 font-semibold hover:bg-gray-200 rounded-xl transition-all"
          >
            Skip Templates
          </button>
          <button
            onClick={handleSelect}
            disabled={!selectedTemplate}
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Use This Template
          </button>
        </div>
      </div>
    </div>
  );
}
