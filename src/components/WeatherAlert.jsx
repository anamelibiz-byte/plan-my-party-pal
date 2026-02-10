import React, { useState, useEffect } from 'react';
import { CloudRain, Sun, CloudSnow, Wind, Thermometer, AlertTriangle } from 'lucide-react';

export default function WeatherAlert({ date, location, venueType }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const isOutdoor = venueType && ['Park', 'Backyard', 'Beach', 'Farm', 'Zoo', 'Outdoor Venue'].some(v =>
    venueType.toLowerCase().includes(v.toLowerCase())
  );

  // Simple mock weather — in production this would call a weather API
  useEffect(() => {
    if (!date || !isOutdoor) return;

    const partyDate = new Date(date);
    const now = new Date();
    const daysUntil = Math.ceil((partyDate - now) / (1000 * 60 * 60 * 24));

    if (daysUntil <= 7 && daysUntil > 0) {
      setWeather({
        temp: Math.round(65 + Math.random() * 25),
        condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Chance of Rain'][Math.floor(Math.random() * 4)],
        daysUntil,
        precipitation: Math.round(Math.random() * 50),
      });
    } else if (daysUntil <= 0) {
      setWeather({ temp: 0, condition: 'Past', daysUntil, precipitation: 0 });
    } else {
      setWeather(null);
    }
  }, [date, isOutdoor]);

  if (!isOutdoor) return null;

  const getWeatherIcon = (condition) => {
    if (condition?.includes('Rain')) return <CloudRain className="text-blue-500" size={20} />;
    if (condition?.includes('Snow')) return <CloudSnow className="text-blue-300" size={20} />;
    if (condition?.includes('Sunny')) return <Sun className="text-amber-500" size={20} />;
    return <Wind className="text-gray-500" size={20} />;
  };

  return (
    <div className="p-4 bg-sky-50 rounded-xl border-2 border-sky-200">
      <div className="flex items-center gap-2 mb-2">
        <Thermometer className="text-sky-500" size={20} />
        <h4 className="font-bold text-sky-800">Weather Alert — Outdoor Party</h4>
      </div>

      {!weather && (
        <p className="text-sm text-gray-500">
          Weather forecast available 7 days before your party. Your party is on {date || 'TBD'}.
        </p>
      )}

      {weather && weather.condition !== 'Past' && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {getWeatherIcon(weather.condition)}
            <span className="font-bold text-gray-800">{weather.temp}°F</span>
          </div>
          <span className="text-sm text-gray-600">{weather.condition}</span>
          <span className="text-xs text-gray-400">{weather.daysUntil} day{weather.daysUntil !== 1 ? 's' : ''} away</span>
          {weather.precipitation > 30 && (
            <span className="flex items-center gap-1 text-xs text-orange-600 font-bold">
              <AlertTriangle size={14} /> {weather.precipitation}% rain — have a backup plan!
            </span>
          )}
        </div>
      )}

      <div className="mt-3 p-3 bg-white rounded-lg border border-sky-100">
        <p className="text-xs font-bold text-sky-700 mb-1">Outdoor Party Tips:</p>
        <ul className="text-xs text-gray-600 space-y-0.5">
          <li>• Have a tent or canopy as rain/sun backup</li>
          <li>• Bring extra sunscreen and bug spray</li>
          <li>• Weigh down tablecloths and decorations</li>
          <li>• Plan an indoor backup location</li>
        </ul>
      </div>
    </div>
  );
}
