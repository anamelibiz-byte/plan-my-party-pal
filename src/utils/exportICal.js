// Export timeline events to iCal format
export function exportTimelineICal(timelineEvents, partyData) {
  const partyDate = new Date(partyData.date);

  // Helper to format date for iCal (YYYYMMDDTHHMMSSZ)
  const formatICalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}T${hours}${minutes}${seconds}`;
  };

  // Helper to create unique ID
  const createUID = (index) => {
    return `${Date.now()}-${index}@partyplann.com`;
  };

  // Build iCal content
  const events = timelineEvents.map((event, index) => {
    const eventDate = new Date(partyDate);

    // Parse time (e.g., "2:00 PM" or "14:00")
    if (event.time) {
      const timeParts = event.time.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (timeParts) {
        let hours = parseInt(timeParts[1]);
        const minutes = parseInt(timeParts[2]);
        const meridiem = timeParts[3];

        if (meridiem && meridiem.toUpperCase() === 'PM' && hours !== 12) {
          hours += 12;
        } else if (meridiem && meridiem.toUpperCase() === 'AM' && hours === 12) {
          hours = 0;
        }

        eventDate.setHours(hours, minutes, 0, 0);
      }
    }

    const endDate = new Date(eventDate.getTime() + (event.duration || 30) * 60000); // Default 30 min duration

    return [
      'BEGIN:VEVENT',
      `UID:${createUID(index)}`,
      `DTSTAMP:${formatICalDate(new Date())}`,
      `DTSTART:${formatICalDate(eventDate)}`,
      `DTEND:${formatICalDate(endDate)}`,
      `SUMMARY:${event.title || event.task || 'Party Task'}`,
      `DESCRIPTION:${event.description || event.notes || ''}`,
      `LOCATION:${partyData.venue || ''}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
    ].join('\r\n');
  }).join('\r\n');

  const icalContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Plan My Party Pal//Party Timeline//EN',
    `X-WR-CALNAME:${partyData.childName}'s ${partyData.age}${getOrdinalSuffix(partyData.age)} Birthday Party`,
    'X-WR-TIMEZONE:America/New_York',
    'CALSCALE:GREGORIAN',
    events,
    'END:VCALENDAR',
  ].join('\r\n');

  // Download file
  const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${partyData.childName || 'party'}_timeline.ics`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export party date as iCal event
export function exportPartyDateICal(partyData) {
  const partyDate = new Date(partyData.date);

  // Set default time if not specified (2:00 PM)
  if (partyDate.getHours() === 0 && partyDate.getMinutes() === 0) {
    partyDate.setHours(14, 0, 0, 0);
  }

  const endDate = new Date(partyDate.getTime() + 3 * 60 * 60 * 1000); // 3 hours default

  const formatICalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}T${hours}${minutes}${seconds}`;
  };

  const icalContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Plan My Party Pal//Party Event//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@partyplann.com`,
    `DTSTAMP:${formatICalDate(new Date())}`,
    `DTSTART:${formatICalDate(partyDate)}`,
    `DTEND:${formatICalDate(endDate)}`,
    `SUMMARY:${partyData.childName}'s ${partyData.age}${getOrdinalSuffix(partyData.age)} Birthday Party`,
    `DESCRIPTION:Theme: ${partyData.theme || 'TBD'}`,
    `LOCATION:${partyData.venue || 'TBD'}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${partyData.childName || 'party'}_event.ics`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function getOrdinalSuffix(num) {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
}
