import axios from 'axios'
import { config } from '../config/env.js'

interface Profile {
  age: number
  sex: string
  lifestyle: string
  health_goals: string[]
  medical_history: string[]
}

interface Meal {
  total_nutrition: any
}

export async function generateAIRecommendations(profile: Profile, meals: Meal[]) {
  try {
    // Calculate average daily nutrition from meals
    const avgNutrition = calculateAverageNutrition(meals)

    // Create prompt for AI
    const prompt = `
You are a molecular nutrition expert. Analyze this user's profile and recent nutrition data to provide personalized recommendations.

User Profile:
- Age: ${profile.age}
- Sex: ${profile.sex}
- Lifestyle: ${profile.lifestyle}
- Health Goals: ${profile.health_goals.join(', ')}
- Medical History: ${profile.medical_history.join(', ')}

Recent Average Daily Nutrition:
${JSON.stringify(avgNutrition, null, 2)}

Provide 3-5 specific, actionable nutrition recommendations. For each recommendation, include:
1. A clear title
2. A detailed description with specific foods or actions
3. Category (diet, supplements, lifestyle, or exercise)
4. Priority (low, medium, or high)

Format your response as a JSON array of recommendation objects.
    `.trim()

    // Call OpenRouter API
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: config.openrouter.model,
        messages: [
          {
            role: 'system',
            content: 'You are a molecular nutrition expert. Provide recommendations in JSON format only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
      },
      {
        headers: {
          'Authorization': `Bearer ${config.openrouter.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': config.cors.origin,
        },
      }
    )

    const content = response.data.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from AI')
    }

    // Parse AI response
    const parsed = JSON.parse(content)
    const recommendations = Array.isArray(parsed) ? parsed : parsed.recommendations || []

    return recommendations.map((rec: any) => ({
      title: rec.title || 'Nutrition Recommendation',
      description: rec.description || '',
      category: rec.category || 'diet',
      priority: rec.priority || 'medium',
    }))
  } catch (error) {
    console.error('AI recommendation error:', error)
    
    // Return fallback recommendations if AI fails
    return getFallbackRecommendations(profile)
  }
}

function calculateAverageNutrition(meals: Meal[]) {
  if (meals.length === 0) {
    return {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    }
  }

  const total = meals.reduce((acc, meal) => {
    const nutrition = meal.total_nutrition || {}
    return {
      calories: (acc.calories || 0) + (nutrition.calories || 0),
      protein: (acc.protein || 0) + (nutrition.protein || 0),
      carbs: (acc.carbs || 0) + (nutrition.carbs || 0),
      fat: (acc.fat || 0) + (nutrition.fat || 0),
      fiber: (acc.fiber || 0) + (nutrition.fiber || 0),
    }
  }, {} as any)

  const days = Math.ceil(meals.length / 3) // Assuming 3 meals per day

  return {
    calories: Math.round(total.calories / days),
    protein: Math.round(total.protein / days),
    carbs: Math.round(total.carbs / days),
    fat: Math.round(total.fat / days),
    fiber: Math.round(total.fiber / days),
  }
}

function getFallbackRecommendations(profile: Profile) {
  const recommendations = [
    {
      title: 'Increase Protein Intake',
      description: 'Based on your profile, consider adding more lean proteins like chicken, fish, or legumes to support your health goals.',
      category: 'diet',
      priority: 'high',
    },
    {
      title: 'Stay Hydrated',
      description: 'Aim for at least 8 glasses of water per day to support cellular function and nutrient absorption.',
      category: 'lifestyle',
      priority: 'high',
    },
    {
      title: 'Add More Vegetables',
      description: 'Include a variety of colorful vegetables in your meals for essential vitamins, minerals, and antioxidants.',
      category: 'diet',
      priority: 'medium',
    },
  ]

  if (profile.lifestyle === 'vegan' || profile.lifestyle === 'vegetarian') {
    recommendations.push({
      title: 'B12 Supplementation',
      description: 'Consider taking a B12 supplement as it\'s primarily found in animal products.',
      category: 'supplements',
      priority: 'high',
    })
  }

  return recommendations
}

