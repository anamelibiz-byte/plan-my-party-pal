import { getAmazonSearchUrl } from '../data/shoppingLinks';

export function buildShareText(partyData, checklist, mergedZones, excludedItems, zoneChecks) {
  const lines = [];
  lines.push(`🎂 ${partyData.childName}'s ${partyData.theme} Birthday Party`);
  lines.push(`📅 ${partyData.date || 'TBD'} | 👥 ${partyData.guestCount} guests | 💰 $${partyData.budget} budget`);
  if (partyData.selectedActivities.length) {
    lines.push(`🎯 Activities: ${partyData.selectedActivities.join(', ')}`);
  }
  lines.push('');

  if (mergedZones && mergedZones.length > 0) {
    mergedZones.forEach(zone => {
      const activeItems = zone.allItems.filter(item => {
        const key = item._type === 'zone' ? item._zoneKey : `checklist-${item._checklistIdx}`;
        return !(excludedItems && excludedItems[key]);
      });
      if (!activeItems.length) return;
      lines.push(`${zone.emoji} ${zone.name}`);
      activeItems.forEach(item => {
        const isChecked = item._type === 'zone'
          ? (zoneChecks && zoneChecks[item._zoneKey])
          : item.completed;
        const box = isChecked ? '✅' : '☐';
        const cost = item.estimatedCost ? ` (${item.estimatedCost})` : '';
        lines.push(`  ${box} ${item.task}${cost}`);
      });
      lines.push('');
    });
  } else {
    checklist.forEach(item => {
      lines.push(`${item.completed ? '✅' : '☐'} ${item.task} (${item.estimatedCost})`);
    });
  }

  lines.push('Made with Party Plann ✨');
  return lines.join('\n');
}

export async function shareViaNative(title, text) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text });
      return true;
    } catch { return false; }
  }
  return false;
}

export function shareViaEmail(subject, body) {
  window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
}

export function shareViaText(body) {
  window.open(`sms:?body=${encodeURIComponent(body)}`);
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
