import OpenAI from 'openai'
import axios from 'axios'
import type { 
  UserProfile, 
  FoodItem, 
  AIRecommendation
} from '@/types'
import { NutritionKnowledgeBase } from './nutritionKnowledge'
import { AdvancedNutritionKnowledge } from './advancedNutritionKnowledge'

// Enhanced in-memory cache for API responses with performance optimization
const apiCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes for better performance

// Cache helper functions for optimized performance
const getCachedData = (key: string) => {
  const cached = apiCache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('Cache hit for:', key)
    return cached.data
  }
  return null
}

const setCachedData = (key: string, data: any) => {
  apiCache.set(key, { data, timestamp: Date.now() })
  console.log('Cache set for:', key)
}

// Performance monitoring
const performanceMetrics = {
  totalRequests: 0,
  cacheHits: 0,
  averageResponseTime: 0,
  lastRequestTime: 0
}

const updatePerformanceMetrics = (responseTime: number, fromCache: boolean = false) => {
  performanceMetrics.totalRequests++
  if (fromCache) performanceMetrics.cacheHits++
  performanceMetrics.lastRequestTime = responseTime
  performanceMetrics.averageResponseTime = 
    (performanceMetrics.averageResponseTime * (performanceMetrics.totalRequests - 1) + responseTime) / performanceMetrics.totalRequests
}

// OpenRouter API configuration
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: (import.meta as any).env?.VITE_OPENROUTER_API_KEY || "your-openrouter-api-key",
  dangerouslyAllowBrowser: true, // Required for browser environment
})

// Nutrition API configuration (using Edamam as example)
const NUTRITION_API_BASE = "https://api.edamam.com/api/nutrition-data"
const NUTRITION_APP_ID = (import.meta as any).env?.VITE_EDAMAM_APP_ID || "your-app-id"
const NUTRITION_APP_KEY = (import.meta as any).env?.VITE_EDAMAM_APP_KEY || "your-app-key"

// Mock nutrition data for development
const MOCK_NUTRITION_DATA = {
  "1 cup rice": {
    calories: 205,
    protein: 4.3,
    carbohydrates: 44.5,
    fat: 0.4,
    fiber: 0.6,
    iron: 0.8,
    calcium: 16,
    vitamin_c: 0,
    vitamin_d: 0,
    vitamin_b12: 0,
    zinc: 0.8
  },
  "100g lentils": {
    calories: 116,
    protein: 9,
    carbohydrates: 20,
    fat: 0.4,
    fiber: 7.9,
    iron: 3.3,
    calcium: 19,
    vitamin_c: 1.5,
    vitamin_d: 0,
    vitamin_b12: 0,
    zinc: 1.3
  },
  "1 apple": {
    calories: 52,
    protein: 0.3,
    carbohydrates: 13.8,
    fat: 0.2,
    fiber: 2.4,
    iron: 0.1,
    calcium: 6,
    vitamin_c: 4.6,
    vitamin_d: 0,
    vitamin_b12: 0,
    zinc: 0.04
  },
  "1 banana": {
    calories: 105,
    protein: 1.3,
    carbohydrates: 27,
    fat: 0.4,
    fiber: 3,
    iron: 0.3,
    calcium: 6,
    vitamin_c: 10.3,
    vitamin_d: 0,
    vitamin_b12: 0,
    zinc: 0.2
  },
  "1 egg": {
    calories: 70,
    protein: 6,
    carbohydrates: 0.6,
    fat: 5,
    fiber: 0,
    iron: 0.9,
    calcium: 28,
    vitamin_c: 0,
    vitamin_d: 44,
    vitamin_b12: 0.6,
    zinc: 0.6
  },
  "1 slice bread": {
    calories: 80,
    protein: 3,
    carbohydrates: 15,
    fat: 1,
    fiber: 1,
    iron: 0.8,
    calcium: 30,
    vitamin_c: 0,
    vitamin_d: 0,
    vitamin_b12: 0,
    zinc: 0.3
  },
  "chicken": {
    calories: 165,
    protein: 31,
    carbohydrates: 0,
    fat: 3.6,
    fiber: 0,
    iron: 1.3,
    calcium: 15,
    vitamin_c: 0,
    vitamin_d: 0,
    vitamin_b12: 0.3,
    zinc: 1.0
  },
  "salmon": {
    calories: 208,
    protein: 25,
    carbohydrates: 0,
    fat: 12,
    fiber: 0,
    iron: 0.8,
    calcium: 12,
    vitamin_c: 0,
    vitamin_d: 988,
    vitamin_b12: 3.2,
    zinc: 0.4
  },
  "broccoli": {
    calories: 34,
    protein: 2.8,
    carbohydrates: 7,
    fat: 0.4,
    fiber: 2.6,
    iron: 0.7,
    calcium: 47,
    vitamin_c: 89.2,
    vitamin_d: 0,
    vitamin_b12: 0,
    zinc: 0.4
  },
  "milk": {
    calories: 103,
    protein: 8,
    carbohydrates: 12,
    fat: 2.4,
    fiber: 0,
    iron: 0.1,
    calcium: 276,
    vitamin_c: 0,
    vitamin_d: 124,
    vitamin_b12: 1.1,
    zinc: 0.9
  },
  "yogurt": {
    calories: 59,
    protein: 10,
    carbohydrates: 3.6,
    fat: 0.4,
    fiber: 0,
    iron: 0.1,
    calcium: 110,
    vitamin_c: 0,
    vitamin_d: 0,
    vitamin_b12: 0.4,
    zinc: 0.5
  }
}

