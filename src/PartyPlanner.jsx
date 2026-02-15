import React, { useState, useMemo, useEffect } from 'react';
import {
  Cake, MapPin, Sparkles, CheckCircle2, Circle, Users, Heart,
  ChevronRight, ChevronLeft, X, Star, Phone, ExternalLink,
  ShoppingCart, PartyPopper, Search, Download, Printer,
  UserPlus, Mail, Tag, EyeOff, Eye, FileDown, RotateCcw,
  Crown, Lock, Gift,
} from 'lucide-react';
import { themes } from './data/themes';
import { getActivitiesForAge, getAgeGroup } from './data/activities';
import { venueCategories, getVenuesByType, getAllVenuesWithinRadius, searchNearbyVenues, searchCustomVenue } from './data/venueTypes';
import { getAmazonSearchUrl, getSuppliesForActivity, bakeryLinks } from './data/shoppingLinks';
import { partyZones, getThemedFoodName } from './data/partyZones';
import { giftIdeas, getAgeGroup as getGiftAgeGroup } from './data/giftIdeas';

// New components
import BudgetTracker from './components/BudgetTracker';
import EmailCapture from './components/EmailCapture';
import EmailGate from './components/EmailGate';
import RSVPManager from './components/RSVPManager';
import TimelineBuilder from './components/TimelineBuilder';
import DietaryTracker from './components/DietaryTracker';
import WeatherAlert from './components/WeatherAlert';
import ShareButton from './components/ShareButton';
import TierGate from './components/TierGate';
import InviteCard from './components/InviteCard';
import GuestList from './components/GuestList';
import { useTier } from './context/TierContext';
import { downloadPartyPDF, generateSamplePDF } from './utils/generatePDF';
import { getMaxGuests } from './config/tiers';
import { savePartyToDatabase, loadPartyFromDatabase, mergePartyData } from './utils/partySync';

// ─── Sprinkles Background ────────────────────────────────────────────────────
const SPRINKLE_COLORS = ['#FF6B9D','#C084FC','#FCD34D','#60A5FA','#34D399','#F87171','#FB923C'];

function Sprinkles() {
  const dots = useMemo(() =>
    Array.from({ length: 55 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      color: SPRINKLE_COLORS[i % SPRINKLE_COLORS.length],
      rotation: Math.random() * 360,
      w: 5 + Math.random() * 4,
      h: 14 + Math.random() * 10,
      dur: `${3 + Math.random() * 4}s`,
      delay: `${Math.random() * 5}s`,
    }))
  , []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {dots.map(s => (
        <div
          key={s.id}
          className="sprinkle"
          style={{
            left: s.left,
            top: s.top,
            backgroundColor: s.color,
            width: `${s.w}px`,
            height: `${s.h}px`,
            '--rotation': `${s.rotation}deg`,
            animation: `sprinkle-float ${s.dur} ease-in-out infinite`,
            animationDelay: s.delay,
          }}
        />
      ))}
    </div>
  );
}

// ─── Step Config ─────────────────────────────────────────────────────────────
const STEP_LABELS = ['Basics', 'Email', 'Venue', 'Theme', 'Activities', 'Checklist'];

