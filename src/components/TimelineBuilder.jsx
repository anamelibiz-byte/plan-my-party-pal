import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

const DEFAULT_TIMELINE = [
  { time: '2:00 PM', event: 'Guests Arrive & Free Play', duration: '30 min' },
  { time: '2:30 PM', event: 'Organized Activities & Games', duration: '45 min' },
  { time: '3:15 PM', event: 'Snacks & Drinks', duration: '15 min' },
  { time: '3:30 PM', event: 'Main Activity / Special Event', duration: '30 min' },
  { time: '4:00 PM', event: 'Cake & Happy Birthday Song', duration: '20 min' },
  { time: '4:20 PM', event: 'Open Presents', duration: '20 min' },
  { time: '4:40 PM', event: 'Party Favors & Goodbye', duration: '20 min' },
];

export default function TimelineBuilder({ timeline, onTimelineChange, partyData }) {
  const [items, setItems] = useState(timeline && timeline.length > 0 ? timeline : DEFAULT_TIMELINE);

  useEffect(() => {
    if (onTimelineChange) onTimelineChange(items);
  }, [items, onTimelineChange]);

  const updateItem = (idx, field, value) => {
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const addItem = () => {
    setItems(prev => [...prev, { time: '', event: '', duration: '15 min' }]);
  };

  const removeItem = (idx) => {
    setItems(prev => prev.filter((_, i) => i !== idx));
  };

  const moveItem = (idx, direction) => {
    if ((direction === -1 && idx === 0) || (direction === 1 && idx === items.length - 1)) return;
    const newItems = [...items];
    const target = idx + direction;
    [newItems[idx], newItems[target]] = [newItems[target], newItems[idx]];
    setItems(newItems);
  };

  return (
    <div className="p-4 md:p-5 bg-sky-50 rounded-2xl border-2 border-sky-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="text-sky-500" size={22} />
          <h3 className="text-lg font-bold text-sky-800">Day-of Timeline</h3>
        </div>
        <button onClick={addItem} className="flex items-center gap-1 text-sm font-bold text-sky-600 hover:text-sky-800 transition-colors">
          <Plus size={16} /> Add
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="p-3 bg-white rounded-xl border border-sky-100">
            {/* Mobile: stacked layout / Desktop: row layout */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-0.5 flex-shrink-0">
                  <button onClick={() => moveItem(idx, -1)} className="text-gray-300 hover:text-sky-500 transition-colors" disabled={idx === 0}>
                    <ChevronUp size={14} />
                  </button>
                  <button onClick={() => moveItem(idx, 1)} className="text-gray-300 hover:text-sky-500 transition-colors" disabled={idx === items.length - 1}>
                    <ChevronDown size={14} />
                  </button>
                </div>
                <input type="text" value={item.time} onChange={e => updateItem(idx, 'time', e.target.value)}
                  className="w-24 sm:w-28 px-2 py-1.5 border border-gray-200 rounded-lg text-sm font-mono focus:border-sky-400 outline-none"
                  placeholder="3:00 PM" />
                <input type="text" value={item.duration} onChange={e => updateItem(idx, 'duration', e.target.value)}
                  className="w-20 sm:w-24 px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-center focus:border-sky-400 outline-none whitespace-nowrap"
                  placeholder="30 min" />
              </div>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <input type="text" value={item.event} onChange={e => updateItem(idx, 'event', e.target.value)}
                  className="flex-1 min-w-0 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:border-sky-400 outline-none"
                  placeholder="Activity description..." />
                <button onClick={() => removeItem(idx)} className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