// Nutrition API service
export class NutritionAPI {
  static async getNutritionData(foodDescription: string): Promise<any> {
    const startTime = Date.now()
    
    try {
      console.log('Fetching nutrition data for:', foodDescription)
      
      // Check cache first
      const cacheKey = `nutrition_${foodDescription.toLowerCase().trim()}`
      const cachedData = getCachedData(cacheKey)
      if (cachedData) {
        const responseTime = Date.now() - startTime
        updatePerformanceMetrics(responseTime, true)
        console.log('Returning cached nutrition data')
        return cachedData
      }
      
      // Try to find mock data with flexible matching
      const normalizedDescription = foodDescription.toLowerCase().trim()
      let mockData = null
      
      // Try exact match first
      mockData = (MOCK_NUTRITION_DATA as any)[normalizedDescription]
      
      // If no exact match, try partial matching
      if (!mockData) {
        for (const [key, data] of Object.entries(MOCK_NUTRITION_DATA)) {
          if (normalizedDescription.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedDescription)) {
            mockData = data
            break
          }
        }
      }
      
      // If still no match, try common food items
      if (!mockData) {
        const commonFoods = ['rice', 'lentils', 'apple', 'banana', 'egg', 'bread', 'chicken', 'salmon', 'broccoli', 'milk', 'yogurt']
        for (const food of commonFoods) {
          if (normalizedDescription.includes(food)) {
            mockData = (MOCK_NUTRITION_DATA as any)[food]
            if (mockData) break
          }
        }
      }
      
      // Use mock data if found
      if (mockData) {
        console.log('Using mock data for:', foodDescription)
        const result = {
          food: {
            name: foodDescription,
            nutrients: mockData
          }
        }
        
        // Cache the result
        setCachedData(cacheKey, result)
        
        const responseTime = Date.now() - startTime
        updatePerformanceMetrics(responseTime, false)
        
        return result
      }

      // Real API call to Edamam (if API keys are available)
      if (NUTRITION_APP_ID !== 'your-app-id' && NUTRITION_APP_KEY !== 'your-app-key') {
        const response = await axios.get(NUTRITION_API_BASE, {
          params: {
            app_id: NUTRITION_APP_ID,
            app_key: NUTRITION_APP_KEY,
            ingr: foodDescription
          }
        })
        return response.data
      }

      // Fallback: create basic nutrition data
      console.log('Creating fallback nutrition data for:', foodDescription)
      return {
        food: {
          name: foodDescription,
          nutrients: {
            calories: 100,
            protein: 5,
            carbohydrates: 15,
            fat: 2,
            fiber: 2,
            iron: 1,
            calcium: 50,
            vitamin_c: 10,
            vitamin_d: 0,
            vitamin_b12: 0,
            zinc: 1
          }
        }
      }
    } catch (error) {
      console.error('Error fetching nutrition data:', error)
      // Final fallback
      return {
        food: {
          name: foodDescription,
          nutrients: {
            calories: 100,
            protein: 5,
            carbohydrates: 15,
            fat: 2,
            fiber: 2,
            iron: 1,
            calcium: 50,
            vitamin_c: 10,
            vitamin_d: 0,
            vitamin_b12: 0,
            zinc: 1
          }
        }
      }
    }
  }

  static async parseFoodDescription(description: string): Promise<FoodItem[]> {
    try {
      console.log('Parsing food description:', description)
      
      // Split by common separators
      const foodItems = description.split(/[,;]/).map(item => item.trim()).filter(Boolean)
      const parsedItems: FoodItem[] = []

      for (const item of foodItems) {
        console.log('Processing food item:', item)
        
        try {
          const nutritionData = await this.getNutritionData(item)
          console.log('Nutrition data received:', nutritionData)
          
          // Handle both mock and real API data structures
          const nutrients = nutritionData.food?.nutrients || nutritionData.nutrients || nutritionData
          const foodName = nutritionData.food?.name || item

          const foodItem: FoodItem = {
            id: Math.random().toString(36).substr(2, 9),
            name: foodName,
            description: item,
            quantity: 1,
            unit: 'serving',
            macronutrients: {
              protein: nutrients.protein || 0,
              carbohydrates: nutrients.carbohydrates || 0,
              fat: nutrients.fat || 0,
              fiber: nutrients.fiber || 0,
              calories: nutrients.calories || 0
            },
            micronutrients: [
              { name: 'Iron', amount: nutrients.iron || 0, unit: 'mg', status: 'good', category: 'mineral' },
              { name: 'Calcium', amount: nutrients.calcium || 0, unit: 'mg', status: 'good', category: 'mineral' },
              { name: 'Vitamin C', amount: nutrients.vitamin_c || 0, unit: 'mg', status: 'good', category: 'vitamin' },
              { name: 'Vitamin D', amount: nutrients.vitamin_d || 0, unit: 'IU', status: 'good', category: 'vitamin' },
              { name: 'Vitamin B12', amount: nutrients.vitamin_b12 || 0, unit: 'mcg', status: 'good', category: 'vitamin' },
              { name: 'Zinc', amount: nutrients.zinc || 0, unit: 'mg', status: 'good', category: 'mineral' }
            ],
            timestamp: new Date()
          }

          parsedItems.push(foodItem)
          console.log('Food item created:', foodItem)
        } catch (itemError) {
          console.error('Error processing individual food item:', item, itemError)
          // Create a basic food item even if nutrition data fails
          const basicFoodItem: FoodItem = {
            id: Math.random().toString(36).substr(2, 9),
            name: item,
            description: item,
            quantity: 1,
            unit: 'serving',
            macronutrients: {
              protein: 0,
              carbohydrates: 0,
              fat: 0,
              fiber: 0,
              calories: 0
            },
            micronutrients: [
              { name: 'Iron', amount: 0, unit: 'mg', status: 'good', category: 'mineral' },
              { name: 'Calcium', amount: 0, unit: 'mg', status: 'good', category: 'mineral' },
              { name: 'Vitamin C', amount: 0, unit: 'mg', status: 'good', category: 'vitamin' },
              { name: 'Vitamin D', amount: 0, unit: 'IU', status: 'good', category: 'vitamin' },
              { name: 'Vitamin B12', amount: 0, unit: 'mcg', status: 'good', category: 'vitamin' },
              { name: 'Zinc', amount: 0, unit: 'mg', status: 'good', category: 'mineral' }
            ],
            timestamp: new Date()
          }
          parsedItems.push(basicFoodItem)
        }
      }

      console.log('Final parsed items:', parsedItems)
      return parsedItems
    } catch (error) {
      console.error('Error parsing food description:', error)
      // Return a basic food item even if parsing fails completely
      const fallbackItem: FoodItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: description,
        description: description,
        quantity: 1,
        unit: 'serving',
        macronutrients: {
          protein: 0,
          carbohydrates: 0,
          fat: 0,
          fiber: 0,
          calories: 0
        },
        micronutrients: [
          { name: 'Iron', amount: 0, unit: 'mg', status: 'good', category: 'mineral' },
          { name: 'Calcium', amount: 0, unit: 'mg', status: 'good', category: 'mineral' },
          { name: 'Vitamin C', amount: 0, unit: 'mg', status: 'good', category: 'vitamin' },
          { name: 'Vitamin D', amount: 0, unit: 'IU', status: 'good', category: 'vitamin' },
          { name: 'Vitamin B12', amount: 0, unit: 'mcg', status: 'good', category: 'vitamin' },
          { name: 'Zinc', amount: 0, unit: 'mg', status: 'good', category: 'mineral' }
        ],
        timestamp: new Date()
      }
      return [fallbackItem]
    }
  }
}

