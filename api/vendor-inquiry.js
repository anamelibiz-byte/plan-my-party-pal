export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { businessName, ownerName, category, city, state, email, phone, website, description } = req.body;

  if (!businessName || !email || !category || !city) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return res.status(500).json({ error: 'Email not configured' });

  try {
    // Email to admin (you)
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendKey}` },
      body: JSON.stringify({
        from: 'Party Plann <hello@go.partyplann.com>',
        to: ['tinapatrow@gmail.com'],
        subject: `🎪 New Vendor Inquiry: ${businessName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ec4899;">New Vendor Listing Inquiry</h2>
            <table style="width:100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; font-weight: bold; color: #555;">Business Name</td><td style="padding: 8px;">${businessName}</td></tr>
              <tr style="background:#f9f9f9"><td style="padding: 8px; font-weight: bold; color: #555;">Owner Name</td><td style="padding: 8px;">${ownerName || 'Not provided'}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold; color: #555;">Category</td><td style="padding: 8px;">${category}</td></tr>
              <tr style="background:#f9f9f9"><td style="padding: 8px; font-weight: bold; color: #555;">Location</td><td style="padding: 8px;">${city}, ${state || ''}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold; color: #555;">Email</td><td style="padding: 8px;"><a href="mailto:${email}">${email}</a></td></tr>
              <tr style="background:#f9f9f9"><td style="padding: 8px; font-weight: bold; color: #555;">Phone</td><td style="padding: 8px;">${phone || 'Not provided'}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold; color: #555;">Website</td><td style="padding: 8px;">${website ? `<a href="${website}">${website}</a>` : 'Not provided'}</td></tr>
              <tr style="background:#f9f9f9"><td style="padding: 8px; font-weight: bold; color: #555;">Description</td><td style="padding: 8px;">${description || 'Not provided'}</td></tr>
            </table>
            <p style="margin-top: 24px; color: #888; font-size: 14px;">Reply to this email to follow up with the vendor.</p>
          </div>
        `,
        reply_to: email,
      }),
    });

    // Confirmation email to vendor
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendKey}` },
      body: JSON.stringify({
        from: 'Party Plann <hello@go.partyplann.com>',
        to: [email],
        subject: `Thanks for your interest in Party Plann, ${ownerName || businessName}!`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(to right, #ec4899, #f43f5e); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">You're on our list! 🎉</h1>
            </div>
            <div style="padding: 32px; background: white; border-radius: 0 0 12px 12px; border: 1px solid #f0f0f0;">
              <p style="font-size: 16px; color: #333;">Hi ${ownerName || businessName},</p>
              <p style="color: #555;">Thanks for your interest in being listed on the <strong>Party Plann Vendor Marketplace</strong>! We've received your inquiry and will be in touch within 1–2 business days.</p>
              <div style="background: #fdf2f8; border-radius: 8px; padding: 16px; margin: 24px 0;">
                <h3 style="color: #ec4899; margin-top: 0;">What happens next?</h3>
                <ul style="color: #555; padding-left: 20px;">
                  <li>We'll review your business details</li>
                  <li>We'll reach out to discuss featured listing options</li>
                  <li>Once approved, your business goes live to thousands of parents planning parties in your area</li>
                </ul>
              </div>
              <p style="color: #555;">In the meantime, feel free to reply to this email with any questions.</p>
              <p style="color: #888; font-size: 14px; margin-top: 32px;">— The Party Plann Team<br>partyplann.com</p>
            </div>
          </div>
        `,
      }),
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Vendor inquiry error:', err);
    return res.status(500).json({ error: 'Failed to send inquiry' });
  }
}
