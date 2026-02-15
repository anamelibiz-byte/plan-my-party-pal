/**
 * Send SMS with party checklist
 * Uses Twilio to send SMS to user's phone
 */

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, partyData, checklist } = req.body;

  // Validate required fields
  if (!phone || !partyData) {
    return res.status(400).json({ error: 'Phone number and party data required' });
  }

  // Get Twilio credentials from environment
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !twilioPhone) {
    console.error('Missing Twilio credentials');
    return res.status(500).json({ error: 'SMS service not configured' });
  }

  try {
    // Format checklist for SMS (plain text, character limit aware)
    const smsBody = formatChecklistForSMS(partyData, checklist);

    // Send SMS using Twilio REST API
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
        },
        body: new URLSearchParams({
          To: phone,
          From: twilioPhone,
          Body: smsBody,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return res.status(200).json({
        success: true,
        messageSid: data.sid,
        message: 'SMS sent successfully'
      });
    } else {
      const errorData = await response.json();
      console.error('Twilio API error:', errorData);
      return res.status(500).json({
        error: 'Failed to send SMS',
        details: errorData.message
      });
    }
  } catch (error) {
    console.error('SMS sending error:', error);
    return res.status(500).json({
      error: 'Failed to send SMS',
      details: error.message
    });
  }
}

/**
 * Format party checklist as SMS text
 * SMS has 160 character segments, so keep it concise
 */
function formatChecklistForSMS(partyData, checklist) {
  const lines = [];

  // Party header
  lines.push(`🎉 ${partyData.childName}'s Party Checklist`);
  lines.push('');

  // Party details
  if (partyData.theme) lines.push(`Theme: ${partyData.theme}`);
  if (partyData.date) lines.push(`Date: ${partyData.date}`);
  if (partyData.venueName) lines.push(`Venue: ${partyData.venueName}`);
  if (partyData.guestCount) lines.push(`Guests: ${partyData.guestCount}`);
  if (partyData.budget) lines.push(`Budget: $${partyData.budget}`);
  lines.push('');

  // Top priority checklist items (limit to keep SMS short)
  if (checklist && checklist.length > 0) {
    lines.push('📋 Top Tasks:');

    // Get high priority items first, then medium, limit to 10 total
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    const sortedItems = [...checklist]
      .filter(item => !item.completed)
      .sort((a, b) => {
        const aPriority = priorityOrder[a.priority] || 4;
        const bPriority = priorityOrder[b.priority] || 4;
        return aPriority - bPriority;
      })
      .slice(0, 10);

    sortedItems.forEach((item, index) => {
      const priority = item.priority === 'high' ? '!' : '';
      lines.push(`${index + 1}. ${item.task}${priority}`);
    });

    const remaining = checklist.filter(item => !item.completed).length - sortedItems.length;
    if (remaining > 0) {
      lines.push(`...and ${remaining} more tasks`);
    }
  }

  lines.push('');
  lines.push('View full plan: go.planmypartypal.com');

  return lines.join('\n');
}
