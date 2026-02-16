export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { age, interests, budget, guestCount } = req.body;

  if (!age) {
    return res.status(400).json({ error: 'Age required' });
  }

  try {
    // AI-powered theme suggestions based on age and interests
    const suggestions = generateThemeSuggestions(age, interests, budget, guestCount);

    return res.status(200).json({
      success: true,
      suggestions,
    });
  } catch (error) {
    console.error('AI suggestion error:', error);
    return res.status(500).json({
      error: 'Failed to generate suggestions',
      detail: error.message,
    });
  }
}

function generateThemeSuggestions(age, interests = [], budget = 300, guestCount = 15) {
  const allThemes = [
    {
      theme: 'Superhero Adventure',
      ageRange: [4, 10],
      estimatedBudget: 350,
      popularActivities: ['Superhero Training Course', 'Cape Decorating', 'Villain Tag'],
      reasoning: 'Perfect for active kids who love action and heroes',
      keywords: ['superhero', 'action', 'marvel', 'dc', 'heroes'],
    },
    {
      theme: 'Princess Castle',
      ageRange: [3, 7],
      estimatedBudget: 300,
      popularActivities: ['Royal Tea Party', 'Crown Making', 'Princess Dress-Up'],
      reasoning: 'Classic theme for magical moments',
      keywords: ['princess', 'castle', 'royal', 'disney', 'crown'],
    },
    {
      theme: 'Dinosaur Discovery',
      ageRange: [3, 8],
      estimatedBudget: 280,
      popularActivities: ['Dino Dig', 'Fossil Crafts', 'Egg Hunt'],
      reasoning: 'Great for kids fascinated by prehistoric creatures',
      keywords: ['dinosaur', 'dino', 'jurassic', 'fossils', 'trex'],
    },
    {
      theme: 'Space Explorer',
      ageRange: [6, 12],
      estimatedBudget: 400,
      popularActivities: ['Rocket Building', 'Planet Hunt', 'Astronaut Training'],
      reasoning: 'Out-of-this-world adventure for curious minds',
      keywords: ['space', 'astronaut', 'rocket', 'planets', 'stars'],
    },
    {
      theme: 'Under the Sea',
      ageRange: [3, 7],
      estimatedBudget: 290,
      popularActivities: ['Fishing Game', 'Seashell Crafts', 'Mermaid Dance'],
      reasoning: 'Dive into an ocean of fun',
      keywords: ['ocean', 'sea', 'mermaid', 'fish', 'underwater'],
    },
    {
      theme: 'Sports All-Star',
      ageRange: [6, 12],
      estimatedBudget: 400,
      popularActivities: ['Mini Olympics', 'Soccer Skills', 'Relay Races'],
      reasoning: 'Perfect for athletic and competitive kids',
      keywords: ['sports', 'soccer', 'basketball', 'athletic', 'games'],
    },
    {
      theme: 'Art Studio',
      ageRange: [5, 10],
      estimatedBudget: 250,
      popularActivities: ['Canvas Painting', 'Pottery Making', 'Art Gallery Walk'],
      reasoning: 'Creative fun for artistic children',
      keywords: ['art', 'painting', 'creative', 'craft', 'drawing'],
    },
    {
      theme: 'Science Lab',
      ageRange: [7, 12],
      estimatedBudget: 350,
      popularActivities: ['Slime Making', 'Volcano Experiment', 'Mad Scientist'],
      reasoning: 'Hands-on experiments for curious scientists',
      keywords: ['science', 'experiment', 'lab', 'chemistry', 'stem'],
    },
  ];

  // Filter by age
  let suitable = allThemes.filter(
    t => age >= t.ageRange[0] && age <= t.ageRange[1]
  );

  // Score by interests
  if (interests.length > 0) {
    suitable = suitable.map(theme => {
      const interestMatch = interests.some(interest =>
        theme.keywords.some(keyword =>
          keyword.toLowerCase().includes(interest.toLowerCase()) ||
          interest.toLowerCase().includes(keyword.toLowerCase())
        )
      );

      return {
        ...theme,
        score: interestMatch ? 10 : 0,
      };
    });

    suitable.sort((a, b) => b.score - a.score);
  }

  // Filter by budget (within 20%)
  suitable = suitable.filter(
    t => t.estimatedBudget <= budget * 1.2
  );

  // Return top 3 suggestions
  return suitable.slice(0, 3).map(theme => ({
    theme: theme.theme,
    estimatedBudget: theme.estimatedBudget,
    activities: theme.popularActivities,
    reasoning: theme.reasoning,
    budgetFit: budget >= theme.estimatedBudget ? 'perfect' : 'stretch',
  }));
}
