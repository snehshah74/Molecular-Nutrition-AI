import { useState, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  Utensils, 
  Target, 
  Zap, 
  RefreshCw,
  Save,
  Download,
  Star,
  TrendingUp
} from 'lucide-react'
import type { UserProfile, DailyIntake } from '@/types'

interface MealPlan {
  id: string
  date: string
  meals: {
    breakfast: MealPlanItem
    lunch: MealPlanItem
    dinner: MealPlanItem
    snacks: MealPlanItem[]
  }
  totalNutrition: {
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
  }
  molecularBalanceScore: number
  costEstimate: number
  preparationTime: number
}

interface MealPlanItem {
  id: string
  name: string
  description: string
  ingredients: string[]
  instructions: string
  nutrition: {
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
  }
  preparationTime: number
  difficulty: 'easy' | 'medium' | 'hard'
  cost: number
  molecularBenefits: string[]
  tags: string[]
}

interface MealPlanGeneratorProps {
  userProfile: UserProfile | null
  dailyIntake: DailyIntake | null
  onMealPlanGenerated: (mealPlan: MealPlan) => void
}

export const MealPlanGenerator = memo(function MealPlanGenerator({ 
  userProfile, 
  onMealPlanGenerated 
}: MealPlanGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedMealPlan, setGeneratedMealPlan] = useState<MealPlan | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [preferences, setPreferences] = useState({
    mealComplexity: 'medium' as 'easy' | 'medium' | 'hard',
    budgetRange: 'moderate' as 'budget' | 'moderate' | 'premium',
    prepTime: 45,
    focusAreas: [] as string[]
  })

  const generateMealPlan = async () => {
    if (!userProfile) return

    setIsGenerating(true)
    
    try {
      // Simulate AI meal plan generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockMealPlan: MealPlan = {
        id: `mealplan_${Date.now()}`,
        date: selectedDate,
        meals: {
          breakfast: {
            id: 'breakfast_1',
            name: 'Molecular Power Bowl',
            description: 'Quinoa base with hemp seeds, berries, and molecular nutrients',
            ingredients: [
              '1 cup cooked quinoa',
              '2 tbsp hemp seeds',
              '1/2 cup mixed berries',
              '1 tbsp chia seeds',
              '1 tbsp almond butter',
              '1/2 banana'
            ],
            instructions: '1. Cook quinoa according to package directions\n2. Top with hemp seeds, berries, chia seeds\n3. Drizzle with almond butter\n4. Add sliced banana on top',
            nutrition: { calories: 420, protein: 18, carbs: 52, fat: 16, fiber: 12 },
            preparationTime: 15,
            difficulty: 'easy',
            cost: 3.50,
            molecularBenefits: [
              'Complete amino acid profile from quinoa and hemp',
              'Antioxidants from berries support cellular health',
              'Omega-3 fatty acids enhance brain function'
            ],
            tags: ['high-protein', 'antioxidant-rich', 'omega-3', 'fiber-rich']
          },
          lunch: {
            id: 'lunch_1',
            name: 'Molecular Green Power Bowl',
            description: 'Dark leafy greens with molecular nutrients and plant proteins',
            ingredients: [
              '3 cups mixed greens (spinach, kale, arugula)',
              '1/2 cup cooked lentils',
              '1/4 avocado',
              '2 tbsp pumpkin seeds',
              '1 tbsp nutritional yeast',
              '1/2 cup roasted sweet potato',
              '2 tbsp tahini dressing'
            ],
            instructions: '1. Massage greens with lemon\n2. Top with warm lentils\n3. Add avocado, seeds, and sweet potato\n4. Sprinkle nutritional yeast\n5. Drizzle with tahini dressing',
            nutrition: { calories: 380, protein: 22, carbs: 35, fat: 18, fiber: 16 },
            preparationTime: 20,
            difficulty: 'medium',
            cost: 4.25,
            molecularBenefits: [
              'Iron and folate from dark greens support oxygen transport',
              'Complete protein from lentils and seeds',
              'Healthy fats enhance nutrient absorption'
            ],
            tags: ['iron-rich', 'folate-rich', 'plant-protein', 'vitamin-k']
          },
          dinner: {
            id: 'dinner_1',
            name: 'Molecular Mediterranean Feast',
            description: 'Mediterranean-inspired molecular nutrition powerhouse',
            ingredients: [
              '4 oz wild salmon or tempeh',
              '1 cup roasted vegetables (zucchini, bell peppers)',
              '1/2 cup quinoa pilaf',
              '2 tbsp olive oil',
              '1 tbsp fresh herbs',
              '1/4 cup olives',
              '1 tbsp capers'
            ],
            instructions: '1. Season and roast salmon/tempeh\n2. Roast vegetables until tender\n3. Prepare quinoa pilaf with herbs\n4. Arrange on plate with olives and capers\n5. Drizzle with olive oil',
            nutrition: { calories: 520, protein: 32, carbs: 38, fat: 28, fiber: 8 },
            preparationTime: 30,
            difficulty: 'medium',
            cost: 6.75,
            molecularBenefits: [
              'Omega-3 fatty acids support heart and brain health',
              'Antioxidants from vegetables reduce inflammation',
              'Complete amino acid profile for muscle synthesis'
            ],
            tags: ['omega-3', 'antioxidants', 'complete-protein', 'mediterranean']
          },
          snacks: [
            {
              id: 'snack_1',
              name: 'Molecular Energy Balls',
              description: 'Nutrient-dense energy balls with molecular benefits',
              ingredients: ['8 dates', '1/2 cup almonds', '2 tbsp cacao powder', '1 tbsp hemp seeds'],
              instructions: '1. Process dates and almonds in food processor\n2. Add cacao and hemp seeds\n3. Form into balls\n4. Refrigerate for 30 minutes',
              nutrition: { calories: 180, protein: 6, carbs: 24, fat: 8, fiber: 6 },
              preparationTime: 10,
              difficulty: 'easy',
              cost: 1.25,
              molecularBenefits: ['Natural energy from dates', 'Protein and healthy fats from nuts', 'Antioxidants from cacao'],
              tags: ['energy-boost', 'antioxidants', 'healthy-fats', 'no-bake']
            }
          ]
        },
        totalNutrition: {
          calories: 1500,
          protein: 78,
          carbs: 149,
          fat: 70,
          fiber: 42
        },
        molecularBalanceScore: 87,
        costEstimate: 15.75,
        preparationTime: 75
      }

      setGeneratedMealPlan(mockMealPlan)
      onMealPlanGenerated(mockMealPlan)
    } catch (error) {
      console.error('Error generating meal plan:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const focusAreas = [
    'muscle_building', 'weight_loss', 'energy_boost', 'brain_health', 
    'immune_support', 'heart_health', 'digestive_health', 'anti_aging'
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Utensils className="h-6 w-6 text-primary-600" />
            AI Meal Plan Generator
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Personalized molecular nutrition meal plans powered by AI
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Preferences Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Meal Plan Preferences
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Meal Complexity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Meal Complexity
            </label>
            <select
              value={preferences.mealComplexity}
              onChange={(e) => setPreferences(prev => ({ ...prev, mealComplexity: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="easy">Easy (15-30 min)</option>
              <option value="medium">Medium (30-45 min)</option>
              <option value="hard">Advanced (45+ min)</option>
            </select>
          </div>

          {/* Budget Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Budget Range
            </label>
            <select
              value={preferences.budgetRange}
              onChange={(e) => setPreferences(prev => ({ ...prev, budgetRange: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="budget">Budget ($10-15/day)</option>
              <option value="moderate">Moderate ($15-25/day)</option>
              <option value="premium">Premium ($25+/day)</option>
            </select>
          </div>

          {/* Prep Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Max Prep Time: {preferences.prepTime} min
            </label>
            <input
              type="range"
              min="15"
              max="120"
              value={preferences.prepTime}
              onChange={(e) => setPreferences(prev => ({ ...prev, prepTime: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>

          {/* Focus Areas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Focus Areas
            </label>
            <div className="flex flex-wrap gap-1">
              {focusAreas.map(area => (
                <button
                  key={area}
                  onClick={() => {
                    setPreferences(prev => ({
                      ...prev,
                      focusAreas: prev.focusAreas.includes(area)
                        ? prev.focusAreas.filter(f => f !== area)
                        : [...prev.focusAreas, area]
                    }))
                  }}
                  className={`px-2 py-1 text-xs rounded-full transition-colors ${
                    preferences.focusAreas.includes(area)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {area.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-6 flex justify-center">
          <motion.button
            onClick={generateMealPlan}
            disabled={isGenerating || !userProfile}
            className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Generate Meal Plan
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Generated Meal Plan */}
      <AnimatePresence>
        {generatedMealPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Your Molecular Nutrition Meal Plan
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {new Date(selectedDate).toLocaleDateString()} • Balance Score: {generatedMealPlan.molecularBalanceScore}/100
                </p>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Plan
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                </motion.button>
              </div>
            </div>

            {/* Meal Plan Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-primary-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Nutrition</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {generatedMealPlan.totalNutrition.calories} cal
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {generatedMealPlan.totalNutrition.protein}g protein • {generatedMealPlan.totalNutrition.carbs}g carbs
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-primary-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Prep Time</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {generatedMealPlan.preparationTime} min
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total cooking time
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-primary-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cost</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  ${generatedMealPlan.costEstimate}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Per day estimate
                </div>
              </div>
            </div>

            {/* Meals */}
            <div className="space-y-4">
              {Object.entries(generatedMealPlan.meals).map(([mealType, meal]) => {
                // Handle both single meals and arrays (like snacks)
                const meals = Array.isArray(meal) ? meal : [meal]
                
                return meals.map((mealItem, index) => (
                  <div key={`${mealType}-${index}`} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize">
                        {mealType} {Array.isArray(meal) ? `#${index + 1}` : ''}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>{mealItem.nutrition.calories} cal</span>
                        <span>{mealItem.preparationTime} min</span>
                        <span>${mealItem.cost}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                          {mealItem.name}
                        </h5>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                          {mealItem.description}
                        </p>
                        
                        <div className="mb-3">
                          <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ingredients:</h6>
                          <ul className="text-sm text-gray-600 dark:text-gray-400">
                            {mealItem.ingredients.map((ingredient: string, idx: number) => (
                              <li key={idx}>• {ingredient}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div>
                        <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Molecular Benefits:</h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          {mealItem.molecularBenefits.map((benefit: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Star className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                        
                        <div className="mt-3 flex flex-wrap gap-1">
                          {mealItem.tags.map((tag: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})
