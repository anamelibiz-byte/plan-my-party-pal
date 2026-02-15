import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { age, genderCategory, giftTypeFilter, giftPriceFilter } = req.body;

  // Validate age
  if (!age || age < 1 || age > 18) {
    return res.status(400).json({ error: 'Valid age (1-18) required' });
  }

  const prompt = `Generate 20 unique, age-appropriate gift ideas for a ${age}-year-old child's birthday party.

Requirements:
- Age: ${age} years old
- Gender preference: ${genderCategory || 'all'}
- Type filter: ${giftTypeFilter === 'all' ? 'mix of all types' : giftTypeFilter || 'mix of all types'}
- Price range: ${giftPriceFilter === 'All' ? 'mix of all prices' : giftPriceFilter || 'mix of all prices'}

For each gift, provide:
1. Name (concise, specific product name)
2. Price range ($, $$, or $$$)
   - $ = Under $15
   - $$ = $15-$40
   - $$$ = Over $40
3. Type (must be one of: toys, books, games, outdoor, creative)
4. Gender fit (must be one of: boy, girl, unisex)
5. Brief description (1 sentence, highlighting why it's great for this age)

Format as a valid JSON array with NO markdown formatting:
[
  {
    "name": "LEGO Classic Building Set",
    "priceRange": "$$",
    "type": "toys",
    "gender": "unisex",
    "description": "Encourages creativity and fine motor skills with 500+ colorful building pieces"
  }
]

CRITICAL RULES:
- Return ONLY the JSON array, no markdown code blocks
- All 20 gifts must be different and age-appropriate
- Focus on popular, well-reviewed items that parents actually buy
- Ensure variety across types (at least 3 of each type if "all types")
- Ensure variety across price ranges (mix of $, $$, $$$)
- Gender should match the preference, but always include some unisex options`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const content = message.content[0].text;

    // Extract JSON from response (Claude might wrap it in markdown)
    let jsonMatch = content.match(/\[[\s\S]*\]/);

    // If still in code block, try to extract
    if (!jsonMatch) {
      const codeBlockMatch = content.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
      if (codeBlockMatch) {
        jsonMatch = [codeBlockMatch[1]];
      }
    }

    if (!jsonMatch) {
      console.error('Failed to parse AI response:', content.substring(0, 200));
      throw new Error('Failed to parse AI response');
    }

    const gifts = JSON.parse(jsonMatch[0]);

    // Validate response structure
    if (!Array.isArray(gifts) || gifts.length === 0) {
      throw new Error('Invalid AI response: not an array or empty');
    }

    // Validate each gift has required fields
    const validGifts = gifts.filter(gift =>
      gift.name &&
      gift.priceRange &&
      gift.type &&
      gift.gender &&
      gift.description
    );

    if (validGifts.length === 0) {
      throw new Error('No valid gifts in AI response');
    }

    return res.status(200).json({ gifts: validGifts });

  } catch (error) {
    console.error('AI gift generation error:', error);
    return res.status(500).json({
      error: 'Failed to generate gift suggestions',
      details: error.message
    });
  }
}
