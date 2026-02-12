export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, subject, html, text } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }
  if (!html) {
    return res.status(400).json({ error: 'Checklist content is required' });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return res.status(500).json({ error: 'Email service not configured' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: 'Plan My Party Pal <hello@planmypartypal.com>',
        to: [email],
        subject: subject || '🎉 Your Party Checklist from Plan My Party Pal',
        html: html,
        text: text || '',
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return res.status(200).json({ success: true, id: data.id });
    } else {
      const errData = await response.json().catch(() => ({}));
      console.error('Resend API error:', errData);
      return res.status(500).json({
        error: errData.message || 'Failed to send email. Please try again.',
      });
    }
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ error: 'Failed to send email. Please try again.' });
  }
}
