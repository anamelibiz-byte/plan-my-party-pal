import React, { useMemo } from 'react';
import { AlertTriangle, Leaf, Wheat, Milk, Egg, Fish, Nut } from 'lucide-react';

const COMMON_RESTRICTIONS = [
  { id: 'vegetarian', label: 'Vegetarian', icon: '🥬', color: 'bg-green-100 text-green-700 border-green-200' },
  { id: 'vegan', label: 'Vegan', icon: '🌱', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { id: 'gluten-free', label: 'Gluten-Free', icon: '🌾', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { id: 'dairy-free', label: 'Dairy-Free', icon: '🥛', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'nut-free', label: 'Nut-Free', icon: '🥜', color: 'bg-red-100 text-red-700 border-red-200' },
  { id: 'egg-free', label: 'Egg-Free', icon: '🥚', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { id: 'kosher', label: 'Kosher', icon: '✡️', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { id: 'halal', label: 'Halal', icon: '☪️', color: 'bg-teal-100 text-teal-700 border-teal-200' },
];

export default function DietaryTracker({ rsvpResponses = [] }) {
  const dietarySummary = useMemo(() => {
    const counts = {};
    const guestDetails = [];

    rsvpResponses.forEach(r => {
      if (r.dietary && r.dietary.length > 0) {
        r.dietary.forEach(d => {
          counts[d] = (counts[d] || 0) + 1;
        });
        guestDetails.push({ name: r.guestName, dietary: r.dietary });
      }
      if (r.dietaryOther) {
        counts[r.dietaryOther] = (counts[r.dietaryOther] || 0) + 1;
        guestDetails.push({ name: r.guestName, dietary: [r.dietaryOther] });
      }
    });

    return { counts, guestDetails };
  }, [rsvpResponses]);

  const hasRestrictions = Object.keys(dietarySummary.counts).length > 0;

  return (
    <div className="p-5 bg-orange-50 rounded-2xl border-2 border-orange-200">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="text-orange-500" size={22} />
        <h3 className="text-lg font-bold text-orange-800">Dietary & Allergy Tracker</h3>
      </div>

      {!hasRestrictions && rsvpResponses.length === 0 && (
        <p className="text-sm text-gray-500 italic">
          Dietary information will appear here once guests RSVP with their dietary needs.
        </p>
      )}

      {!hasRestrictions && rsvpResponses.length > 0 && (
        <p className="text-sm text-green-600 font-semibold">
          No dietary restrictions reported from {rsvpResponses.length} responses.
        </p>
      )}

      {hasRestrictions && (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(dietarySummary.counts).map(([restriction, count]) => {
              const match = COMMON_RESTRICTIONS.find(r => r.id === restriction || r.label === restriction);
              return (
                <span key={restriction} className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold border ${match ? match.color : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                  {match ? match.icon : '⚠️'} {match ? match.label : restriction} ({count})
                </span>
              );
            })}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-bold text-gray-600">Guest Details:</p>
            {dietarySummary.guestDetails.map((g, i) => (
              <div key={i} className="flex items-center gap-2 text-sm bg-white p-2 rounded-lg border border-orange-100">
                <span className="font-semibold text-gray-700">{g.name}:</span>
                <span className="text-gray-600">{g.dietary.join(', ')}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
