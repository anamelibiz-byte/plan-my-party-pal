import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
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
    // Fetch all subscribers with full details
    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    // Calculate statistics
    const totalSubscribers = subscribers?.length || 0;
    const sourceCounts = {};
    const recentSubscribers = [];
    const subscribersWithPartyData = [];

    if (subscribers) {
      // Count by source
      subscribers.forEach(sub => {
        const source = sub.source || 'unknown';
        sourceCounts[source] = (sourceCounts[source] || 0) + 1;

        // Track recent subscribers (last 7 days)
        const createdAt = new Date(sub.created_at);
        const daysSinceCreated = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceCreated <= 7) {
          recentSubscribers.push(sub);
        }

        // Track subscribers with party data
        if (sub.party_data && Object.keys(sub.party_data).length > 0) {
          subscribersWithPartyData.push(sub);
        }
      });
    }

    return res.status(200).json({
      success: true,
      subscribers: subscribers || [],
      stats: {
        total: totalSubscribers,
        recent: recentSubscribers.length,
        withPartyData: subscribersWithPartyData.length,
        sourceCounts
      }
    });

  } catch (error) {
    console.error('Get subscribers error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch subscribers'
    });
  }
}
