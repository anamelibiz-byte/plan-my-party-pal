export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { age, budget, guestCount } = req.body;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `Suggest 5 unique birthday party themes for a ${age}-year-old. Budget: $${budget}, ${guestCount} guests. Include at least 1 licensed character theme. Return ONLY a JSON array with "name", "description", "ageRange", "costTier" fields. No markdown.`,
        }],
      }),
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
}
