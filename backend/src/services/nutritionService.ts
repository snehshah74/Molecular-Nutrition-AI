import axios from 'axios'
import { config } from '../config/env.js'

// Mock nutrition database for fallback
const mockFoodDatabase: Record<string, any> = {
  'chicken_breast': {
    id: 'chicken_breast',
    name: 'Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    vitamins: { B6: 0.5, B12: 0.3, niacin: 14.8 },
    minerals: { selenium: 27.6, phosphorus: 228 },
  },
  'brown_rice': {
    id: 'brown_rice',
    name: 'Brown Rice',
    calories: 216,
    protein: 5,
    carbs: 45,
    fat: 1.8,
    fiber: 3.5,
    vitamins: { B1: 0.2, B6: 0.3 },
    minerals: { magnesium: 86, manganese: 1.8 },
  },
  'broccoli': {
    id: 'broccoli',
    name: 'Broccoli',
    calories: 55,
    protein: 3.7,
    carbs: 11.2,
    fat: 0.6,
    fiber: 3.8,
    vitamins: { C: 135, K: 141, folate: 108 },
    minerals: { potassium: 505, calcium: 62 },
  },
}

export async function searchFoodData(query: string) {
  // If Edamam credentials are available, use the API
  if (config.edamam.appId && config.edamam.appKey) {
    try {
      const response = await axios.get('https://api.edamam.com/api/food-database/v2/parser', {
        params: {
          app_id: config.edamam.appId,
          app_key: config.edamam.appKey,
          ingr: query,
        },
      })

      return response.data.hints?.map((hint: any) => ({
        id: hint.food.foodId,
        name: hint.food.label,
        calories: hint.food.nutrients.ENERC_KCAL || 0,
        protein: hint.food.nutrients.PROCNT || 0,
        carbs: hint.food.nutrients.CHOCDF || 0,
        fat: hint.food.nutrients.FAT || 0,
        fiber: hint.food.nutrients.FIBTG || 0,
      })) || []
    } catch (error) {
      console.error('Edamam API error:', error)
      // Fall through to mock data
    }
  }

  // Use mock data as fallback
  const results = Object.values(mockFoodDatabase).filter(food =>
    food.name.toLowerCase().includes(query.toLowerCase())
  )

  return results
}

export async function getFoodNutritionData(foodId: string) {
  // If Edamam credentials are available, use the API
  if (config.edamam.appId && config.edamam.appKey) {
    try {
      const response = await axios.get(`https://api.edamam.com/api/food-database/v2/nutrients`, {
        params: {
          app_id: config.edamam.appId,
          app_key: config.edamam.appKey,
        },
        data: {
          ingredients: [
            {
              quantity: 100,
              measureURI: 'http://www.edamam.com/ontologies/edamam.owl#Measure_gram',
              foodId: foodId,
            },
          ],
        },
      })

      const nutrients = response.data.totalNutrients || {}
      return {
        id: foodId,
        calories: nutrients.ENERC_KCAL?.quantity || 0,
        protein: nutrients.PROCNT?.quantity || 0,
        carbs: nutrients.CHOCDF?.quantity || 0,
        fat: nutrients.FAT?.quantity || 0,
        fiber: nutrients.FIBTG?.quantity || 0,
        vitamins: extractVitamins(nutrients),
        minerals: extractMinerals(nutrients),
      }
    } catch (error) {
      console.error('Edamam API error:', error)
      // Fall through to mock data
    }
  }

  // Use mock data as fallback
  return mockFoodDatabase[foodId] || null
}

function extractVitamins(nutrients: any) {
  return {
    A: nutrients.VITA_RAE?.quantity || 0,
    C: nutrients.VITC?.quantity || 0,
    D: nutrients.VITD?.quantity || 0,
    E: nutrients.TOCPHA?.quantity || 0,
    K: nutrients.VITK1?.quantity || 0,
    B1: nutrients.THIA?.quantity || 0,
    B2: nutrients.RIBF?.quantity || 0,
    B3: nutrients.NIA?.quantity || 0,
    B6: nutrients.VITB6A?.quantity || 0,
    B12: nutrients.VITB12?.quantity || 0,
    folate: nutrients.FOLDFE?.quantity || 0,
  }
}

function extractMinerals(nutrients: any) {
  return {
    calcium: nutrients.CA?.quantity || 0,
    iron: nutrients.FE?.quantity || 0,
    magnesium: nutrients.MG?.quantity || 0,
    phosphorus: nutrients.P?.quantity || 0,
    potassium: nutrients.K?.quantity || 0,
    sodium: nutrients.NA?.quantity || 0,
    zinc: nutrients.ZN?.quantity || 0,
    selenium: nutrients.SE?.quantity || 0,
  }
}