// AI Recommendations service
export class AIRecommendationsService {
  static async generateRecommendations(
    userProfile: UserProfile,
    dailyIntake: any,
    deficiencies: string[]
  ): Promise<AIRecommendation[]> {
    const startTime = Date.now()
    
    try {
      console.log('=== AI SERVICE: Starting recommendation generation ===')
      console.log('API Key available:', !!((import.meta as any).env?.VITE_OPENROUTER_API_KEY))
      console.log('User profile:', userProfile)
      console.log('Daily intake:', dailyIntake)
      console.log('Deficiencies:', deficiencies)
      
      // Create cache key based on user profile and deficiencies
      const cacheKey = `recommendations_${userProfile.id}_${deficiencies.sort().join('_')}_${userProfile.lifestyle}`
      
      // Check cache first
      const cachedData = getCachedData(cacheKey)
      if (cachedData) {
        const responseTime = Date.now() - startTime
        updatePerformanceMetrics(responseTime, true)
        console.log('Returning cached recommendations')
        return cachedData
      }
      
      const prompt = this.buildRecommendationPrompt(userProfile, dailyIntake, deficiencies)
      console.log('Generated prompt:', prompt.substring(0, 200) + '...')
      
      const response = await openai.chat.completions.create({
        model: "openai/gpt-4o-mini", // Faster model for better performance
        messages: [
          {
            role: "system",
            content: "You are an advanced molecular nutrition AI with expertise in nutrigenomics, circadian biology, and precision medicine. Provide highly specific, evidence-based nutrition recommendations with molecular explanations. Always respond in valid JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1500, // Increased for more detailed responses
        temperature: 0.3, // Lower temperature for more consistent, scientific responses
        response_format: { type: "json_object" } // Force JSON response format
      })

      const content = response.choices[0]?.message?.content || ""
      console.log('AI Response received:', content.substring(0, 200) + '...')
      const recommendations = this.parseRecommendations(content)
      console.log('Parsed recommendations:', recommendations)
      
      // Cache the results
      setCachedData(cacheKey, recommendations)
      
      const responseTime = Date.now() - startTime
      updatePerformanceMetrics(responseTime, false)
      console.log(`AI request completed in ${responseTime}ms`)
      
      return recommendations
    } catch (error) {
      console.error('Error generating AI recommendations:', error)
      console.log('Falling back to mock recommendations')
      
      const responseTime = Date.now() - startTime
      updatePerformanceMetrics(responseTime, false)
      
      return this.getMockRecommendations(deficiencies)
    }
  }

  private static buildRecommendationPrompt(
    userProfile: UserProfile,
    dailyIntake: any,
    deficiencies: string[]
  ): string {
    // Get lifestyle-specific guidance
    const lifestyleGuidance = NutritionKnowledgeBase.getLifestyleGuidance(userProfile.lifestyle)
    const healthGoalRecommendations = NutritionKnowledgeBase.getHealthGoalRecommendations(userProfile.healthGoals)
    
    // Get molecular insights for deficiencies
    const molecularInsights = deficiencies.map(d => 
      NutritionKnowledgeBase.getMolecularInsights(d.toLowerCase())
    ).flat()

    // Get advanced nutrition training prompt
    const advancedPrompt = AdvancedNutritionKnowledge.getAdvancedTrainingPrompt(
      userProfile,
      dailyIntake,
      deficiencies
    )

    // Calculate BMI and get BMI-based recommendations
    const bmi = userProfile.weight / ((userProfile.height / 100) ** 2)
    const bmiRecommendations = AdvancedNutritionKnowledge.getBMIRecommendations(bmi, userProfile)
    const calorieNeeds = AdvancedNutritionKnowledge.calculatePersonalizedCalories(userProfile)

    return `
${advancedPrompt}

ADDITIONAL CONTEXT:
You are a molecular nutrition AI expert with deep knowledge of biochemistry, nutrient interactions, and personalized nutrition. Use the following comprehensive knowledge base to provide expert recommendations.

USER PROFILE:
- Name: ${userProfile.name}
- Age: ${userProfile.age} years old
- Sex: ${userProfile.sex}
- Height: ${userProfile.height} cm
- Weight: ${userProfile.weight} kg
- BMI: ${(userProfile.weight / ((userProfile.height / 100) ** 2)).toFixed(1)}
- Lifestyle: ${userProfile.lifestyle}
- Health Goals: ${userProfile.healthGoals.join(', ')}
- Medical History: ${userProfile.medicalHistory.join(', ')}

CURRENT NUTRITION INTAKE:
- Total Calories: ${dailyIntake?.totalNutrients?.macronutrients?.find((m: any) => m.name === 'Calories')?.amount || 0} kcal
- Protein: ${dailyIntake?.totalNutrients?.macronutrients?.find((m: any) => m.name === 'Protein')?.amount || 0}g
- Carbohydrates: ${dailyIntake?.totalNutrients?.macronutrients?.find((m: any) => m.name === 'Carbohydrates')?.amount || 0}g
- Fat: ${dailyIntake?.totalNutrients?.macronutrients?.find((m: any) => m.name === 'Fat')?.amount || 0}g
- Fiber: ${dailyIntake?.totalNutrients?.macronutrients?.find((m: any) => m.name === 'Fiber')?.amount || 0}g

IDENTIFIED DEFICIENCIES: ${deficiencies.join(', ')}

LIFESTYLE-SPECIFIC GUIDANCE FOR ${userProfile.lifestyle.toUpperCase()}:
${lifestyleGuidance.map(g => `- ${g}`).join('\n')}

HEALTH GOAL RECOMMENDATIONS:
${Object.entries(healthGoalRecommendations).map(([category, recs]) => 
  `${category.toUpperCase()}:\n${recs.map(r => `- ${r}`).join('\n')}`
).join('\n\n')}

MOLECULAR NUTRITION INSIGHTS:
${molecularInsights.slice(0, 5).map(insight => `- ${insight}`).join('\n')}

BMI-BASED RECOMMENDATIONS (BMI: ${bmi.toFixed(1)}):
${bmiRecommendations.map(rec => `- ${rec}`).join('\n')}

PERSONALIZED CALORIE NEEDS:
- Maintenance: ${calorieNeeds.maintenance} kcal/day
- Weight Loss: ${calorieNeeds.deficit} kcal/day (20% deficit)
- Weight Gain: ${calorieNeeds.surplus} kcal/day (10% surplus)

COMPREHENSIVE NUTRIENT KNOWLEDGE:
- Protein: Essential for muscle synthesis, enzyme production, hormone regulation. Complete proteins provide all 9 essential amino acids.
- Iron: Critical for oxygen transport via hemoglobin. Vitamin C increases non-heme iron absorption by 6x.
- Omega-3: Anti-inflammatory fatty acids essential for brain health and cell membrane fluidity.
- Magnesium: Cofactor for 300+ enzymatic reactions, supports ATP production and muscle relaxation.
- Vitamin C: Powerful antioxidant, collagen synthesis, enhances iron absorption.
- Zinc: Essential for 100+ enzymes, immune function, wound healing.
- B12: Nerve function, red blood cell formation, requires intrinsic factor for absorption.
- Folate: DNA synthesis, cell division, prevents neural tube defects.

INSTRUCTIONS:
Provide 3-5 highly specific, science-based nutrition recommendations in JSON format. For each recommendation:

1. TYPE: Choose from food_suggestion, deficiency_alert, optimization_tip, health_insight
2. PRIORITY: high, medium, or low based on urgency and impact
3. TITLE: Clear, actionable title (max 60 characters)
4. DESCRIPTION: Concise explanation with molecular benefits (max 200 characters)
5. REASONING: Specific to user's profile, lifestyle, and health goals (max 150 characters)
6. SUGGESTED_FOODS: Array of specific foods with serving sizes (3-5 items)
7. TARGET_NUTRIENTS: Array of nutrients being addressed (2-4 items)

Focus on:
- Molecular-level explanations of how nutrients work
- Specific food combinations for enhanced absorption
- Lifestyle-appropriate recommendations
- Health goal alignment
- Practical implementation tips

RESPONSE FORMAT:
{
  "recommendations": [
    {
      "type": "deficiency_alert",
      "priority": "high",
      "title": "Iron Absorption Enhancement",
      "description": "Your iron levels are below optimal. Iron is critical for oxygen transport via hemoglobin and energy production in mitochondria.",
      "reasoning": "Based on your vegan lifestyle and health goals, increasing iron with vitamin C will support energy and cognitive function.",
      "suggestedFoods": ["Spinach with bell peppers", "Lentils with citrus", "Quinoa with strawberries"],
      "targetNutrients": ["Iron", "Vitamin C", "Folate"]
    }
  ]
}
`
  }

  private static parseRecommendations(content: string): AIRecommendation[] {
    try {
      // Parse the JSON response
      const parsed = JSON.parse(content)
      
      // Handle the new format with recommendations array
      if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
        return parsed.recommendations.map((rec: any) => ({
          id: Math.random().toString(36).substr(2, 9),
          type: rec.type || 'optimization_tip',
          priority: rec.priority || 'medium',
          title: rec.title || 'Nutrition Tip',
          description: rec.description || '',
          reasoning: rec.reasoning || '',
          suggestedFoods: Array.isArray(rec.suggestedFoods) ? rec.suggestedFoods : [],
          targetNutrients: Array.isArray(rec.targetNutrients) ? rec.targetNutrients : [],
          createdAt: new Date(),
          isRead: false
        }))
      }
      
      // Handle direct array format
      if (Array.isArray(parsed)) {
        return parsed.map((rec: any) => ({
          id: Math.random().toString(36).substr(2, 9),
          type: rec.type || 'optimization_tip',
          priority: rec.priority || 'medium',
          title: rec.title || 'Nutrition Tip',
          description: rec.description || '',
          reasoning: rec.reasoning || '',
          suggestedFoods: Array.isArray(rec.suggestedFoods) ? rec.suggestedFoods : [],
          targetNutrients: Array.isArray(rec.targetNutrients) ? rec.targetNutrients : [],
          createdAt: new Date(),
          isRead: false
        }))
      }
    } catch (error) {
      console.error('Error parsing AI recommendations:', error)
      
      // Try to extract JSON from the response as fallback
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
          const recommendations = JSON.parse(jsonMatch[0])
          return recommendations.map((rec: any) => ({
            id: Math.random().toString(36).substr(2, 9),
            type: rec.type || 'optimization_tip',
            priority: rec.priority || 'medium',
            title: rec.title || 'Nutrition Tip',
            description: rec.description || '',
            reasoning: rec.reasoning || '',
            suggestedFoods: Array.isArray(rec.suggestedFoods) ? rec.suggestedFoods : [],
            targetNutrients: Array.isArray(rec.targetNutrients) ? rec.targetNutrients : [],
            createdAt: new Date(),
            isRead: false
          }))
        }
      } catch (fallbackError) {
        console.error('Fallback parsing also failed:', fallbackError)
      }
    }

