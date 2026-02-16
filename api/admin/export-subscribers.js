import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get format from query parameter (csv or json)
  const { format = 'csv' } = req.query;

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
    // Fetch all subscribers
    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    if (!subscribers || subscribers.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No subscribers to export'
      });
    }

    if (format === 'json') {
      // Return as JSON
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="subscribers-${Date.now()}.json"`);
      return res.status(200).json(subscribers);
    } else {
      // Return as CSV
      const csvRows = [];

      // CSV header
      csvRows.push('Email,Source,Child Name,Party Date,Created At,Has Party Data');

      // CSV rows
      subscribers.forEach(sub => {
        const email = sub.email || '';
        const source = sub.source || 'unknown';
        const childName = sub.party_data?.childName || '';
        const partyDate = sub.party_data?.date || '';
        const createdAt = sub.created_at ? new Date(sub.created_at).toISOString().split('T')[0] : '';
        const hasPartyData = sub.party_data && Object.keys(sub.party_data).length > 0 ? 'Yes' : 'No';

        // Escape commas and quotes in CSV
        const escapeCsv = (str) => {
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        };

        csvRows.push([
          escapeCsv(email),
          escapeCsv(source),
          escapeCsv(childName),
          escapeCsv(partyDate),
          escapeCsv(createdAt),
          hasPartyData
        ].join(','));
      });

      const csvContent = csvRows.join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="subscribers-${Date.now()}.csv"`);
      return res.status(200).send(csvContent);
    }

  } catch (error) {
    console.error('Export subscribers error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to export subscribers'
    });
  }
}
