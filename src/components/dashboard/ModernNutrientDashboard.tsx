import { useState, useEffect, useMemo, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  AlertTriangle,
  Target,
  Zap,
  Heart,
  Brain,
  Activity,
  Clock,
  Flame,
  Droplets,
  Shield,
  CheckCircle,
  Info,
  ArrowUp
} from 'lucide-react'
import { 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Area,
  AreaChart
} from 'recharts'
import type { DailyIntake, Macronutrient, Micronutrient } from '@/types'
import { NutrientTargets } from '@/services/calculations'
import { calculateNutrientStatus, getNutrientStatusColor, getNutrientStatusBgColor } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { WelcomeCard } from './WelcomeCard'

interface NutrientDashboardProps {
  dailyIntake: DailyIntake | null
  userProfile: any
}

export const ModernNutrientDashboard = memo(function ModernNutrientDashboard({ 
  dailyIntake, 
  userProfile 
}: NutrientDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'macros' | 'micros' | 'trends' | 'insights'>('overview')
  const [nutrientTargets, setNutrientTargets] = useState<{
    macronutrients: Macronutrient[]
    micronutrients: Micronutrient[]
  }>({ macronutrients: [], micronutrients: [] })

  useEffect(() => {
    if (userProfile) {
      const targets = {
        macronutrients: NutrientTargets.getMacronutrientTargets(userProfile),
        micronutrients: NutrientTargets.getMicronutrientTargets(userProfile)
      }
      setNutrientTargets(targets)
    }
  }, [userProfile])

  // Calculate nutrient statuses
  const macroStatuses = useMemo(() => {
    if (!dailyIntake?.totalNutrients?.macronutrients || !nutrientTargets.macronutrients) {
      // Return mock data for demonstration
      return ['excellent', 'good', 'warning', 'excellent']
    }
    
    return dailyIntake.totalNutrients.macronutrients.map(nutrient => {
      const target = nutrientTargets.macronutrients.find(t => t.name === nutrient.name)
      return calculateNutrientStatus(nutrient.amount, target?.amount || 0)
    })
  }, [dailyIntake, nutrientTargets.macronutrients])

  const microStatuses = useMemo(() => {
    if (!dailyIntake?.totalNutrients?.micronutrients || !nutrientTargets.micronutrients) {
      // Return mock data for demonstration
      return ['excellent', 'excellent', 'warning', 'excellent', 'warning', 'excellent', 'warning', 'excellent']
    }
    
    return dailyIntake.totalNutrients.micronutrients.map(nutrient => {
      const target = nutrientTargets.micronutrients.find(t => t.name === nutrient.name)
      return calculateNutrientStatus(nutrient.amount, target?.amount || 0)
    })
  }, [dailyIntake, nutrientTargets.micronutrients])

  // Enhanced pie chart data for macronutrients
  const pieChartData = useMemo(() => {
    const macronutrients = dailyIntake?.totalNutrients?.macronutrients || []
    
    const data = [
      { name: 'Protein', value: macronutrients.find(m => m.name === 'Protein')?.amount || 0, color: '#3b82f6', icon: '🥩' },
      { name: 'Carbs', value: macronutrients.find(m => m.name === 'Carbohydrates')?.amount || 0, color: '#10b981', icon: '🍞' },
      { name: 'Fat', value: macronutrients.find(m => m.name === 'Fat')?.amount || 0, color: '#f59e0b', icon: '🥑' },
      { name: 'Fiber', value: macronutrients.find(m => m.name === 'Fiber')?.amount || 0, color: '#8b5cf6', icon: '🌾' }
    ].filter(item => item.value > 0)

    return data
  }, [dailyIntake])

  // Enhanced micro chart data
  const microChartData = useMemo(() => {
    // If we have real data, use it
    if (microStatuses.length > 0) {
      return microStatuses.map((status, index) => {
        const nutrient = dailyIntake?.totalNutrients?.micronutrients?.[index]
        const target = nutrientTargets.micronutrients?.[index]
        const percentage = target ? (nutrient?.amount || 0) / target.amount * 100 : 0
        
        return {
          name: nutrient?.name || `Nutrient ${index + 1}`,
          percentage: percentage,
          status: status,
          amount: nutrient?.amount || 0,
          target: target?.amount || 0,
          color: status === 'excellent' ? '#10b981' : 
                 status === 'good' ? '#3b82f6' : 
                 status === 'warning' ? '#f59e0b' : '#ef4444'
        }
      })
    }
    
    // Generate mock data for demonstration
    const mockMicronutrients = [
      { name: 'Vitamin C', amount: 95, target: 90, status: 'excellent' },
      { name: 'Iron', amount: 85, target: 80, status: 'excellent' },
      { name: 'Magnesium', amount: 75, target: 100, status: 'warning' },
      { name: 'Zinc', amount: 90, target: 85, status: 'excellent' },
      { name: 'Vitamin D', amount: 65, target: 100, status: 'warning' },
      { name: 'B12', amount: 95, target: 90, status: 'excellent' },
      { name: 'Folate', amount: 80, target: 100, status: 'warning' },
      { name: 'Calcium', amount: 88, target: 85, status: 'excellent' }
    ]
    
    return mockMicronutrients.map(nutrient => ({
      name: nutrient.name,
      percentage: (nutrient.amount / nutrient.target) * 100,
      status: nutrient.status,
      amount: nutrient.amount,
      target: nutrient.target,
      color: nutrient.status === 'excellent' ? '#10b981' : 
             nutrient.status === 'good' ? '#3b82f6' : 
             nutrient.status === 'warning' ? '#f59e0b' : '#ef4444'
    }))
  }, [microStatuses, dailyIntake, nutrientTargets.micronutrients])

  // Trend data (mock for now)
  const trendData = useMemo(() => {
    return [
      { day: 'Mon', score: 78, calories: 1850, protein: 120 },
      { day: 'Tue', score: 82, calories: 1920, protein: 135 },
      { day: 'Wed', score: 75, calories: 1680, protein: 110 },
      { day: 'Thu', score: 88, calories: 2100, protein: 145 },
      { day: 'Fri', score: 85, calories: 1980, protein: 130 },
      { day: 'Sat', score: 92, calories: 2200, protein: 155 },
      { day: 'Sun', score: 87, calories: 2050, protein: 140 }
    ]
  }, [])

  // Key metrics
  const keyMetrics = useMemo(() => {
    const calories = dailyIntake?.totalNutrients?.macronutrients?.find(m => m.name === 'Calories')?.amount || 0
    const protein = dailyIntake?.totalNutrients?.macronutrients?.find(m => m.name === 'Protein')?.amount || 0
    const score = dailyIntake?.molecularBalanceScore || 0
    const meals = dailyIntake?.meals?.length || 0

    return {
      calories,
      protein,
      score,
      meals,
      water: 8, // Mock data
      steps: 8500 // Mock data
    }
  }, [dailyIntake])

  const deficiencies = microChartData.filter(n => n.status === 'poor' || n.status === 'critical')
  const excellentNutrients = microChartData.filter(n => n.status === 'excellent')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'macros', label: 'Macros', icon: BarChart3 },
    { id: 'micros', label: 'Micros', icon: PieChart },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'insights', label: 'Insights', icon: Brain }
  ]

  if (!dailyIntake || !userProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading nutrition data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <WelcomeCard 
        userProfile={userProfile}
        molecularBalanceScore={keyMetrics.score}
        lastLogin={new Date().toISOString()}
      />

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <Flame className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {keyMetrics.calories}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Calories</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {keyMetrics.protein}g
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Protein</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Droplets className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {keyMetrics.water}L
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Water</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Activity className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {keyMetrics.steps}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Steps</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {keyMetrics.meals}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Meals</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 dark:bg-pink-900/20 rounded-lg">
              <Shield className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {excellentNutrients.length}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Optimal</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all whitespace-nowrap",
                  activeTab === tab.id
                    ? "text-primary-600 border-b-2 border-primary-600 bg-primary-50 dark:bg-primary-900/20"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Molecular Balance Score */}
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      strokeDashoffset={`${2 * Math.PI * 50 * (1 - keyMetrics.score / 100)}`}
                      className="text-primary-600"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {keyMetrics.score}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Molecular Balance
                      </div>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  Your molecular balance score reflects how well your nutrition aligns with optimal cellular function and metabolic health.
                </p>
              </div>

              {/* Quick Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Excellent Nutrients
                  </h3>
                  <div className="space-y-2">
                    {excellentNutrients.slice(0, 4).map((nutrient, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {nutrient.name}
                        </span>
                        <span className="text-sm text-green-600 font-semibold">
                          {nutrient.percentage.toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Needs Attention
                  </h3>
                  <div className="space-y-2">
                    {deficiencies.slice(0, 4).map((nutrient, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {nutrient.name}
                        </span>
                        <span className="text-sm text-orange-600 font-semibold">
                          {nutrient.percentage.toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'macros' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Macronutrient Distribution */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Macronutrient Distribution
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}g`, 'Amount']} />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Macro Breakdown */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Macro Breakdown
                  </h3>
                  <div className="space-y-4">
                    {macroStatuses.map((status, index) => {
                      const nutrient = dailyIntake?.totalNutrients?.macronutrients?.[index]
                      const target = nutrientTargets.macronutrients?.[index]
                      const percentage = target ? (nutrient?.amount || 0) / target.amount * 100 : 0
                      
                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {nutrient?.name || `Macro ${index + 1}`}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {nutrient?.amount || 0}g / {target?.amount || 0}g
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <motion.div
                              className={cn("h-2 rounded-full", getNutrientStatusBgColor(status))}
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(percentage, 100)}%` }}
                              transition={{ duration: 0.8, delay: index * 0.1 }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className={cn("font-medium", getNutrientStatusColor(status))}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                              {percentage.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'micros' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Micronutrient Chart */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Micronutrient Status
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={microChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                        <Bar dataKey="percentage" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Micronutrient List */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Micronutrient Details
                  </h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {microChartData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-3 h-3 rounded-full", getNutrientStatusBgColor(item.status))} />
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {item.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {item.percentage.toFixed(0)}%
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {item.amount} / {item.target}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'trends' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                7-Day Nutrition Trends
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="score" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary-600" />
                AI Nutrition Insights
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                      <Zap className="h-5 w-5 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Energy Optimization</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Your carbohydrate intake supports sustained energy levels. Consider timing complex carbs around workouts for optimal performance.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                    <ArrowUp className="h-4 w-4" />
                    +12% Energy Efficiency
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                      <Heart className="h-5 w-5 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Cardiovascular Health</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Your omega-3 and fiber intake supports heart health. Maintain this balance for long-term cardiovascular benefits.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                    <CheckCircle className="h-4 w-4" />
                    Optimal Range
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                      <Brain className="h-5 w-5 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Cognitive Function</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Your B-vitamin and antioxidant intake supports brain health. Consider adding more leafy greens for enhanced cognitive performance.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-purple-600 font-medium">
                    <TrendingUp className="h-4 w-4" />
                    Improving
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-lg">
                      <Target className="h-5 w-5 text-orange-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Muscle Health</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Your protein intake is well-distributed. Consider adding more magnesium-rich foods for better muscle recovery.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-orange-600 font-medium">
                    <Info className="h-4 w-4" />
                    Monitor Progress
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
})
