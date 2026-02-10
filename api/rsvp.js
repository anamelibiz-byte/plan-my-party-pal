export default async function handler(req, res) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  // GET — fetch RSVPs for a party
  if (req.method === 'GET') {
    const { partyId } = req.query;
    if (!partyId) return res.status(400).json({ error: 'partyId required' });

    if (!supabaseUrl || !supabaseKey) {
      return res.status(200).json({ responses: [], storage: 'local' });
    }

    try {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/rsvp_responses?party_id=eq.${partyId}&order=created_at.desc`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
          },
        }
      );
      const data = await response.json();
      return res.status(200).json({ responses: data });
    } catch {
      return res.status(200).json({ responses: [], storage: 'local' });
    }
  }

  // POST — save RSVP
  if (req.method === 'POST') {
    const { partyId, guestName, attending, adultCount, childCount, dietary, dietaryOther, message } = req.body;

    if (!partyId || !guestName) {
      return res.status(400).json({ error: 'partyId and guestName required' });
    }

    if (!supabaseUrl || !supabaseKey) {
      return res.status(200).json({ success: true, storage: 'local' });
    }

    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/rsvp_responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          party_id: partyId,
          guest_name: guestName,
          attending,
          adult_count: adultCount || 0,
          child_count: childCount || 0,
          dietary: dietary || [],
          dietary_other: dietaryOther || '',
          message: message || '',
          created_at: new Date().toISOString(),
        }),
      });

      if (response.ok || response.status === 201) {
        return res.status(200).json({ success: true });
      }
      return res.status(200).json({ success: true, storage: 'local' });
    } catch {
      return res.status(200).json({ success: true, storage: 'local' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
