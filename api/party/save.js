import { createClient } from '@supabase/supabase-js';

// Helper function to generate party name from data
function generatePartyName(partyData) {
  const { childName, age, theme, date } = partyData;

  if (childName && age) return `${childName}'s ${age}th Birthday`;
  if (childName && theme) return `${childName}'s ${theme} Party`;
  if (theme && date) {
    const formattedDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${theme} Party - ${formattedDate}`;
  }
  if (date) {
    const formattedDate = new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    return `Party - ${formattedDate}`;
  }
  return 'Untitled Party';
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, partyData, planId, partyName, status = 'active' } = req.body;

  // Validate required fields
  if (!email || !partyData) {
    return res.status(400).json({ error: 'Email and partyData required' });
  }

  // Initialize Supabase
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase not configured');
    return res.status(200).json({
      success: false,
      error: 'Database not configured'
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('[SAVE API] Request:', { email, hasPartyData: !!partyData, planId, partyName, status });

    // TIER ENFORCEMENT: Prevent free users from exceeding limits
    if (!planId) {
      // Only check when creating new party (not updating)
      const { data: userData } = await supabase
        .from('users')
        .select('tier')
        .eq('email', email)
        .single();

      const userTier = userData?.tier || 'free';

      if (userTier === 'free') {
        // Check if user already has a party
        const { data: existingParties } = await supabase
          .from('party_plans')
          .select('id')
          .eq('user_email', email)
          .eq('is_deleted', false);

        if (existingParties && existingParties.length >= 1) {
          return res.status(403).json({
            success: false,
            error: 'FREE_TIER_LIMIT',
            message: 'Free users can only have 1 party. Upgrade to Pro for unlimited parties.',
            requiresUpgrade: true
          });
        }
      }
    }

    // Auto-generate party name if not provided
    const finalPartyName = partyName || generatePartyName(partyData);

    let result;

    if (planId) {
      // Update existing plan
      result = await supabase
        .from('party_plans')
        .update({
          party_data: partyData,
          party_name: finalPartyName,
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', planId)
        .select()
        .single();
    } else {
      // Create new plan
      result = await supabase
        .from('party_plans')
        .insert({
          user_email: email,
          party_data: partyData,
          party_name: finalPartyName,
          status: status
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error('[SAVE API] Supabase error:', result.error);
      throw result.error;
    }

    console.log('[SAVE API] Success:', result.data.id);
    return res.status(200).json({
      success: true,
      planId: result.data.id,
      partyName: result.data.party_name,
      status: result.data.status,
      message: planId ? 'Party plan updated' : 'Party plan created'
    });
  } catch (error) {
    console.error('Save error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to save party plan'
    });
  }
}
