import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, partyData, planId } = req.body;

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
    let result;

    if (planId) {
      // Update existing plan
      result = await supabase
        .from('party_plans')
        .update({
          party_data: partyData,
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
          party_data: partyData
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error('Supabase error:', result.error);
      throw result.error;
    }

    return res.status(200).json({
      success: true,
      planId: result.data.id,
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
