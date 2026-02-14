import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, planId } = req.query;

  // Validate at least one parameter
  if (!email && !planId) {
    return res.status(400).json({ error: 'Email or planId required' });
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
      // Load specific plan by ID
      result = await supabase
        .from('party_plans')
        .select('*')
        .eq('id', planId)
        .single();
    } else if (email) {
      // Load most recent plan for email
      result = await supabase
        .from('party_plans')
        .select('*')
        .eq('user_email', email)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();
    }

    if (result.error) {
      // PGRST116 means no rows found - this is OK, not an error
      if (result.error.code === 'PGRST116') {
        return res.status(200).json({
          success: true,
          data: null,
          message: 'No saved party plan found'
        });
      }
      console.error('Supabase error:', result.error);
      throw result.error;
    }

    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Party plan loaded successfully'
    });
  } catch (error) {
    console.error('Load error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to load party plan'
    });
  }
}
