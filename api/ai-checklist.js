export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { theme, age, venueType, budget, guestCount, activities, hireCharacter } = req.body;
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
        max_tokens: 2500,
        messages: [{
          role: 'user',
          content: `Create a comprehensive birthday party shopping & task checklist for a ${theme} themed party for a ${age}-year-old.
Venue: ${venueType}. Budget: $${budget}. ${guestCount} guests.
Activities: ${activities}.
${hireCharacter ? `They want to hire a ${theme} character performer.` : ''}

Include ALL specific supplies for each activity. Return ONLY a JSON array with fields:
- "category" (one of: Invitations, Decorations, Food & Cake, Dessert Table, Drinks, Activity Supplies, Rentals, Party Favors, Supplies & Cleanup, Entertainment & Hire)
- "task"
- "priority" (high/medium/low)
- "estimatedCost" (e.g. "$10-15")
- "searchTerms" (Amazon search terms, or "" if not purchasable)
No markdown.`,
        }],
      }),
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate checklist' });
  }
}
