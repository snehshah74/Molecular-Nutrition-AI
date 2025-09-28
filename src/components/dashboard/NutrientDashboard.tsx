import { useState, useEffect, useMemo, memo } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  AlertTriangle,
  Target
} from 'lucide-react'
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import type { DailyIntake, Macronutrient, Micronutrient, NutrientStatus } from '@/types'
import { NutrientTargets } from '@/services/calculations'
import { calculateNutrientStatus, getNutrientStatusColor, getNutrientStatusBgColor, formatNumber } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface NutrientDashboardProps {
  dailyIntake: DailyIntake | null
  userProfile: any
}


export const NutrientDashboard = memo(function NutrientDashboard({ dailyIntake, userProfile }: NutrientDashboardProps) {
  const [activeTab, setActiveTab] = useState<'macros' | 'micros' | 'overview'>('overview')
  const [nutrientTargets, setNutrientTargets] = useState<{
    macronutrients: Macronutrient[]
    micronutrients: Micronutrient[]
  }>({ macronutrients: [], micronutrients: [] })

  // Debug logging
  useEffect(() => {
    console.log('=== NUTRIENT DASHBOARD DEBUG ===')
    console.log('dailyIntake:', dailyIntake)
    console.log('userProfile:', userProfile)
    console.log('dailyIntake exists:', !!dailyIntake)
    console.log('userProfile exists:', !!userProfile)
    if (dailyIntake) {
      console.log('dailyIntake.meals:', dailyIntake.meals)
      console.log('dailyIntake.totalNutrients:', dailyIntake.totalNutrients)
    }
  }, [dailyIntake, userProfile])

  useEffect(() => {
    if (userProfile) {
      const targets = {
        macronutrients: NutrientTargets.getMacronutrientTargets(userProfile),
        micronutrients: NutrientTargets.getMicronutrientTargets(userProfile)
      }
      setNutrientTargets(targets)
    }
  }, [userProfile])

  if (!userProfile) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No user profile available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Please complete your profile setup first
          </p>
        </div>
      </div>
    )
  }

  // Create fallback sample data if no dailyIntake
  const displayData = dailyIntake || {
    date: new Date().toISOString().split('T')[0],
    meals: [],
    totalNutrients: {
      macronutrients: [
        { name: 'Calories', amount: 552, unit: 'kcal', calories: 552, status: 'good' as const },
        { name: 'Protein', amount: 22.5, unit: 'g', calories: 90, status: 'good' as const },
        { name: 'Carbohydrates', amount: 100.5, unit: 'g', calories: 402, status: 'good' as const },
        { name: 'Fat', amount: 9, unit: 'g', calories: 81, status: 'good' as const },
        { name: 'Fiber', amount: 19.2, unit: 'g', calories: 0, status: 'excellent' as const }
      ],
      micronutrients: [
        { name: 'Iron', amount: 7.3, unit: 'mg', category: 'mineral' as const, status: 'excellent' as const },
        { name: 'Vitamin C', amount: 24, unit: 'mg', category: 'vitamin' as const, status: 'good' as const },
        { name: 'Magnesium', amount: 179, unit: 'mg', category: 'mineral' as const, status: 'excellent' as const },
        { name: 'Zinc', amount: 3.7, unit: 'mg', category: 'mineral' as const, status: 'good' as const },
        { name: 'Folate', amount: 153, unit: 'mcg', category: 'vitamin' as const, status: 'excellent' as const }
      ]
    },
    molecularBalanceScore: 78
  }

  const { totalNutrients } = displayData
  const { macronutrients, micronutrients } = totalNutrients

  // Calculate nutrient statuses
  const macroStatuses: NutrientStatus[] = macronutrients.map(macro => {
    const target = nutrientTargets.macronutrients.find(t => t.name === macro.name)
    const status = target ? calculateNutrientStatus(macro.amount, target.amount) : 'good'
    return {
      name: macro.name,
      current: macro.amount,
      target: target?.amount || 0,
      unit: macro.unit,
      status
    }
  })

  const microStatuses: NutrientStatus[] = micronutrients.map(micro => {
    const target = nutrientTargets.micronutrients.find(t => t.name === micro.name)
    const status = target ? calculateNutrientStatus(micro.amount, target.amount) : 'good'
    return {
      name: micro.name,
      current: micro.amount,
      target: target?.amount || 0,
      unit: micro.unit,
      status
    }
  })

  // Prepare chart data with useMemo for performance
  const microChartData = useMemo(() => 
    microStatuses.slice(0, 8).map(micro => ({
      name: micro.name,
      value: micro.current,
      target: micro.target,
      percentage: micro.target > 0 ? (micro.current / micro.target) * 100 : 0,
      status: micro.status
    })), [microStatuses]
  )

  const pieChartData = useMemo(() => {
    const data = [
      { name: 'Protein', value: macronutrients.find(m => m.name === 'Protein')?.amount || 0, color: '#3b82f6' },
      { name: 'Carbs', value: macronutrients.find(m => m.name === 'Carbohydrates')?.amount || 0, color: '#10b981' },
      { name: 'Fat', value: macronutrients.find(m => m.name === 'Fat')?.amount || 0, color: '#f59e0b' },
      { name: 'Fiber', value: macronutrients.find(m => m.name === 'Fiber')?.amount || 0, color: '#8b5cf6' }
    ].filter(item => item.value > 0) // Only show nutrients with values

    return data
  }, [macronutrients])

  const deficiencies = microStatuses.filter(n => n.status === 'poor' || n.status === 'critical')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'macros', label: 'Macronutrients', icon: PieChart },
    { id: 'micros', label: 'Micronutrients', icon: Target }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <BarChart3 className="h-6 w-6 mr-2 text-primary-600 dark:text-primary-400" />
            Nutrient Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Molecular-level breakdown of your daily nutrition
          </p>
        </div>
        
        {/* Molecular Balance Score */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-center"
        >
          <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
            {displayData.molecularBalanceScore}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Balance Score</div>
        </motion.div>
      </div>

      {/* Alert for deficiencies */}
      {deficiencies.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4"
        >
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-800 dark:text-red-200">
                Nutrient Deficiencies Detected
              </h4>
              <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                {deficiencies.map(d => d.name).join(', ')} levels are below optimal. 
                Check AI recommendations for personalized suggestions.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <motion.button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                activeTab === tab.id
                  ? "bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </motion.button>
          )
        })}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Macronutrient Pie Chart */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
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
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${formatNumber(value as number)}g`, name]} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="space-y-4">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                  Daily Summary
                </h3>
                <div className="space-y-3">
                  {macroStatuses.map(macro => (
                    <div key={macro.name} className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">{macro.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{formatNumber(macro.current)}{macro.unit}</span>
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          getNutrientStatusBgColor(macro.status),
                          getNutrientStatusColor(macro.status)
                        )}>
                          {macro.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Macronutrients Tab */}
        {activeTab === 'macros' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                Macronutrient Breakdown
              </h3>
              
              <div className="space-y-4">
                {macroStatuses.map(macro => (
                  <motion.div
                    key={macro.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {macro.name}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {formatNumber(macro.current)} / {formatNumber(macro.target)} {macro.unit}
                        </span>
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          getNutrientStatusBgColor(macro.status),
                          getNutrientStatusColor(macro.status)
                        )}>
                          {macro.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((macro.current / macro.target) * 100, 100)}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={cn(
                          "h-3 rounded-full transition-all duration-500",
                          macro.status === 'excellent' && "bg-green-500",
                          macro.status === 'good' && "bg-blue-500",
                          macro.status === 'warning' && "bg-yellow-500",
                          macro.status === 'poor' && "bg-orange-500",
                          macro.status === 'critical' && "bg-red-500"
                        )}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Micronutrients Tab */}
        {activeTab === 'micros' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                <Target className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                Micronutrient Status
              </h3>
              
              {/* Micronutrient Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {microStatuses.map(micro => (
                  <motion.div
                    key={micro.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all duration-200",
                      micro.status === 'excellent' && "border-green-200 bg-green-50 dark:bg-green-900 dark:border-green-700",
                      micro.status === 'good' && "border-blue-200 bg-blue-50 dark:bg-blue-900 dark:border-blue-700",
                      micro.status === 'warning' && "border-yellow-200 bg-yellow-50 dark:bg-yellow-900 dark:border-yellow-700",
                      micro.status === 'poor' && "border-orange-200 bg-orange-50 dark:bg-orange-900 dark:border-orange-700",
                      micro.status === 'critical' && "border-red-200 bg-red-50 dark:bg-red-900 dark:border-red-700"
                    )}
                  >
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {formatNumber(micro.current)}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        {micro.unit}
                      </div>
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                        {micro.name}
                      </div>
                      <div className={cn(
                        "text-xs px-2 py-1 rounded-full font-medium",
                        getNutrientStatusBgColor(micro.status),
                        getNutrientStatusColor(micro.status)
                      )}>
                        {micro.status}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Micronutrient Chart */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                Micronutrient Levels vs Targets
              </h3>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={microChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [`${formatNumber(value as number)}`, name === 'value' ? 'Current' : 'Target']} />
                    <Legend />
                    <Bar dataKey="value" fill="#3b82f6" name="Current" />
                    <Bar dataKey="target" fill="#e5e7eb" name="Target" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
})