    // Final fallback
    return [{
      id: Math.random().toString(36).substr(2, 9),
      type: 'optimization_tip',
      priority: 'medium',
      title: 'AI Nutrition Insight',
      description: content.substring(0, 200) + '...',
      reasoning: 'Generated by AI analysis of your nutrition profile',
      suggestedFoods: [],
      targetNutrients: [],
      createdAt: new Date(),
      isRead: false
    }]
  }

  private static getMockRecommendations(deficiencies: string[]): AIRecommendation[] {
    const recommendations: AIRecommendation[] = []

    if (deficiencies.includes('Protein')) {
      recommendations.push({
        id: Math.random().toString(36).substr(2, 9),
        type: 'deficiency_alert',
        priority: 'high',
        title: 'Complete Protein Optimization',
        description: 'Your protein intake is below optimal levels. Proteins provide 9 essential amino acids needed for muscle synthesis, enzyme production, and hormone regulation. Complete proteins contain all essential amino acids in optimal ratios for maximum biological value.',
        reasoning: 'Based on your health goals and current intake, increasing complete protein sources will support muscle maintenance, recovery, and overall cellular function. Protein synthesis requires adequate energy and micronutrients.',
        suggestedFoods: ['Quinoa (1 cup cooked)', 'Hemp seeds (3 tbsp)', 'Lentils (1 cup cooked)', 'Chia seeds (2 tbsp)', 'Tempeh (4 oz)'],
        targetNutrients: ['Complete Proteins', 'Essential Amino Acids', 'Leucine'],
        createdAt: new Date(),
        isRead: false
      })
    }

    if (deficiencies.includes('Iron')) {
      recommendations.push({
        id: Math.random().toString(36).substr(2, 9),
        type: 'deficiency_alert',
        priority: 'high',
        title: 'Iron Absorption Enhancement',
        description: 'Your iron levels are below optimal. Iron is critical for oxygen transport via hemoglobin and myoglobin, energy production in mitochondria, and cognitive function. Non-heme iron from plant sources has 2-20% absorption vs 15-35% for heme iron.',
        reasoning: 'Iron deficiency can lead to fatigue, cognitive impairment, and decreased exercise performance. Vitamin C can increase non-heme iron absorption by 6-fold, while calcium and tannins can inhibit absorption.',
        suggestedFoods: ['Spinach with bell peppers', 'Lentils with citrus', 'Quinoa with strawberries', 'Pumpkin seeds with orange', 'Dark chocolate (85% cacao)'],
        targetNutrients: ['Iron', 'Vitamin C', 'Folate'],
        createdAt: new Date(),
        isRead: false
      })
    }

    if (deficiencies.includes('Vitamin C')) {
      recommendations.push({
        id: Math.random().toString(36).substr(2, 9),
        type: 'optimization_tip',
        priority: 'medium',
        title: 'Antioxidant Power Boost',
        description: 'Vitamin C is a powerful antioxidant that regenerates vitamin E, synthesizes collagen, enhances iron absorption, and supports neurotransmitter synthesis. It\'s heat-sensitive and water-soluble, so consume raw sources for maximum benefit.',
        reasoning: 'Vitamin C requirements increase with stress, smoking, and exercise. It works synergistically with other antioxidants and is essential for immune function and collagen synthesis.',
        suggestedFoods: ['Bell peppers (raw)', 'Citrus fruits', 'Strawberries', 'Kiwi', 'Broccoli (lightly steamed)'],
        targetNutrients: ['Vitamin C', 'Bioflavonoids', 'Antioxidants'],
        createdAt: new Date(),
        isRead: false
      })
    }

    recommendations.push({
      id: Math.random().toString(36).substr(2, 9),
      type: 'health_insight',
      priority: 'medium',
      title: 'Molecular Nutrition Synergy',
      description: 'Nutrients work synergistically at the molecular level. For example, vitamin C enhances iron absorption, magnesium activates vitamin D, and omega-3 fatty acids support the absorption of fat-soluble vitamins. Consider food combinations for optimal bioavailability.',
      reasoning: 'Understanding nutrient interactions helps maximize absorption and biological activity. This is especially important for plant-based diets where bioavailability can be lower.',
      suggestedFoods: ['Quinoa with vegetables', 'Nuts with berries', 'Leafy greens with citrus', 'Seeds with fruits'],
      targetNutrients: ['Synergistic Nutrients', 'Bioavailability Factors'],
      createdAt: new Date(),
      isRead: false
    })

    recommendations.push({
      id: Math.random().toString(36).substr(2, 9),
      type: 'food_suggestion',
      priority: 'low',
      title: 'Superfood Integration',
      description: 'Incorporate nutrient-dense superfoods that provide multiple benefits. Chia seeds offer complete protein, omega-3 fatty acids, and gel-forming fiber. Hemp seeds provide all essential amino acids with optimal omega-6:3 ratio.',
      reasoning: 'Superfoods offer concentrated nutrition with multiple health benefits. They can help fill nutrient gaps while providing unique bioactive compounds.',
      suggestedFoods: ['Chia seeds (soaked)', 'Hemp seeds (raw)', 'Spirulina powder', 'Nutritional yeast', 'Cacao powder'],
      targetNutrients: ['Complete Proteins', 'Omega-3 Fatty Acids', 'Antioxidants', 'B-Vitamins'],
      createdAt: new Date(),
      isRead: false
    })

    return recommendations
  }
}

