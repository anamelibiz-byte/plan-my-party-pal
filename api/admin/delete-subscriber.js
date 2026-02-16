import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Only allow DELETE
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  // Validate required field
  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }

  // Initialize Supabase with service key
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({
      success: false,
      error: 'Database not configured'
    });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Delete subscriber
    const { error } = await supabase
      .from('subscribers')
      .delete()
      .eq('email', email);

    if (error) {
      console.error('Supabase delete error:', error);
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: `Subscriber ${email} deleted successfully`
    });

  } catch (error) {
    console.error('Delete subscriber error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete subscriber'
    });
  }
}
