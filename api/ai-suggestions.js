export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { age, budget, guestCount } = req.body;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  try {
    console.log('[AI] Generating themes for age:', age, 'budget:', budget, 'guests:', guestCount);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `Suggest 5 unique birthday party themes for a ${age}-year-old. Budget: $${budget}, ${guestCount} guests. Include at least 1 licensed character theme. Return ONLY a JSON array with "name", "description", "ageRange", "costTier" fields. No markdown, no explanations, just the JSON array.`,
        }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[AI] Anthropic API error:', response.status, error);
      return res.status(response.status).json({ error: 'Anthropic API error', details: error });
    }

    const data = await response.json();
    console.log('[AI] Success! Generated', data.content?.[0]?.text?.length || 0, 'characters');

    res.status(200).json(data);
  } catch (error) {
    console.error('[AI] Error:', error);
    res.status(500).json({ error: 'Failed to generate suggestions', details: error.message });
  }
}