// Performance monitoring service
export class PerformanceService {
  static getMetrics() {
    return {
      ...performanceMetrics,
      cacheHitRate: performanceMetrics.totalRequests > 0 
        ? (performanceMetrics.cacheHits / performanceMetrics.totalRequests * 100).toFixed(1) + '%'
        : '0%'
    }
  }
  
  static clearCache() {
    apiCache.clear()
    console.log('Cache cleared')
  }
  
  static getCacheSize() {
    return apiCache.size
  }
}

// Local storage service for user data
export class LocalStorageService {
  static saveUserProfile(profile: UserProfile): void {
    console.log('LocalStorageService: Saving profile:', profile)
    try {
      localStorage.setItem('molecular-nutrition-user', JSON.stringify(profile))
      console.log('LocalStorageService: Profile saved successfully')
      
      // Verify the save
      const saved = localStorage.getItem('molecular-nutrition-user')
      console.log('LocalStorageService: Verification - saved data:', saved)
    } catch (error) {
      console.error('LocalStorageService: Error saving profile:', error)
      throw error
    }
  }

  static loadUserProfile(): UserProfile | null {
    try {
      const data = localStorage.getItem('molecular-nutrition-user')
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Error loading user profile:', error)
      return null
    }
  }

  static saveDailyIntake(date: string, intake: any): void {
    const key = `daily-intake-${date}`
    localStorage.setItem(key, JSON.stringify(intake))
  }

  static loadDailyIntake(date: string): any | null {
    try {
      const key = `daily-intake-${date}`
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Error loading daily intake:', error)
      return null
    }
  }

  static saveRecommendations(recommendations: AIRecommendation[]): void {
    localStorage.setItem('ai-recommendations', JSON.stringify(recommendations))
  }

  static loadRecommendations(): AIRecommendation[] {
    try {
      const data = localStorage.getItem('ai-recommendations')
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error loading recommendations:', error)
      return []
    }
  }
}
