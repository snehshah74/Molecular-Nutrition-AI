import { useState, useEffect, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  Clock,
  Zap,
  Heart
} from 'lucide-react'
import type { AIRecommendation, UserProfile, DailyIntake } from '@/types'
import { AIRecommendationsService } from '@/services/api'
import { NutrientCalculations } from '@/services/calculations'
import { cn } from '@/lib/utils'
import { RecommendationSkeleton } from '@/components/ui/LoadingSkeleton'

interface AIRecommendationsProps {
  userProfile: UserProfile | null
  dailyIntake: DailyIntake | null
  recommendations: AIRecommendation[]
  onRecommendationsUpdate: (recommendations: AIRecommendation[]) => void
}

const recommendationIcons = {
  food_suggestion: Lightbulb,
  deficiency_alert: AlertTriangle,
  optimization_tip: Zap,
  health_insight: Heart
}

const priorityColors = {
  high: 'border-red-200 bg-red-50 dark:bg-red-900 dark:border-red-700',
  medium: 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900 dark:border-yellow-700',
  low: 'border-blue-200 bg-blue-50 dark:bg-blue-900 dark:border-blue-700'
}

const priorityIcons = {
  high: AlertTriangle,
  medium: Clock,
  low: CheckCircle
}

export const AIRecommendations = memo(function AIRecommendations({ 
  userProfile, 
  dailyIntake, 
  recommendations, 
  onRecommendationsUpdate 
}: AIRecommendationsProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeFilter, setActiveFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [selectedType, setSelectedType] = useState<string>('all')

  useEffect(() => {
    if (userProfile && recommendations.length === 0) {
      // Generate recommendations even without daily intake data
      generateRecommendations()
    }
  }, [userProfile])

  const generateRecommendations = async () => {
    if (!userProfile) return

    setIsGenerating(true)
    try {
      console.log('=== GENERATING AI RECOMMENDATIONS ===')
      console.log('User profile:', userProfile)
      console.log('Daily intake:', dailyIntake)

      // Create mock daily intake if none exists
      const mockDailyIntake = dailyIntake || {
        date: new Date().toISOString().split('T')[0],
        meals: [],
        totalNutrients: {
          macronutrients: [
            { name: 'Calories', amount: 1200, unit: 'kcal' },
            { name: 'Protein', amount: 45, unit: 'g' },
            { name: 'Carbohydrates', amount: 150, unit: 'g' },
            { name: 'Fat', amount: 35, unit: 'g' }
          ],
          micronutrients: [
            { name: 'Iron', amount: 8, unit: 'mg' },
            { name: 'Vitamin C', amount: 60, unit: 'mg' },
            { name: 'Calcium', amount: 800, unit: 'mg' }
          ]
        },
        molecularBalanceScore: 75
      }

      // Calculate deficiencies
      const deficiencies = dailyIntake 
        ? NutrientCalculations.identifyDeficiencies(
            dailyIntake.totalNutrients.micronutrients,
            [] // This would be the actual targets
          )
        : ['Protein', 'Iron', 'Vitamin C'] // Mock deficiencies

      console.log('Deficiencies identified:', deficiencies)

      const newRecommendations = await AIRecommendationsService.generateRecommendations(
        userProfile,
        mockDailyIntake,
        deficiencies
      )

      console.log('Generated recommendations:', newRecommendations)
      onRecommendationsUpdate(newRecommendations)
    } catch (error) {
      console.error('Error generating recommendations:', error)
      
      // Create fallback recommendations with random data
      const fallbackRecommendations: AIRecommendation[] = [
        {
          id: Math.random().toString(36).substr(2, 9),
          type: 'food_suggestion',
          priority: 'high',
          title: 'Boost Your Protein Intake',
          description: `As a ${userProfile.lifestyle} with goals of ${userProfile.healthGoals.join(', ')}, consider adding more plant-based proteins like quinoa, lentils, and hemp seeds to support your nutrition goals.`,
          reasoning: 'Based on your vegan lifestyle and health goals, increasing protein variety will support muscle maintenance and overall health.',
          suggestedFoods: ['Quinoa', 'Lentils', 'Hemp seeds', 'Chia seeds', 'Tempeh'],
          targetNutrients: ['Protein', 'Iron', 'Zinc'],
          createdAt: new Date(),
          isRead: false
        },
        {
          id: Math.random().toString(36).substr(2, 9),
          type: 'optimization_tip',
          priority: 'medium',
          title: 'Optimize Nutrient Absorption',
          description: 'Pair iron-rich foods with vitamin C sources to enhance absorption. For example, add bell peppers to your spinach salad.',
          reasoning: 'Vitamin C increases iron absorption by up to 6x, which is especially important for plant-based diets.',
          suggestedFoods: ['Bell peppers', 'Citrus fruits', 'Strawberries', 'Broccoli'],
          targetNutrients: ['Iron', 'Vitamin C'],
          createdAt: new Date(),
          isRead: false
        },
        {
          id: Math.random().toString(36).substr(2, 9),
          type: 'health_insight',
          priority: 'low',
          title: 'Molecular Nutrition Insight',
          description: 'Your body needs 9 essential amino acids that it cannot produce. As a vegan, focus on complementary proteins like rice and beans.',
          reasoning: 'Complete proteins provide all essential amino acids needed for optimal cellular function and muscle synthesis.',
          suggestedFoods: ['Brown rice', 'Black beans', 'Quinoa', 'Buckwheat'],
          targetNutrients: ['Complete proteins', 'Essential amino acids'],
          createdAt: new Date(),
          isRead: false
        }
      ]

      console.log('Using fallback recommendations:', fallbackRecommendations)
      onRecommendationsUpdate(fallbackRecommendations)
    } finally {
      setIsGenerating(false)
    }
  }

  const markAsRead = (recommendationId: string) => {
    const updatedRecommendations = recommendations.map(rec =>
      rec.id === recommendationId ? { ...rec, isRead: true } : rec
    )
    onRecommendationsUpdate(updatedRecommendations)
  }

  const filteredRecommendations = recommendations.filter(rec => {
    // Ensure the recommendation has the required structure
    if (!rec || typeof rec !== 'object') return false
    
    const priorityMatch = activeFilter === 'all' || rec.priority === activeFilter
    const typeMatch = selectedType === 'all' || rec.type === selectedType
    return priorityMatch && typeMatch
  }).map(rec => ({
    ...rec,
    // Ensure arrays are properly formatted
    suggestedFoods: Array.isArray(rec.suggestedFoods) ? rec.suggestedFoods : [],
    targetNutrients: Array.isArray(rec.targetNutrients) ? rec.targetNutrients : [],
    // Ensure required fields exist
    id: rec.id || Math.random().toString(36).substr(2, 9),
    title: rec.title || 'Nutrition Recommendation',
    description: rec.description || 'General nutrition advice',
    reasoning: rec.reasoning || 'Based on your nutrition profile',
    type: rec.type || 'optimization_tip',
    priority: rec.priority || 'medium',
    isRead: rec.isRead || false,
    createdAt: rec.createdAt || new Date()
  }))

  const unreadCount = recommendations.filter(rec => !rec.isRead).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <Brain className="h-6 w-6 mr-2 text-primary-600 dark:text-primary-400" />
            AI Recommendations
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Personalized nutrition insights powered by molecular analysis
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
            >
              {unreadCount} new
            </motion.div>
          )}
          
          <motion.button
            onClick={generateRecommendations}
            disabled={isGenerating}
            className="btn-primary flex items-center space-x-2"
            whileHover={{ scale: isGenerating ? 1 : 1.05 }}
            whileTap={{ scale: isGenerating ? 1 : 0.95 }}
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Brain className="h-4 w-4" />
            )}
            <span>{isGenerating ? 'Generating...' : 'Refresh'}</span>
          </motion.button>

          <motion.button
            onClick={() => {
              console.log('=== TESTING AI WITH RANDOM DATA ===')
              generateRecommendations()
            }}
            className="btn-secondary flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Brain className="h-4 w-4" />
            <span>🧪 Test AI</span>
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Priority Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority:</span>
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {(['all', 'high', 'medium', 'low'] as const).map(priority => (
              <motion.button
                key={priority}
                type="button"
                onClick={() => setActiveFilter(priority)}
                className={cn(
                  "px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 capitalize",
                  activeFilter === priority
                    ? "bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {priority}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Type Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Type:</span>
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {['all', 'food_suggestion', 'deficiency_alert', 'optimization_tip', 'health_insight'].map(type => (
              <motion.button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={cn(
                  "px-3 py-1 rounded-md text-sm font-medium transition-all duration-200",
                  selectedType === type
                    ? "bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {type === 'all' ? 'All' : type.replace('_', ' ')}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {isGenerating ? (
          <div className="space-y-4">
            <RecommendationSkeleton />
            <RecommendationSkeleton />
            <RecommendationSkeleton />
          </div>
        ) : filteredRecommendations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Brain className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No recommendations available
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start logging meals to get AI-powered nutrition insights
            </p>
            <motion.button
              onClick={generateRecommendations}
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Generate Recommendations
            </motion.button>
          </motion.div>
        ) : (
          <AnimatePresence>
            {filteredRecommendations.map((recommendation, index) => {
              // Safety check for recommendation structure
              if (!recommendation || typeof recommendation !== 'object') {
                console.warn('Invalid recommendation structure:', recommendation)
                return null
              }
              
              const Icon = recommendationIcons[recommendation.type]
              const PriorityIcon = priorityIcons[recommendation.priority]
              
              return (
                <motion.div
                  key={recommendation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "card p-6 transition-all duration-200 hover:shadow-md",
                    !recommendation.isRead && "ring-2 ring-primary-200 dark:ring-primary-800",
                    priorityColors[recommendation.priority]
                  )}
                >
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className={cn(
                      "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center",
                      recommendation.priority === 'high' && "bg-red-100 dark:bg-red-900",
                      recommendation.priority === 'medium' && "bg-yellow-100 dark:bg-yellow-900",
                      recommendation.priority === 'low' && "bg-blue-100 dark:bg-blue-900"
                    )}>
                      <Icon className={cn(
                        "h-6 w-6",
                        recommendation.priority === 'high' && "text-red-600 dark:text-red-400",
                        recommendation.priority === 'medium' && "text-yellow-600 dark:text-yellow-400",
                        recommendation.priority === 'low' && "text-blue-600 dark:text-blue-400"
                      )} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {recommendation.title}
                            </h3>
                            <div className="flex items-center space-x-1">
                              <PriorityIcon className={cn(
                                "h-4 w-4",
                                recommendation.priority === 'high' && "text-red-500",
                                recommendation.priority === 'medium' && "text-yellow-500",
                                recommendation.priority === 'low' && "text-blue-500"
                              )} />
                              <span className={cn(
                                "text-xs font-medium px-2 py-1 rounded-full",
                                recommendation.priority === 'high' && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                                recommendation.priority === 'medium' && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                                recommendation.priority === 'low' && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              )}>
                                {recommendation.priority}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 dark:text-gray-300 mb-3">
                            {recommendation.description}
                          </p>

                          {/* Suggested Foods */}
                          {recommendation.suggestedFoods && 
                           Array.isArray(recommendation.suggestedFoods) && 
                           recommendation.suggestedFoods.length > 0 && (
                            <div className="mb-3">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                                Suggested Foods:
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {recommendation.suggestedFoods.map((food, foodIndex) => (
                                  <span
                                    key={foodIndex}
                                    className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium"
                                  >
                                    {food}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Target Nutrients */}
                          {recommendation.targetNutrients && 
                           Array.isArray(recommendation.targetNutrients) && 
                           recommendation.targetNutrients.length > 0 && (
                            <div className="mb-3">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                                Target Nutrients:
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {recommendation.targetNutrients.map((nutrient, nutrientIndex) => (
                                  <span
                                    key={nutrientIndex}
                                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                                  >
                                    {nutrient}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Reasoning */}
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-3">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                              Why this matters:
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {recommendation.reasoning}
                            </p>
                          </div>

                          {/* Timestamp */}
                          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(recommendation.createdAt).toLocaleDateString()} at{' '}
                              {new Date(recommendation.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col space-y-2 ml-4">
                          {!recommendation.isRead && (
                            <motion.button
                              onClick={() => markAsRead(recommendation.id)}
                              className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Mark as read"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
})