// ─── Main Component ──────────────────────────────────────────────────────────
export default function PartyPlanner() {
  const [step, setStep] = useState(1);
  const [partyData, setPartyData] = useState({
    childName: '',
    age: '',
    date: '',
    budget: '',
    guestCount: '',
    location: '',
    phone: '', // optional — for contact
    partyTime: '',
    genderCategory: '', // optional — for theme filtering
    theme: '',
    venueType: '',
    venueName: '',
    venueAddress: '',
    selectedActivities: [],
    selectedGifts: [], // array of gift IDs
  });
  const [suggestions, setSuggestions] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hireCharacter, setHireCharacter] = useState(false);
  const [viewMode, setViewMode] = useState('category');
  const [comingSoonModal, setComingSoonModal] = useState(null);
  const [showZones, setShowZones] = useState(false);
  const [zoneChecks, setZoneChecks] = useState({});
  const [excludedItems, setExcludedItems] = useState({});
  const [timeline, setTimeline] = useState([]);
  const [rsvpId, setRsvpId] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pp_rsvp_id')); } catch { return null; }
  });
  const [rsvpResponses, setRsvpResponses] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pp_rsvp_responses')) || []; } catch { return []; }
  });
  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem('pp_user_email') || '';
  });
  const [guestMode, setGuestMode] = useState(() => {
    return localStorage.getItem('pp_guest_mode') === 'true';
  });
  const { checkFeature, requireFeature, userTier } = useTier();
  const maxGuests = getMaxGuests(userTier);

  // Gift Ideas filters
  const [giftTypeFilter, setGiftTypeFilter] = useState('all');
  const [giftPriceFilter, setGiftPriceFilter] = useState('All');
  const [showGiftIdeas, setShowGiftIdeas] = useState(false);

  // ─── Auto-Restore from Database ──────────────────────────────────────────────
  useEffect(() => {
    const restorePartyData = async () => {
      // Check for email parameter in URL (deep link from email)
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get('email');

      if (emailParam) {
        // User clicked email link - load their data from database
        console.log('📧 Loading party data for:', emailParam);
        const dbData = await loadPartyFromDatabase(emailParam);

        if (dbData) {
          const localData = JSON.parse(localStorage.getItem('pp_party_data') || '{}');
          const mergedData = mergePartyData(dbData, localData);

          // Restore all state
          setPartyData(mergedData);
          setStep(mergedData.step || 1);
          if (mergedData.checklist) setChecklist(mergedData.checklist);
          if (mergedData.selectedActivities) {
            // Activities are already in partyData, just log
            console.log('✅ Restored activities:', mergedData.selectedActivities.length);
          }

          // Save credentials to localStorage
          localStorage.setItem('pp_user_email', emailParam);
          localStorage.setItem('pp_plan_id', dbData.id);
          setUserEmail(emailParam);
          setGuestMode(false);

          console.log('✅ Party data restored from database');
        }
      } else if (userEmail && userEmail !== '') {
        // User has email but no URL param - try loading their latest plan
        console.log('🔄 Auto-loading saved plan for:', userEmail);
        const dbData = await loadPartyFromDatabase(userEmail);

        if (dbData) {
          const localData = JSON.parse(localStorage.getItem('pp_party_data') || '{}');
          const mergedData = mergePartyData(dbData, localData);

          // Only restore if database has more progress
          if ((dbData.party_data.step || 1) > step) {
            setPartyData(mergedData);
            setStep(mergedData.step || 1);
            if (mergedData.checklist) setChecklist(mergedData.checklist);
            console.log('✅ Restored more recent data from database');
          }
        }
      }
    };

    restorePartyData();
  }, []); // Run once on mount

  // ─── Auto-Save to Database ───────────────────────────────────────────────────
  useEffect(() => {
    // Only auto-save if user has email (not in guest mode)
    if (userEmail && userEmail !== '' && !guestMode && partyData.childName) {
      const planId = localStorage.getItem('pp_plan_id');

      // Build complete party state
      const completePartyData = {
        ...partyData,
        step,
        checklist,
        hireCharacter,
      };

      // Save to database (debounced)
      savePartyToDatabase(userEmail, completePartyData, planId);
    }
  }, [partyData, step, checklist, hireCharacter, userEmail, guestMode]);

  // ─── Live Venue Search ──────────────────────────────────────────────────────
  const [liveVenues, setLiveVenues] = useState([]);
  const [venueLoading, setVenueLoading] = useState(false);
  const [venueLocation, setVenueLocation] = useState('');
  const [venueError, setVenueError] = useState('');
  const [venueRadius, setVenueRadius] = useState(10); // 5 or 10 miles
  const [customVenueSearch, setCustomVenueSearch] = useState('');

  const searchVenues = async (venueType, radius) => {
    const loc = partyData.location;
    const r = radius ?? venueRadius;
    if (!loc || !venueType || venueType === 'Home') {
      setLiveVenues([]);
      return;
    }
    setVenueLoading(true);
    setVenueError('');
    try {
      const data = await searchNearbyVenues(loc, venueType, r);
      if (data.results && data.results.length > 0) {
        setLiveVenues(data.results);
        setVenueLocation(data.location || loc);
      } else {
        setLiveVenues([]);
        setVenueError(data.error || 'No venues found. Try a different location or category.');
      }
    } catch {
      setLiveVenues([]);
      setVenueError('Search failed. Showing sample results.');
    }
    setVenueLoading(false);
  };

  const handleCustomVenueSearch = async () => {
    const loc = partyData.location;
    const q = customVenueSearch.trim();
    if (!loc || !q) return;
    setVenueLoading(true);
    setVenueError('');
    try {
      const data = await searchCustomVenue(loc, q, venueRadius);
      if (data.results && data.results.length > 0) {
        setLiveVenues(data.results);
        setVenueLocation(data.location || loc);
      } else {
        setLiveVenues([]);
        setVenueError('No results found. Try a different search term.');
      }
    } catch {
      setLiveVenues([]);
      setVenueError('Search failed. Try again.');
    }
    setVenueLoading(false);
  };

  // Map generated checklist categories → party zone IDs
  const CATEGORY_TO_ZONE = {
    'Invitations': 'arrival',
    'Decorations': 'arrival',
    'Food & Cake': 'buffet',
    'Dessert Table': 'cake',
    'Drinks': 'beverages',
    'Activity Supplies': 'activities',
    'Rentals': 'activities',
    'Party Favors': 'activities',
    'Supplies & Cleanup': 'cleanup',
    'Entertainment & Hire': 'logistics',
  };

  const toggleExcludeItem = (itemKey) => {
    setExcludedItems(prev => ({ ...prev, [itemKey]: !prev[itemKey] }));
  };

  const updateField = (field, value) => {
    setPartyData(prev => ({ ...prev, [field]: value }));
  };

  const toggleActivity = (name) => {
    setPartyData(prev => ({
      ...prev,
      selectedActivities: prev.selectedActivities.includes(name)
        ? prev.selectedActivities.filter(a => a !== name)
        : [...prev.selectedActivities, name],
    }));
  };

  // ─── Filtered Data ──────────────────────────────────────────────────────────
  const filteredThemes = useMemo(() => {
    const g = partyData.genderCategory;
    if (!g) return [...themes.boy, ...themes.girl, ...themes.both];
    if (g === 'both') return [...themes.both, ...themes.boy, ...themes.girl];
    return [...themes[g], ...themes.both];
  }, [partyData.genderCategory]);

  const characterThemes = useMemo(() => themes.characters || [], []);

  const filteredActivities = useMemo(() => {
    if (!partyData.age) return [];
    return getActivitiesForAge(partyData.age);
  }, [partyData.age]);

  const matchingVenues = useMemo(() => {
    // Prefer live Google Places results if available
    if (liveVenues.length > 0) return liveVenues;
    // Fallback to sample data
    if (partyData.venueType && partyData.venueType !== 'Home') {
      return getVenuesByType(partyData.venueType);
    }
    return getAllVenuesWithinRadius(10);
  }, [partyData.venueType, liveVenues]);

  // Gift Ideas Filtering
  const filteredGifts = useMemo(() => {
    if (!partyData.age) return [];

    const ageGroup = getGiftAgeGroup(partyData.age);
    const ageGifts = giftIdeas[ageGroup]?.gifts || [];

    return ageGifts.filter(gift => {
      // Type filter
      const typeMatch = giftTypeFilter === 'all' || gift.type === giftTypeFilter;
      // Price filter
      const priceMatch = giftPriceFilter === 'All' || gift.priceRange === giftPriceFilter;
      return typeMatch && priceMatch;
    });
  }, [partyData.age, giftTypeFilter, giftPriceFilter]);

  // ─── AI / Checklist Generation ──────────────────────────────────────────────
  const generateChecklist = async () => {
    setLoading(true);
    try {
      const actList = partyData.selectedActivities.join(', ');
      const response = await fetch('/api/ai-checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: partyData.theme,
          age: partyData.age,
          venueType: partyData.venueType,
          budget: partyData.budget,
          guestCount: partyData.guestCount,
          activities: actList,
          hireCharacter,
        }),
      });
      const data = await response.json();
      const text = data.content?.find(b => b.type === 'text')?.text || '';
      const clean = text.replace(/```json|```/g, '').trim();
      setChecklist(JSON.parse(clean).map(i => ({ ...i, completed: false })));
    } catch {
      generateFallbackChecklist();
    }
    setLoading(false);
  };

  const generateFallbackChecklist = () => {
    const items = [
      { category: 'Invitations', task: 'Send party invitations (digital or printed)', priority: 'high', estimatedCost: '$0-15', searchTerms: 'birthday party invitations kids' },
      { category: 'Invitations', task: 'Create guest list with RSVP tracking', priority: 'high', estimatedCost: '$0', searchTerms: '' },
      { category: 'Invitations', task: 'Send thank-you cards after the party', priority: 'low', estimatedCost: '$5-10', searchTerms: 'thank you cards kids birthday' },
      { category: 'Decorations', task: `${partyData.theme} themed balloons`, priority: 'high', estimatedCost: '$10-20', searchTerms: `${partyData.theme} birthday balloons` },
      { category: 'Decorations', task: 'Happy Birthday banner', priority: 'high', estimatedCost: '$5-10', searchTerms: 'happy birthday banner' },
      { category: 'Decorations', task: 'Tablecloth and centerpieces', priority: 'medium', estimatedCost: '$10-20', searchTerms: `${partyData.theme} party decorations` },
      { category: 'Decorations', task: 'Streamers and confetti', priority: 'low', estimatedCost: '$5-10', searchTerms: 'party streamers confetti' },
      { category: 'Food & Cake', task: `Order ${partyData.theme} themed birthday cake`, priority: 'high', estimatedCost: '$30-60', searchTerms: '' },
      { category: 'Food & Cake', task: 'Snacks and finger foods', priority: 'high', estimatedCost: '$20-40', searchTerms: '' },
      { category: 'Food & Cake', task: `Themed plates, cups, napkins (${partyData.guestCount} guests)`, priority: 'high', estimatedCost: '$10-15', searchTerms: `${partyData.theme} party plates cups napkins` },
      { category: 'Food & Cake', task: 'Plastic utensils', priority: 'medium', estimatedCost: '$5-8', searchTerms: 'party plastic utensils' },
      { category: 'Dessert Table', task: 'Cupcake stand or tiered display', priority: 'medium', estimatedCost: '$12-20', searchTerms: 'cupcake stand birthday party' },
      { category: 'Dessert Table', task: 'Candy jars and scoops', priority: 'medium', estimatedCost: '$10-15', searchTerms: 'candy jars party display' },
      { category: 'Dessert Table', task: 'Dessert table backdrop', priority: 'low', estimatedCost: '$10-20', searchTerms: `${partyData.theme} dessert table backdrop` },
      { category: 'Drinks', task: 'Juice boxes or pouches', priority: 'high', estimatedCost: '$8-12', searchTerms: 'juice boxes variety pack kids' },
      { category: 'Drinks', task: 'Water bottles', priority: 'high', estimatedCost: '$5-8', searchTerms: 'water bottles kids party' },
      { category: 'Drinks', task: 'Cups with lids (for little ones)', priority: 'medium', estimatedCost: '$5-10', searchTerms: 'kids party cups with lids' },
      { category: 'Party Favors', task: 'Goodie bags', priority: 'medium', estimatedCost: '$10-20', searchTerms: 'party favor bags kids' },
      { category: 'Party Favors', task: 'Small toys and trinkets', priority: 'medium', estimatedCost: '$15-25', searchTerms: 'party favor toys bulk kids' },
      { category: 'Party Favors', task: 'Candy for bags', priority: 'low', estimatedCost: '$8-12', searchTerms: 'bulk candy party favors' },
      { category: 'Supplies & Cleanup', task: 'Heavy-duty trash bags', priority: 'high', estimatedCost: '$5-8', searchTerms: 'heavy duty trash bags' },
      { category: 'Supplies & Cleanup', task: 'Paper towels & wet wipes', priority: 'high', estimatedCost: '$5-8', searchTerms: 'paper towels wet wipes' },
      { category: 'Supplies & Cleanup', task: 'Tape, scissors, markers', priority: 'medium', estimatedCost: '$5-8', searchTerms: 'tape scissors markers' },
      { category: 'Supplies & Cleanup', task: 'First aid kit', priority: 'high', estimatedCost: '$8-12', searchTerms: 'first aid kit' },
      { category: 'Supplies & Cleanup', task: 'Sunscreen (if outdoor)', priority: 'medium', estimatedCost: '$8-12', searchTerms: 'kids sunscreen' },
      { category: 'Supplies & Cleanup', task: 'Extra ice and cooler', priority: 'medium', estimatedCost: '$8-15', searchTerms: 'cooler with ice packs' },
    ];

    // Rentals — bounce house / inflatables
    const bounceActivities = ['Bounce House', 'Bounce Slide Combo', 'Water Bounce House', 'Obstacle Course Inflatable', 'Toddler Bounce House'];
    const selectedBounce = partyData.selectedActivities.filter(a => bounceActivities.includes(a));
    if (selectedBounce.length > 0) {
      selectedBounce.forEach(name => {
        items.push({ category: 'Rentals', task: `Rent ${name} — confirm delivery time, setup space & power outlet`, priority: 'high', estimatedCost: name.includes('Obstacle') ? '$200-350' : name.includes('Water') ? '$150-300' : '$100-250', searchTerms: `${name} rental near me` });
      });
      items.push({ category: 'Rentals', task: 'Confirm flat, clear outdoor space for inflatables (no overhead wires)', priority: 'high', estimatedCost: '$0', searchTerms: '' });
    } else {
      items.push({ category: 'Rentals', task: 'Consider renting a bounce house or slide — kids love them!', priority: 'low', estimatedCost: '$100-300', searchTerms: 'bounce house rental near me' });
    }

    if (hireCharacter) {
      items.push({ category: 'Entertainment & Hire', task: `Hire ${partyData.theme} character performer`, priority: 'high', estimatedCost: '$100-250', searchTerms: '' });
    }
    items.push({ category: 'Entertainment & Hire', task: 'Hire party helper / assistant', priority: 'medium', estimatedCost: '$50-100', searchTerms: '' });

    // Activity supplies
    partyData.selectedActivities.forEach(name => {
      const supplies = getSuppliesForActivity(name);
      if (supplies.length > 0) {
        supplies.forEach(s => {
          items.push({ category: 'Activity Supplies', task: `${s.item} (for ${name})`, priority: 'high', estimatedCost: s.estimatedCost, searchTerms: s.search });
        });
      } else {
        items.push({ category: 'Activity Supplies', task: `Supplies for ${name}`, priority: 'high', estimatedCost: '$10-25', searchTerms: `${name} party supplies` });
      }
    });

    setChecklist(items.map(i => ({ ...i, completed: false })));
  };

  const toggleChecklistItem = (idx) => {
    setChecklist(prev => prev.map((item, i) => i === idx ? { ...item, completed: !item.completed } : item));
  };

  // Active items = not excluded. Count only active items for progress.
  const activeChecklist = checklist.filter((_, i) => !excludedItems[`checklist-${i}`]);
  const completedCount = activeChecklist.filter(i => i.completed).length;

  const toggleZoneCheck = (zoneId, itemIdx) => {
    const key = `${zoneId}-${itemIdx}`;
    setZoneChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // ─── Merge Checklist into Party Zones ────────────────────────────────────────
  const mergedZones = useMemo(() => {
    // Group checklist items by their target zone
    const checklistByZone = {};
    checklist.forEach((item, idx) => {
      const zoneId = CATEGORY_TO_ZONE[item.category] || 'logistics';
      if (!checklistByZone[zoneId]) checklistByZone[zoneId] = [];
      checklistByZone[zoneId].push({ ...item, _checklistIdx: idx, _type: 'checklist' });
    });

    return partyZones.map(zone => ({
      ...zone,
      // Zone's own static items + merged checklist items for this zone
      allItems: [
        ...zone.items.map((item, idx) => ({ ...item, _zoneKey: `${zone.id}-${idx}`, _type: 'zone' })),
        ...(checklistByZone[zone.id] || []),
      ],
    }));
  }, [checklist]);

  // Total active items across zones (for progress bar)
  const totalZoneItems = mergedZones.reduce((sum, zone) => {
    return sum + zone.allItems.filter(item => {
      const key = item._type === 'zone' ? item._zoneKey : `checklist-${item._checklistIdx}`;
      return !excludedItems[key];
    }).length;
  }, 0);

  const totalZoneCompleted = mergedZones.reduce((sum, zone) => {
    return sum + zone.allItems.filter(item => {
      const key = item._type === 'zone' ? item._zoneKey : `checklist-${item._checklistIdx}`;
      if (excludedItems[key]) return false;
      if (item._type === 'zone') return zoneChecks[item._zoneKey] || false;
      return item.completed || false;
    }).length;
  }, 0);

  // AI Theme Suggestions
  const generateThemeSuggestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: partyData.age,
          budget: partyData.budget,
          guestCount: partyData.guestCount,
        }),
      });
      const data = await response.json();
      const text = data.content?.find(b => b.type === 'text')?.text || '';
      setSuggestions(JSON.parse(text.replace(/```json|```/g, '').trim()));
    } catch { /* silent */ }
    setLoading(false);
  };

  // ─── Download / Print ────────────────────────────────────────────────────────
  const downloadChecklist = () => {
    const l = [];
    l.push(`🎂 ${partyData.childName}'s ${partyData.theme} Party | ${partyData.date || 'TBD'} | ${partyData.guestCount} guests | $${partyData.budget} budget`);
    if (partyData.selectedActivities.length) l.push(`Activities: ${partyData.selectedActivities.join(', ')}`);
    l.push('─'.repeat(60));

    // Print unified zones — includes both zone items and merged checklist items
    mergedZones.forEach(zone => {
      const activeItems = zone.allItems.filter(item => {
        const key = item._type === 'zone' ? item._zoneKey : `checklist-${item._checklistIdx}`;
        return !excludedItems[key];
      });
      if (!activeItems.length) return;

      l.push(`\n${zone.emoji} ${zone.name.toUpperCase()}`);
      activeItems.forEach(item => {
        const isChecked = item._type === 'zone'
          ? (zoneChecks[item._zoneKey] || false)
          : (item.completed || false);
        const box = isChecked ? '☑' : '☐';
        const cost = item.estimatedCost ? ` (${item.estimatedCost})` : '';
        l.push(`  ${box} ${item.task}${cost}`);
      });
    });

    l.push(`\n${'─'.repeat(60)}`);
    l.push(`Progress: ${totalZoneCompleted}/${totalZoneItems} items done`);
    if (Object.values(excludedItems).filter(Boolean).length > 0) {
      l.push(`(${Object.values(excludedItems).filter(Boolean).length} items excluded by you)`);
    }
    l.push('Generated by Plan My Party Pal ✨');

    const blob = new Blob([l.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `party-checklist-${partyData.childName || 'party'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Checklist Categories ────────────────────────────────────────────────────
  const CHECKLIST_CATEGORIES = [
    'Invitations', 'Decorations', 'Food & Cake', 'Dessert Table', 'Drinks',
    'Activity Supplies', 'Rentals', 'Party Favors', 'Supplies & Cleanup', 'Entertainment & Hire',
  ];
  const categoryColors = {
    'Invitations': 'text-blue-600 bg-blue-100',
    'Decorations': 'text-pink-600 bg-pink-100',
    'Food & Cake': 'text-amber-600 bg-amber-100',
    'Dessert Table': 'text-orange-600 bg-orange-100',
    'Drinks': 'text-cyan-600 bg-cyan-100',
    'Activity Supplies': 'text-violet-600 bg-violet-100',
    'Rentals': 'text-teal-600 bg-teal-100',
    'Party Favors': 'text-rose-600 bg-rose-100',
    'Supplies & Cleanup': 'text-gray-600 bg-gray-100',
    'Entertainment & Hire': 'text-purple-600 bg-purple-100',
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Sprinkles />

      {/* Coming Soon Modal */}
      {comingSoonModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setComingSoonModal(null)}>
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center" onClick={e => e.stopPropagation()}>
            <div className="text-6xl mb-4">{comingSoonModal === 'invites' ? '✉️' : '🏷️'}</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Coming Soon!</h3>
            <p className="text-gray-600 mb-6">
              {comingSoonModal === 'invites'
                ? 'Our Digital Invite Creator is being built! You\'ll be able to design and send beautiful themed invitations right from the app.'
                : 'Our Themed Label Maker is on the way! Create custom food and drink labels that match your party theme.'}
            </p>
            <button onClick={() => setComingSoonModal(null)} className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3 rounded-xl font-bold hover:shadow-xl transition-all">
              Got It!
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b-4 border-rose-300 shadow-sm sticky top-0 z-40 no-print">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-pink-400 to-rose-400 p-3 rounded-2xl shadow-lg rotate-12 hover:rotate-0 transition-transform">
              <Cake className="text-white" size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                Plan My Party Pal
              </h1>
              <p className="text-sm text-rose-600 font-medium">Your Birthday Planning Companion</p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        <div className="flex items-center justify-between mb-10 bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-md no-print">
          {STEP_LABELS.map((label, idx) => (
            <React.Fragment key={label}>
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-lg transition-all ${
                  step > idx + 1 ? 'bg-green-400 text-white shadow-lg scale-110' :
                  step === idx + 1 ? 'bg-gradient-to-br from-pink-400 to-rose-400 text-white shadow-lg scale-110' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {step > idx + 1 ? <CheckCircle2 size={22} /> : idx + 1}
                </div>
                <span className={`font-semibold hidden md:block text-sm ${step === idx + 1 ? 'text-rose-600' : 'text-gray-500'}`}>{label}</span>
              </div>
              {idx < STEP_LABELS.length - 1 && <div className={`flex-1 h-1 mx-1 sm:mx-2 rounded-full ${step > idx + 1 ? 'bg-green-400' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* ═══════ STEP 1: BASICS ═══════ */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-200 relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="text-rose-500" size={32} />
              <h2 className="text-3xl font-bold text-gray-800">Let's Start Planning!</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Birthday Child's Name</label>
                <input type="text" value={partyData.childName} onChange={e => updateField('childName', e.target.value)} placeholder="Emma" className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none transition-all text-lg" />
              </div>

              {/* Optional gender toggle */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Party Style <span className="text-gray-400 font-normal">(optional — helps filter themes)</span></label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'boy', label: 'Boy Themes', grad: 'from-blue-400 to-indigo-400', border: 'border-blue-500', bg: 'from-blue-50 to-indigo-50' },
                    { value: 'girl', label: 'Girl Themes', grad: 'from-pink-400 to-rose-400', border: 'border-pink-500', bg: 'from-pink-50 to-rose-50' },
                    { value: 'both', label: 'All Themes', grad: 'from-purple-400 to-violet-400', border: 'border-purple-500', bg: 'from-purple-50 to-violet-50' },
                  ].map(o => (
                    <button key={o.value} onClick={() => updateField('genderCategory', partyData.genderCategory === o.value ? '' : o.value)}
                      className={`p-3 rounded-xl font-bold text-sm transition-all border-2 ${partyData.genderCategory === o.value ? `bg-gradient-to-r ${o.grad} text-white ${o.border} shadow-xl scale-105` : `bg-gradient-to-r ${o.bg} border-gray-200 text-gray-700 hover:shadow-lg`}`}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Age Turning</label>
                  <input type="number" value={partyData.age} onChange={e => updateField('age', e.target.value)} placeholder="5" className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none transition-all text-lg" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Party Date</label>
                  <input type="date" value={partyData.date} onChange={e => updateField('date', e.target.value)} className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none transition-all text-lg" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Party Time</label>
                <input type="time" value={partyData.partyTime} onChange={e => updateField('partyTime', e.target.value)} className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none transition-all text-lg" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Guest Count</label>
                  <input
                    type="number"
                    value={partyData.guestCount}
                    onChange={e => updateField('guestCount', e.target.value)}
                    placeholder="15"
                    className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none transition-all text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Budget ($)</label>
                  <input type="number" value={partyData.budget} onChange={e => updateField('budget', e.target.value)} placeholder="300" className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none transition-all text-lg" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Your Location</label>
                <input type="text" value={partyData.location} onChange={e => updateField('location', e.target.value)} placeholder="City, State or ZIP" className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none transition-all text-lg" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Phone Number <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input type="tel" value={partyData.phone} onChange={e => updateField('phone', e.target.value)} placeholder="(555) 123-4567" className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none transition-all text-lg" />
              </div>

              <button onClick={() => setStep(2)} disabled={!partyData.childName || !partyData.age || !partyData.budget || !partyData.guestCount}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2">
                Continue <ChevronRight size={24} />
              </button>
            </div>
          </div>
        )}

        {/* ═══════ STEP 2: EMAIL GATE ═══════ */}
        {step === 2 && (
          <EmailGate
            partyData={partyData}
            onContinue={(email) => {
              setUserEmail(email);
              setGuestMode(false);
              setStep(3);
            }}
            onGuestContinue={() => {
              setGuestMode(true);
              setUserEmail('');
              setStep(3);
            }}
          />
        )}

        {/* ═══════ STEP 3: VENUE ═══════ */}
        {step === 3 && (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-200 relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <MapPin className="text-blue-500" size={32} />
                <h2 className="text-3xl font-bold text-gray-800">Pick Your Venue</h2>
              </div>
              <button onClick={() => setStep(2)} className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-sm font-semibold"><ChevronLeft size={18} /> Back</button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {venueCategories.map(type => (
                <button key={type} onClick={() => { updateField('venueType', type); setCustomVenueSearch(''); searchVenues(type); }}
                  className={`p-3 rounded-xl font-bold text-sm transition-all border-2 ${partyData.venueType === type ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-rose-600 shadow-xl scale-105' : 'bg-white border-pink-200 text-gray-700 hover:border-rose-400 hover:shadow-lg'}`}>
                  {type}
                </button>
              ))}
            </div>

            {/* Custom Venue Search Bar */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <label className="block text-sm font-bold text-blue-700 mb-2">🔍 Search for a specific venue</label>
              <div className="flex gap-2">
                <input type="text" value={customVenueSearch} onChange={e => setCustomVenueSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCustomVenueSearch()}
                  placeholder="e.g., Chuck E. Cheese, Sky Zone, Central Park..."
                  className="flex-1 min-w-0 px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-base" />
                <button onClick={handleCustomVenueSearch} disabled={!customVenueSearch.trim() || !partyData.location || venueLoading}
                  className="px-5 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all disabled:opacity-40 flex items-center gap-1 flex-shrink-0">
                  <Search size={18} /> Search
                </button>
              </div>
              {!partyData.location && (
                <p className="text-xs text-amber-600 mt-2 font-semibold">⚠️ Add your location on Step 1 first to search venues near you</p>
              )}
            </div>

            {/* Radius Selector */}
            {partyData.venueType && partyData.venueType !== 'Home' && (
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-bold text-gray-600">Search within:</span>
                <div className="flex gap-2">
                  {[5, 10].map(r => (
                    <button key={r} onClick={() => { setVenueRadius(r); if (partyData.venueType && partyData.venueType !== 'Home') searchVenues(partyData.venueType, r); }}
                      className={`px-4 py-2 rounded-lg font-bold text-sm transition-all border-2 ${venueRadius === r ? 'bg-blue-500 text-white border-blue-600' : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'}`}>
                      {r} miles
                    </button>
                  ))}
                </div>
              </div>
            )}

            {partyData.venueType && partyData.venueType !== 'Home' && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Search className="text-blue-500" size={20} />
                  <h3 className="text-xl font-bold text-gray-800">
                    {venueLocation ? `Near ${venueLocation}` : `Nearby Options (within ${venueRadius} miles)`}
                  </h3>
                </div>

                {!partyData.location && (
                  <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl mb-4">
                    <p className="text-amber-700 font-semibold">💡 Enter your City/State or ZIP on Step 1 to see real venues near you!</p>
                    <button onClick={() => setStep(1)} className="mt-2 text-sm text-rose-500 underline font-bold">← Go back to basics and add location</button>
                  </div>
                )}

                {venueLoading ? (
                  <div className="flex items-center justify-center py-8 gap-3">
                    <div className="w-6 h-6 border-3 border-pink-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-gray-600 font-semibold">Searching real venues near you...</span>
                  </div>
                ) : matchingVenues.length > 0 ? (
                  <div className="grid gap-3">
                    {matchingVenues.map((v, i) => (
                      <div key={i} className="p-4 border-2 border-blue-200 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:shadow-lg transition-all">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800 text-lg">{v.name}</h4>
                            {v.address && <p className="text-sm text-gray-500 mt-0.5">{v.address}</p>}
                            <p className="text-sm text-gray-600 mt-1">{v.type} &bull; {v.distance} away</p>
                            <div className="flex items-center gap-3 mt-2 text-sm flex-wrap">
                              {v.rating > 0 && (
                                <span className="flex items-center gap-1 text-amber-600">
                                  <Star size={14} fill="currentColor" /> {v.rating}
                                  {v.totalRatings > 0 && <span className="text-gray-400">({v.totalRatings})</span>}
                                </span>
                              )}
                              {v.phone && <span className="flex items-center gap-1 text-gray-500"><Phone size={14} /> {v.phone}</span>}
                              {v.isOpen !== null && (
                                <span className={`font-semibold ${v.isOpen ? 'text-green-600' : 'text-red-500'}`}>
                                  {v.isOpen ? '● Open now' : '● Closed'}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              {v.placeId && (
                                <a href={`https://www.google.com/maps/place/?q=place_id:${v.placeId}`} target="_blank" rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:text-blue-800 font-semibold underline">
                                  View on Maps →
                                </a>
                              )}
                              <button onClick={() => { updateField('venueName', v.name); updateField('venueAddress', v.address || ''); }}
                                className={`text-sm font-bold px-3 py-1 rounded-lg transition-all ${partyData.venueName === v.name ? 'bg-green-500 text-white' : 'bg-rose-500 text-white hover:bg-rose-600'}`}>
                                {partyData.venueName === v.name ? '✓ Selected' : 'Choose This Venue'}
                              </button>
                            </div>
                          </div>
                          <span className={`text-sm font-bold px-3 py-1 rounded-lg whitespace-nowrap self-start ${v.priceRange === 'Free' || v.priceRange === '$' ? 'bg-green-100 text-green-700' : v.priceRange === '$$' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{v.priceRange}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">{venueError || 'No matching venues found. Try a different category.'}</p>
                )}
                {liveVenues.length > 0 && (
                  <p className="text-xs text-green-600 mt-3 font-semibold">✅ Showing real venues from Google Places (within {venueRadius} mi)</p>
                )}
                {liveVenues.length === 0 && matchingVenues.length > 0 && (
                  <p className="text-xs text-gray-400 mt-3 italic">Sample data shown — add your location on Step 1 for real results!</p>
                )}
              </div>
            )}

            {/* Selected venue display / manual entry */}
            {partyData.venueType && (
              <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {partyData.venueType === 'Home' ? '📍 Your Address (for the invite)' : '📍 Venue Name (for the invite)'}
                </label>
                <input type="text" value={partyData.venueName}
                  onChange={e => updateField('venueName', e.target.value)}
                  placeholder={partyData.venueType === 'Home' ? '123 Main St, Your City' : 'Type or select a venue above'}
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-100 outline-none transition-all text-lg" />
                {partyData.venueName && (
                  <p className="text-sm text-green-700 mt-2 font-semibold">✅ This will appear on your invite: {partyData.venueName}</p>
                )}
              </div>
            )}

            <button onClick={() => setStep(4)} disabled={!partyData.venueType}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2">
              Continue to Theme Selection <ChevronRight size={24} />
            </button>
          </div>
        )}

        {/* ═══════ STEP 4: THEME ═══════ */}
        {step === 4 && (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-200 relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Sparkles className="text-amber-500" size={32} />
                <h2 className="text-3xl font-bold text-gray-800">Choose a Theme</h2>
              </div>
              <button onClick={() => setStep(3)} className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-sm font-semibold"><ChevronLeft size={18} /> Back</button>
            </div>

            {/* AI suggestions */}
            <button onClick={generateThemeSuggestions} disabled={loading}
              className="w-full mb-6 bg-gradient-to-r from-amber-400 to-orange-400 text-white py-3 rounded-xl font-bold text-base hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
              {loading ? (<><div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" /> Generating Ideas...</>) : (<><Sparkles size={20} /> Get AI-Powered Theme Suggestions</>)}
            </button>

            {suggestions.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-amber-600 mb-3">AI Suggestions</h3>
                <div className="grid gap-3">
                  {suggestions.map((t, i) => (
                    <button key={`ai-${i}`} onClick={() => { updateField('theme', t.name); setStep(5); }}
                      className="text-left p-5 rounded-2xl transition-all border-2 hover:shadow-xl group border-amber-200 hover:border-amber-400 bg-gradient-to-r from-amber-50 to-orange-50">
                      <div className="flex justify-between items-start">
                        <div><h4 className="text-lg font-bold text-gray-800 group-hover:text-amber-600">{t.name}</h4><p className="text-gray-600 text-sm mt-1">{t.description}</p></div>
                        <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-lg">{t.costTier || '$$'}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Character Themes */}
            <h3 className="text-lg font-bold text-purple-600 mb-3 flex items-center gap-2"><Star size={18} /> Character Themes</h3>
            <div className="grid gap-3 mb-6 max-h-[350px] overflow-y-auto pr-2">
              {characterThemes.map((t, i) => (
                <button key={`char-${i}`} onClick={() => { updateField('theme', t.name); setStep(5); }}
                  className={`text-left p-4 rounded-2xl transition-all border-2 hover:shadow-xl group ${partyData.theme === t.name ? 'border-purple-400 bg-purple-50 shadow-lg' : 'border-purple-200 hover:border-purple-400 bg-gradient-to-r from-purple-50 to-violet-50'}`}>
                  <div className="flex justify-between items-start">
                    <div><h4 className="text-lg font-bold text-gray-800 group-hover:text-purple-600">{t.name}</h4><p className="text-gray-600 text-sm mt-1">{t.description}</p></div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded-lg">{t.costTier}</span>
                      <span className="text-xs text-gray-500">Ages {t.ageRange}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Classic Themes */}
            <h3 className="text-lg font-bold text-gray-700 mb-3">Classic Themes</h3>
            <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2">
              {filteredThemes.map((t, i) => (
                <button key={i} onClick={() => { updateField('theme', t.name); setStep(5); }}
                  className={`text-left p-4 rounded-2xl transition-all border-2 hover:shadow-xl group ${partyData.theme === t.name ? 'border-rose-400 bg-rose-50 shadow-lg' : 'border-pink-200 hover:border-rose-400 bg-gradient-to-r from-pink-50 to-rose-50'}`}>
                  <div className="flex justify-between items-start">
                    <div><h4 className="text-lg font-bold text-gray-800 group-hover:text-rose-600">{t.name}</h4><p className="text-gray-600 text-sm mt-1">{t.description}</p></div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-bold text-rose-600 bg-rose-100 px-2 py-1 rounded-lg">{t.costTier}</span>
                      <span className="text-xs text-gray-500">Ages {t.ageRange}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Custom theme + Hire Character */}
            <div className="mt-6 pt-6 border-t-2 border-pink-100">
              <label className="block text-sm font-bold text-gray-700 mb-2">Or enter your own theme</label>
              <div className="flex gap-2">
                <input type="text" value={partyData.theme} onChange={e => updateField('theme', e.target.value)} placeholder="e.g., Unicorn Magic, Superhero Academy" className="flex-1 px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none transition-all text-lg" />
                <button onClick={() => setStep(5)} disabled={!partyData.theme}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50">Next</button>
              </div>

              {/* Hire a Character toggle */}
              {partyData.theme && characterThemes.some(t => t.name === partyData.theme) && (
                <div className="mt-4 p-4 bg-purple-50 border-2 border-purple-200 rounded-xl">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={hireCharacter} onChange={e => setHireCharacter(e.target.checked)} className="w-5 h-5 accent-purple-500 rounded" />
                    <div>
                      <span className="font-bold text-purple-700 flex items-center gap-2"><UserPlus size={18} /> Hire a {partyData.theme} Character Performer</span>
                      <p className="text-sm text-gray-600">Add a professional costumed performer to your party ($100-250)</p>
                    </div>
                  </label>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════ STEP 5: ACTIVITIES ═══════ */}
        {step === 5 && (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-200 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <PartyPopper className="text-violet-500" size={32} />
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">Pick Your Activities</h2>
                  <p className="text-gray-500 text-sm">
                    Showing activities for age {partyData.age} ({getAgeGroup(partyData.age).replace('youngKids', 'Young Kids')}) — select as many as you'd like!
                  </p>
                </div>
              </div>
              <button onClick={() => setStep(4)} className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-sm font-semibold"><ChevronLeft size={18} /> Back</button>
            </div>

            {partyData.selectedActivities.length > 0 && (
              <div className="mb-6 p-4 bg-violet-50 rounded-xl border-2 border-violet-200">
                <p className="text-violet-700 font-bold text-sm mb-2">{partyData.selectedActivities.length} activit{partyData.selectedActivities.length === 1 ? 'y' : 'ies'} selected</p>
                <div className="flex flex-wrap gap-2">
                  {partyData.selectedActivities.map(name => (
                    <span key={name} className="inline-flex items-center gap-1 bg-violet-200 text-violet-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {name} <button onClick={() => toggleActivity(name)} className="hover:text-violet-600"><X size={14} /></button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-3 max-h-[500px] overflow-y-auto pr-2">
              {filteredActivities.map((a, i) => {
                const sel = partyData.selectedActivities.includes(a.name);
                return (
                  <button key={i} onClick={() => toggleActivity(a.name)}
                    className={`text-left p-5 rounded-2xl transition-all border-2 group ${sel ? 'border-violet-400 bg-violet-50 shadow-lg' : 'border-pink-200 hover:border-violet-300 bg-white hover:shadow-lg'}`}>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0">
                        {sel ? <CheckCircle2 className="text-violet-500" size={24} /> : <Circle className="text-gray-300 group-hover:text-violet-300" size={24} />}
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-lg font-bold ${sel ? 'text-violet-700' : 'text-gray-800'}`}>{a.name}</h4>
                        <p className="text-gray-600 text-sm mt-1">{a.description}</p>
                        <div className="flex gap-3 mt-2 text-xs">
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">Ages {a.ageRange}</span>
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">{a.difficulty}</span>
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg">{a.supplyCost}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button onClick={() => { generateChecklist(); setStep(6); }}
              className="w-full mt-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
              Generate My Party Checklist & Shopping List <ChevronRight size={24} />
            </button>
          </div>
        )}


        {/* ═══════ STEP 6: CHECKLIST ═══════ */}
        {step === 6 && (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-200 relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <ShoppingCart className="text-green-500" size={32} />
                  <h2 className="text-3xl font-bold text-gray-800">Your Party Checklist</h2>
                </div>
                <p className="text-gray-600">{partyData.childName}'s {partyData.theme} Party &bull; {partyData.guestCount} guests &bull; ${partyData.budget} budget</p>
                {partyData.selectedActivities.length > 0 && <p className="text-sm text-violet-600 mt-1">Activities: {partyData.selectedActivities.join(', ')}</p>}
              </div>
              <button onClick={() => setStep(5)} className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-sm font-semibold no-print"><ChevronLeft size={18} /> Back</button>
            </div>

            {loading && (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600 font-semibold">Creating your custom checklist with shopping links...</p>
              </div>
            )}

            {!loading && checklist.length > 0 && (
              <div className="space-y-6">
                {/* Progress */}
                <div className="bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-400 to-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${totalZoneItems > 0 ? (totalZoneCompleted / totalZoneItems) * 100 : 0}%` }} />
                </div>
                <p className="text-sm text-gray-600 font-semibold">{totalZoneCompleted} of {totalZoneItems} items completed {Object.values(excludedItems).filter(Boolean).length > 0 && <span className="text-gray-400">({Object.values(excludedItems).filter(Boolean).length} excluded)</span>}</p>

                {/* Weather Alert (outdoor venues) */}
                <WeatherAlert date={partyData.date} location={partyData.location} venueType={partyData.venueType} />

                {/* Digital Invite Card — screenshot/download and send */}
                <InviteCard partyData={partyData} />

                {/* Guest Invite List — track who you're inviting */}
                <GuestList partyData={partyData} />

                {/* Timeline Builder (Pro+) */}
                <TierGate feature="timelineBuilder">
                  <TimelineBuilder timeline={timeline} onTimelineChange={setTimeline} partyData={partyData} />
                </TierGate>

                {/* Food & Drink Labels — Etsy */}
                <div className="no-print">
                  <a href="https://www.etsy.com/shop/gotinatravels" target="_blank" rel="noopener noreferrer"
                    className="block w-full p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl hover:shadow-lg hover:border-orange-400 transition-all text-left group">
                    <div className="flex items-center gap-3">
                      <Tag className="text-orange-500" size={28} />
                      <div>
                        <h4 className="font-bold text-orange-700 group-hover:text-orange-600">Shop Food & Drink Labels on Etsy</h4>
                        <p className="text-sm text-gray-600">Printable themed labels for your party table</p>
                      </div>
                      <ExternalLink className="text-orange-300 ml-auto flex-shrink-0" size={20} />
                    </div>
                  </a>
                </div>

                {/* Gift Ideas Section - Optional */}
                {filteredGifts.length > 0 && (
                  <div className="no-print">
                    <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl border-2 border-pink-200 p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-3 rounded-xl flex-shrink-0">
                          <Gift size={32} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 mb-2">
                            🎁 Need Gift Ideas for {partyData.childName}?
                          </h3>
                          <p className="text-gray-600 mb-4">
                            Browse {filteredGifts.length} curated gift suggestions for age {partyData.age} - from popular toys to unique finds!
                          </p>
                          <button
                            onClick={() => setShowGiftIdeas(true)}
                            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2"
                          >
                            Browse Gift Ideas <ChevronRight size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cake Ordering */}
                <div className="p-6 bg-amber-50 rounded-2xl border-2 border-amber-200 no-print">
                  <h3 className="text-xl font-bold text-amber-800 mb-4 flex items-center gap-2"><Cake size={24} /> Order Your Cake</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {bakeryLinks.chains.map((b, i) => (
                      <a key={i} href={b.url} target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-xl border-2 border-amber-100 hover:border-amber-300 hover:shadow-lg transition-all flex items-center gap-3">
                        <ExternalLink size={16} className="text-amber-500 flex-shrink-0" />
                        <div><p className="font-bold text-gray-800">{b.name}</p><p className="text-sm text-gray-600">{b.description}</p></div>
                      </a>
                    ))}
                  </div>
                  {partyData.location && (
                    <div className="mt-4 flex gap-2">
                      <a href={bakeryLinks.searchLocal.google(partyData.location)} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2 bg-amber-400 text-white rounded-xl font-bold hover:bg-amber-500 transition-all">Find Local Cake Makers</a>
                      <a href={bakeryLinks.searchLocal.yelp(partyData.location)} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2 bg-red-400 text-white rounded-xl font-bold hover:bg-red-500 transition-all">Search Yelp</a>
                    </div>
                  )}
                </div>

                {/* Hire Help */}
                <div className="p-6 bg-violet-50 rounded-2xl border-2 border-violet-200 no-print">
                  <h3 className="text-xl font-bold text-violet-800 mb-4 flex items-center gap-2"><Users size={24} /> Hire Party Help</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { label: 'Face Painter', search: 'face painter for birthday party near me' },
                      { label: 'Balloon Artist', search: 'balloon artist birthday party near me' },
                      { label: 'Bounce House / Slide', search: 'bounce house rental birthday party near me' },
                      { label: 'Party Helper', search: 'party assistant helper near me' },
                      { label: 'DJ / Music', search: 'kids party DJ near me' },
                      ...(hireCharacter ? [{ label: `${partyData.theme} Character`, search: `hire ${partyData.theme} character performer near me` }] : []),
                    ].map((item, i) => (
                      <a key={i} href={`https://www.google.com/search?q=${encodeURIComponent(item.search + (partyData.location ? ' ' + partyData.location : ''))}`} target="_blank" rel="noopener noreferrer"
                        className="p-3 bg-white rounded-xl border-2 border-violet-100 hover:border-violet-300 hover:shadow-lg transition-all flex items-center gap-3">
                        <Search size={16} className="text-violet-500" /><span className="font-bold text-gray-800">{item.label}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* ═══════ UNIFIED PARTY ZONES — All Items Merged ═══════ */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🗺️</span>
                    <div>
                      <h3 className="text-xl font-bold text-emerald-800">Your Complete Party Plan by Zone</h3>
                      <p className="text-sm text-gray-500">Everything organized by area. Tap the <EyeOff size={14} className="inline text-gray-400" /> icon to remove items you don't need.</p>
                    </div>
                  </div>

                  {mergedZones.map(zone => {
                    const zoneColorMap = {
                      rose: 'border-rose-200 bg-rose-50',
                      blue: 'border-blue-200 bg-blue-50',
                      amber: 'border-amber-200 bg-amber-50',
                      cyan: 'border-cyan-200 bg-cyan-50',
                      pink: 'border-pink-200 bg-pink-50',
                      violet: 'border-violet-200 bg-violet-50',
                      orange: 'border-orange-200 bg-orange-50',
                      gray: 'border-gray-200 bg-gray-50',
                    };
                    const zoneTextMap = {
                      rose: 'text-rose-700',
                      blue: 'text-blue-700',
                      amber: 'text-amber-700',
                      cyan: 'text-cyan-700',
                      pink: 'text-pink-700',
                      violet: 'text-violet-700',
                      orange: 'text-orange-700',
                      gray: 'text-gray-700',
                    };

                    const activeItems = zone.allItems.filter(item => {
                      const key = item._type === 'zone' ? item._zoneKey : `checklist-${item._checklistIdx}`;
                      return !excludedItems[key];
                    });
                    const excludedCount = zone.allItems.length - activeItems.length;
                    const zoneCompleted = activeItems.filter(item => {
                      if (item._type === 'zone') return zoneChecks[item._zoneKey] || false;
                      return item.completed || false;
                    }).length;

                    return (
                      <div key={zone.id} className={`rounded-xl border-2 ${zoneColorMap[zone.color] || 'border-gray-200 bg-gray-50'} p-4`}>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className={`font-bold text-lg flex items-center gap-2 ${zoneTextMap[zone.color] || 'text-gray-700'}`}>
                            <span className="text-xl">{zone.emoji}</span> {zone.name}
                          </h4>
                          <span className="text-xs text-gray-500 font-semibold">{zoneCompleted}/{activeItems.length} done{excludedCount > 0 && ` · ${excludedCount} hidden`}</span>
                        </div>

                        <div className="space-y-2">
                          {zone.allItems.map((item, idx) => {
                            const itemKey = item._type === 'zone' ? item._zoneKey : `checklist-${item._checklistIdx}`;
                            const isExcluded = excludedItems[itemKey] || false;
                            const isChecked = item._type === 'zone'
                              ? (zoneChecks[item._zoneKey] || false)
                              : (item.completed || false);

                            const handleToggleCheck = () => {
                              if (isExcluded) return;
                              if (item._type === 'zone') {
                                const parts = item._zoneKey.split('-');
                                toggleZoneCheck(parts[0], parseInt(parts[1]));
                              } else {
                                toggleChecklistItem(item._checklistIdx);
                              }
                            };

                            const searchTerms = item.searchTerms || '';
                            const cost = item.estimatedCost || '';
                            const isChecklistItem = item._type === 'checklist';
                            const priorityColor = item.priority === 'high' ? 'bg-red-100 text-red-600' : item.priority === 'medium' ? 'bg-amber-100 text-amber-600' : item.priority === 'low' ? 'bg-blue-100 text-blue-600' : '';

                            return (
                              <div key={`${zone.id}-${idx}`} className={`p-2.5 sm:p-3 rounded-lg border transition-all ${
                                isExcluded ? 'bg-gray-50 border-gray-100 opacity-40' :
                                isChecked ? 'bg-green-50 border-green-200 opacity-70' :
                                'bg-white border-gray-100 hover:border-gray-300'
                              }`}>
                                <div className="flex items-start gap-2">
                                  {/* Check/uncheck button */}
                                  <button onClick={handleToggleCheck} className="mt-0.5 flex-shrink-0" disabled={isExcluded}>
                                    {isExcluded ? <Circle className="text-gray-200" size={20} /> :
                                     isChecked ? <CheckCircle2 className="text-green-500" size={20} /> :
                                     <Circle className="text-gray-300 hover:text-emerald-400" size={20} />}
                                  </button>

                                  {/* Item content — full width, wraps properly */}
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm break-words ${isExcluded ? 'line-through text-gray-300' : isChecked ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                      {zone.id === 'foodmenu' && partyData.theme ? getThemedFoodName(item.task, partyData.theme) : item.task}
                                    </p>
                                    {/* Tags + cost + shop — all wrap on mobile */}
                                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                      {item.priority && (
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${priorityColor}`}>{item.priority}</span>
                                      )}
                                      {isChecklistItem && item.category && (
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${categoryColors[item.category] || 'text-gray-600 bg-gray-100'}`}>{item.category}</span>
                                      )}
                                      {cost && !isExcluded && <span className="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded font-semibold">{cost}</span>}
                                      {searchTerms && !isExcluded && (
                                        <a href={getAmazonSearchUrl(searchTerms)} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                                          className="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-2 py-0.5 rounded text-xs font-bold hover:shadow-lg transition-all flex items-center gap-1 no-print">
                                          <ShoppingCart size={10} /> Shop
                                        </a>
                                      )}
                                      {item.spotifyLink && !isExcluded && (
                                        <div className="flex items-center gap-1.5 flex-wrap no-print">
                                          <a href="https://open.spotify.com/playlist/1P27ra5VqAizmkcUzVAvp2" target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                                            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-0.5 rounded text-xs font-bold hover:shadow-lg transition-all flex items-center gap-1">
                                            🎵 Spotify Kids Party Mix
                                          </a>
                                          <a href="https://open.spotify.com/track/5c2GZ53Zogjm680BaGRTfD" target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                                            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-2 py-0.5 rounded text-xs font-bold hover:shadow-lg transition-all flex items-center gap-1">
                                            🎤 Zoey Zest on Spotify
                                          </a>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Exclude toggle — stays right-aligned */}
                                  <button
                                    onClick={() => toggleExcludeItem(itemKey)}
                                    className="no-print p-1 rounded-md hover:bg-gray-200 transition-colors flex-shrink-0"
                                    title={isExcluded ? 'Include this item' : 'Exclude this item — I don\'t need it'}
                                  >
                                    {isExcluded ? <Eye size={16} className="text-gray-400 hover:text-emerald-500" /> : <EyeOff size={16} className="text-gray-300 hover:text-red-400" />}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Budget Tracker — above exports so you can see your totals before downloading */}
                <BudgetTracker checklist={checklist} budget={partyData.budget} />

                {/* Export Buttons */}
                <div className="flex flex-wrap gap-3 mt-6 no-print">
                  <button onClick={downloadChecklist} className="flex-1 min-w-[140px] bg-blue-500 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2"><Download size={20} /> Download List</button>
                  <TierGate feature="downloadPDF" inline>
                    <button onClick={() => downloadPartyPDF(partyData, checklist, mergedZones, excludedItems, zoneChecks, timeline)} className="flex-1 min-w-[140px] bg-purple-500 text-white py-3 rounded-xl font-bold hover:bg-purple-600 transition-all flex items-center justify-center gap-2"><FileDown size={20} /> PDF Party Kit</button>
                  </TierGate>
                  <button onClick={() => window.print()} className="flex-1 min-w-[140px] bg-gray-500 text-white py-3 rounded-xl font-bold hover:bg-gray-600 transition-all flex items-center justify-center gap-2"><Printer size={20} /> Print</button>
                  <TierGate feature="shareChecklist" inline>
                    <ShareButton partyData={partyData} checklist={checklist} />
                  </TierGate>
                </div>

                {/* Email Capture */}
                <div className="no-print">
                  <EmailCapture source="checklist" partyData={partyData} mergedZones={mergedZones} excludedItems={excludedItems} zoneChecks={zoneChecks} />
                </div>

                {/* Summary */}
                <div className="mt-6 p-6 bg-gradient-to-r from-pink-100 to-rose-100 rounded-2xl border-2 border-pink-300">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">
                    {totalZoneCompleted === totalZoneItems && totalZoneItems > 0 ? 'Everything\'s ready — time to celebrate!' : 'You\'re doing great!'}
                  </h3>
                  <p className="text-gray-700">{totalZoneCompleted} of {totalZoneItems} items completed. {totalZoneCompleted < totalZoneItems && 'Keep going, you\'ve got this!'}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Gift Ideas Modal Overlay */}
        {showGiftIdeas && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full my-8 max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-pink-200 p-6 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-1">
                    🎁 Gift Ideas for {partyData.childName}
                  </h2>
                  <p className="text-gray-600">
                    Age {partyData.age} • {filteredGifts.length} curated suggestions
                  </p>
                </div>
                <button
                  onClick={() => setShowGiftIdeas(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8">
                {/* Filter Toggles */}
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl border-2 border-pink-200 p-6 mb-6">
                  <div className="space-y-4">
                    {/* Type Filter */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Filter by Type:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['All', 'Toys', 'Books', 'Games', 'Outdoor', 'Creative'].map(type => (
                          <button
                            key={type}
                            onClick={() => setGiftTypeFilter(type.toLowerCase())}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                              giftTypeFilter === type.toLowerCase()
                                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                                : 'bg-white text-gray-700 border-2 border-pink-200 hover:border-pink-400'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price Filter */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Filter by Price Range:
                      </label>
                      <div className="flex gap-2">
                        {['All', '$', '$$', '$$$'].map(price => (
                          <button
                            key={price}
                            onClick={() => setGiftPriceFilter(price)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                              giftPriceFilter === price
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                                : 'bg-white text-gray-700 border-2 border-green-200 hover:border-green-400'
                            }`}
                          >
                            {price === 'All' ? 'All Prices' : price}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected Gifts Display */}
                {partyData.selectedGifts.length > 0 && (
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl border-2 border-pink-200 p-4 mb-4">
                    <p className="text-sm font-bold text-gray-700 mb-2">
                      {partyData.selectedGifts.length} gift{partyData.selectedGifts.length !== 1 ? 's' : ''} saved for reference
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {partyData.selectedGifts.map(giftId => {
                        const gift = filteredGifts.find(g => g.id === giftId);
                        if (!gift) return null;
                        return (
                          <div key={giftId} className="bg-white px-3 py-1 rounded-full border-2 border-pink-300 flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-700">{gift.name}</span>
                            <button
                              onClick={() => updateField('selectedGifts', partyData.selectedGifts.filter(id => id !== giftId))}
                              className="text-pink-500 hover:text-pink-700 font-bold"
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Gift Grid */}
                {filteredGifts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredGifts.map(gift => {
                      const isSelected = partyData.selectedGifts.includes(gift.id);
                      return (
                        <div
                          key={gift.id}
                          className={`relative rounded-xl border-2 p-4 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-pink-500 bg-pink-50 shadow-lg scale-[1.02]'
                              : 'border-gray-200 bg-white hover:border-pink-300 hover:shadow-md'
                          }`}
                          onClick={() => {
                            if (isSelected) {
                              updateField('selectedGifts', partyData.selectedGifts.filter(id => id !== gift.id));
                            } else {
                              updateField('selectedGifts', [...partyData.selectedGifts, gift.id]);
                            }
                          }}
                        >
                          {/* Selection Indicator */}
                          <div className="absolute top-3 right-3">
                            {isSelected ? (
                              <CheckCircle2 className="h-6 w-6 text-pink-500" />
                            ) : (
                              <Circle className="h-6 w-6 text-gray-300" />
                            )}
                          </div>

                          {/* Gift Content */}
                          <div className="pr-8">
                            <h3 className="font-bold text-gray-800 mb-1">{gift.name}</h3>
                            <p className="text-sm text-gray-600 mb-3">{gift.description}</p>

                            {/* Tags Row */}
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className="text-xs font-bold px-2 py-0.5 rounded bg-green-100 text-green-700">
                                {gift.price}
                              </span>
                              {gift.popular && (
                                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-700">
                                  ⭐ Popular
                                </span>
                              )}
                              {gift.unique && (
                                <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                                  ✨ Unique
                                </span>
                              )}
                            </div>

                            {/* Why This Gift */}
                            <p className="text-xs text-gray-500 italic mb-3">{gift.why}</p>

                            {/* Amazon Link */}
                            <a
                              href={`https://www.amazon.com/s?k=${encodeURIComponent(gift.amazonSearch)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-sm font-semibold text-pink-600 hover:text-pink-800"
                            >
                              Shop on Amazon
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl">
                    <p className="text-gray-600 mb-2">No gifts match your filters</p>
                    <button
                      onClick={() => {
                        setGiftTypeFilter('all');
                        setGiftPriceFilter('All');
                      }}
                      className="text-pink-600 font-semibold hover:underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>

              {/* Footer with Close Button */}
              <div className="sticky bottom-0 bg-white border-t-2 border-pink-200 p-6 flex justify-end">
                <button
                  onClick={() => setShowGiftIdeas(false)}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all"
                >
                  Done Browsing
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Checklist Item Sub-component ─────────────────────────────────────────────
function ChecklistItem({ item, idx, toggle, showCategory, categoryColors }) {
  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all ${item.completed ? 'bg-green-50 border-green-200 opacity-70' : 'bg-white border-pink-100 hover:border-rose-300 hover:shadow-md'}`}>
      <button onClick={() => toggle(idx)} className="mt-1 flex-shrink-0">
        {item.completed ? <CheckCircle2 className="text-green-500" size={24} /> : <Circle className="text-gray-300 hover:text-rose-400" size={24} />}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold ${item.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>{item.task}</p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {showCategory && categoryColors && <span className={`text-xs font-bold px-2 py-0.5 rounded ${categoryColors[item.category] || 'text-gray-600 bg-gray-100'}`}>{item.category}</span>}
          <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.priority === 'high' ? 'bg-red-100 text-red-600' : item.priority === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>{item.priority}</span>
          {item.estimatedCost && <span className="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded font-semibold">{item.estimatedCost}</span>}
        </div>
      </div>
      {item.searchTerms && (
        <a href={getAmazonSearchUrl(item.searchTerms)} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
          className="flex-shrink-0 bg-gradient-to-r from-amber-400 to-orange-400 text-white px-3 py-2 rounded-lg text-xs font-bold hover:shadow-lg transition-all flex items-center gap-1 no-print">
          <ShoppingCart size={14} /> Shop
        </a>
      )}
    </div>
  );
}
