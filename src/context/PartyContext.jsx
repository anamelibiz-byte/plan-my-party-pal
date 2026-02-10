import React, { createContext, useContext, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const PartyContext = createContext(null);

const DEFAULT_PARTY_DATA = {
  childName: '', age: '', date: '', budget: '', guestCount: '',
  location: '', genderCategory: '', theme: '', venueType: '', selectedActivities: [],
};

export function PartyProvider({ children }) {
  const [partyData, setPartyData] = useLocalStorage('pp_party_data', DEFAULT_PARTY_DATA);
  const [checklist, setChecklist] = useLocalStorage('pp_checklist', []);
  const [suggestions, setSuggestions] = useLocalStorage('pp_suggestions', []);
  const [step, setStep] = useLocalStorage('pp_step', 1);
  const [hireCharacter, setHireCharacter] = useLocalStorage('pp_hire_character', false);
  const [zoneChecks, setZoneChecks] = useLocalStorage('pp_zone_checks', {});
  const [rsvpId, setRsvpId] = useLocalStorage('pp_rsvp_id', null);
  const [timeline, setTimeline] = useLocalStorage('pp_timeline', []);

  const updateField = useCallback((field, value) => {
    setPartyData(prev => ({ ...prev, [field]: value }));
  }, [setPartyData]);

  const toggleActivity = useCallback((name) => {
    setPartyData(prev => ({
      ...prev,
      selectedActivities: prev.selectedActivities.includes(name)
        ? prev.selectedActivities.filter(a => a !== name)
        : [...prev.selectedActivities, name],
    }));
  }, [setPartyData]);

  const toggleChecklistItem = useCallback((idx) => {
    setChecklist(prev => prev.map((item, i) => i === idx ? { ...item, completed: !item.completed } : item));
  }, [setChecklist]);

  const toggleZoneCheck = useCallback((zoneId, itemIdx) => {
    const key = `${zoneId}-${itemIdx}`;
    setZoneChecks(prev => ({ ...prev, [key]: !prev[key] }));
  }, [setZoneChecks]);

  const resetAll = useCallback(() => {
    setPartyData(DEFAULT_PARTY_DATA);
    setChecklist([]);
    setSuggestions([]);
    setStep(1);
    setHireCharacter(false);
    setZoneChecks({});
    setRsvpId(null);
    setTimeline([]);
  }, [setPartyData, setChecklist, setSuggestions, setStep, setHireCharacter, setZoneChecks, setRsvpId, setTimeline]);

  const value = {
    partyData, setPartyData, updateField,
    checklist, setChecklist,
    suggestions, setSuggestions,
    step, setStep,
    hireCharacter, setHireCharacter,
    zoneChecks, setZoneChecks, toggleZoneCheck,
    rsvpId, setRsvpId,
    timeline, setTimeline,
    toggleActivity, toggleChecklistItem, resetAll,
  };

  return <PartyContext.Provider value={value}>{children}</PartyContext.Provider>;
}

export function useParty() {
  const ctx = useContext(PartyContext);
  if (!ctx) throw new Error('useParty must be used within a PartyProvider');
  return ctx;
}
