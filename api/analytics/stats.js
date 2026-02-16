import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Pro users
    const { count: proUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('tier', 'pro');

    // Active subscriptions
    const { count: activeSubscriptions } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_status', 'active');

    // Total parties
    const { count: totalParties } = await supabase
      .from('party_plans')
      .select('*', { count: 'exact', head: true });

    // Parties this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: partiesThisMonth } = await supabase
      .from('party_plans')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString());

    // New users this month
    const { count: newUsersThisMonth } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString());

    // User growth over last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: userGrowth } = await supabase
      .from('users')
      .select('created_at')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    // Group by day
    const growthByDay = {};
    userGrowth?.forEach(user => {
      const date = new Date(user.created_at).toISOString().split('T')[0];
      growthByDay[date] = (growthByDay[date] || 0) + 1;
    });

    // Popular themes
    const { data: parties } = await supabase
      .from('party_plans')
      .select('party_data');

    const themeCounts = {};
    parties?.forEach(party => {
      const theme = party.party_data?.theme;
      if (theme) {
        themeCounts[theme] = (themeCounts[theme] || 0) + 1;
      }
    });

    const popularThemes = Object.entries(themeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([theme, count]) => ({ theme, count }));

    // Conversion rate
    const conversionRate = totalUsers > 0 ? (proUsers / totalUsers) * 100 : 0;

    // MRR (Monthly Recurring Revenue) - assuming $4.99/month
    const mrr = activeSubscriptions * 4.99;

    // Referral stats
    const { data: referralData } = await supabase
      .from('users')
      .select('referral_count')
      .not('referral_count', 'is', null);

    const totalReferrals = referralData?.reduce((sum, user) => sum + (user.referral_count || 0), 0) || 0;

    return res.status(200).json({
      users: {
        total: totalUsers || 0,
        pro: proUsers || 0,
        free: (totalUsers || 0) - (proUsers || 0),
        newThisMonth: newUsersThisMonth || 0,
      },
      subscriptions: {
        active: activeSubscriptions || 0,
        conversionRate: conversionRate.toFixed(2),
        mrr: mrr.toFixed(2),
      },
      parties: {
        total: totalParties || 0,
        thisMonth: partiesThisMonth || 0,
      },
      growth: {
        byDay: growthByDay,
      },
      themes: {
        popular: popularThemes,
      },
      referrals: {
        total: totalReferrals,
      },
    });
  } catch (error) {
    console.error('Analytics stats error:', error);
    return res.status(500).json({
      error: 'Failed to fetch analytics',
      detail: error.message,
    });
  }
}
