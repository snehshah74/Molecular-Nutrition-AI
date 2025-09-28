import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  Utensils, 
  Plus, 
  Clock, 
  Edit, 
  Trash2, 
  CheckCircle,
  AlertCircle,
  Loader2,
  Search,
  Calendar
} from 'lucide-react'
import type { FoodLogFormData, Meal } from '@/types'
import { NutritionAPI } from '@/services/api'
import { formatTime } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useToast } from '@/contexts/ToastContext'

const foodLogSchema = z.object({
  description: z.string().min(1, 'Please describe what you ate'),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  timestamp: z.date()
})

const mealTypes = [
  { value: 'breakfast', label: 'Breakfast', icon: '🌅', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' },
  { value: 'lunch', label: 'Lunch', icon: '☀️', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' },
  { value: 'dinner', label: 'Dinner', icon: '🌙', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  { value: 'snack', label: 'Snack', icon: '🍎', color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' }
]

interface FoodLoggerProps {
  onMealAdded: (meal: Meal) => void
  meals: Meal[]
  onMealUpdate: (mealId: string, updatedMeal: Meal) => void
  onMealDelete: (mealId: string) => void
}

export function FoodLogger({ onMealAdded, meals, onMealUpdate, onMealDelete }: FoodLoggerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [editingMeal, setEditingMeal] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { showSuccess, showError } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<FoodLogFormData>({
    resolver: zodResolver(foodLogSchema),
    defaultValues: {
      description: '',
      mealType: 'breakfast',
      timestamp: new Date()
    }
  })

  const watchedMealType = watch('mealType')

  const onSubmit = async (data: FoodLogFormData) => {
    console.log('Form submitted with data:', data)
    setIsLoading(true)
    try {
      console.log('Parsing food description:', data.description)
      const foodItems = await NutritionAPI.parseFoodDescription(data.description)
      console.log('Parsed food items:', foodItems)
      
      const meal: Meal = {
        id: Math.random().toString(36).substr(2, 9),
        name: `${data.mealType.charAt(0).toUpperCase() + data.mealType.slice(1)}`,
        description: data.description,
        foodItems,
        timestamp: data.timestamp,
        totalNutrients: {
          macronutrients: [],
          micronutrients: []
        }
      }

      console.log('Created meal:', meal)

      if (editingMeal) {
        console.log('Updating meal:', editingMeal)
        onMealUpdate(editingMeal, meal)
        setEditingMeal(null)
        showSuccess('Meal Updated', 'Your meal has been successfully updated!')
      } else {
        console.log('Adding new meal')
        onMealAdded(meal)
        showSuccess('Meal Added', 'Your meal has been successfully logged!')
      }

      reset()
      setIsExpanded(false)
    } catch (error) {
      console.error('Error adding meal:', error)
      showError('Error Adding Meal', 'Failed to add meal. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (meal: Meal) => {
    setValue('description', meal.description)
    setValue('mealType', meal.name.toLowerCase() as any)
    setValue('timestamp', meal.timestamp)
    setEditingMeal(meal.id)
    setIsExpanded(true)
  }

  const handleCancel = () => {
    reset()
    setEditingMeal(null)
    setIsExpanded(false)
  }

  const filteredMeals = meals.filter(meal =>
    meal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meal.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const todayMeals = filteredMeals.filter(meal => {
    const mealDate = new Date(meal.timestamp).toDateString()
    const today = new Date().toDateString()
    return mealDate === today
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <Utensils className="h-6 w-6 mr-2 text-primary-600 dark:text-primary-400" />
            Food Logger
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Track your meals and get molecular-level nutrition insights
          </p>
        </div>
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="btn-primary flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="h-4 w-4" />
          <span>Add Meal</span>
        </motion.button>
      </div>

      {/* Add Meal Form */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ 
              duration: 0.3,
              ease: [0.4, 0.0, 0.2, 1]
            }}
            className="card p-6"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {editingMeal ? 'Edit Meal' : 'Add New Meal'}
                </h3>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>

              {/* Meal Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Meal Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {mealTypes.map(mealType => (
                    <motion.button
                      key={mealType.value}
                      type="button"
                      onClick={() => setValue('mealType', mealType.value as any)}
                      className={cn(
                        "p-3 rounded-lg border-2 transition-all duration-200 text-center",
                        watchedMealType === mealType.value
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-900"
                          : "border-gray-200 dark:border-gray-600 hover:border-primary-300"
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-lg mb-1">{mealType.icon}</div>
                      <span className="text-sm font-medium">{mealType.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Food Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  What did you eat?
                </label>
                <textarea
                  id="description"
                  autoComplete="off"
                  {...register('description')}
                  rows={3}
                  className={cn("input", errors.description && "input-error")}
                  placeholder="e.g., 1 cup rice, 100g lentils, 1 apple"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.description.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Be specific with quantities and measurements for better accuracy
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setValue('description', '1 apple, 1 banana')}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Test: Apple + Banana
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue('description', '1 cup rice, 100g chicken')}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Test: Rice + Chicken
                  </button>
                </div>
              </div>

              {/* Timestamp */}
              <div>
                <label htmlFor="timestamp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  When did you eat this?
                </label>
                <input
                  id="timestamp"
                  type="datetime-local"
                  autoComplete="off"
                  {...register('timestamp', { valueAsDate: true })}
                  className="input"
                  defaultValue={new Date().toISOString().slice(0, 16)}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary flex items-center space-x-2"
                  whileHover={{ scale: isLoading ? 1 : 1.05 }}
                  whileTap={{ scale: isLoading ? 1 : 0.95 }}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  <span>{editingMeal ? 'Update Meal' : 'Add Meal'}</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            id="search-meals"
            type="text"
            autoComplete="off"
            placeholder="Search meals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="h-4 w-4" />
          <span>Today</span>
        </div>
      </div>

      {/* Meals List */}
      <div className="space-y-4">
        {todayMeals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Utensils className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No meals logged today
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start by adding your first meal to begin tracking your nutrition
            </p>
            <motion.button
              onClick={() => setIsExpanded(true)}
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add Your First Meal
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {todayMeals.map((meal, index) => {
              const mealType = mealTypes.find(mt => mt.label.toLowerCase() === meal.name.toLowerCase())
              
              return (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-lg">{mealType?.icon}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {meal.name}
                          </h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="h-3 w-3" />
                            <span>{formatTime(meal.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        {meal.description}
                      </p>
                      
                      {/* Quick Nutrition Summary */}
                      {meal.foodItems && meal.foodItems.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {meal.foodItems.map((food, foodIndex) => (
                            <span
                              key={foodIndex}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                            >
                              {food.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <motion.button
                        onClick={() => handleEdit(meal)}
                        className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Edit className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => onMealDelete(meal.id)}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
