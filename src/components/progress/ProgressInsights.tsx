import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Calendar,
  Target,
  Award,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  Zap,
  Heart
} from 'lucide-react'
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import type { ProgressData, TrendAnalysis, DailyIntake } from '@/types'
import { ProgressAnalysis } from '@/services/calculations'
import { formatNumber } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ProgressInsightsProps {
  progressData: ProgressData[]
  dailyIntake: DailyIntake | null
}

export function ProgressInsights({ progressData, dailyIntake }: ProgressInsightsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('week')
  const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis | null>(null)

  useEffect(() => {
    if (progressData.length > 0) {
      const analysis = ProgressAnalysis.analyzeTrends(progressData)
      setTrendAnalysis({
        period: 'month',
        data: progressData,
        ...analysis
      })
    }
  }, [progressData])

  // Generate mock data for demonstration
  const generateMockProgressData = (): ProgressData[] => {
    const data: ProgressData[] = []
    const today = new Date()
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      data.push({
        date: date.toISOString().split('T')[0],
        molecularBalanceScore: Math.floor(Math.random() * 30) + 70, // 70-100 range
        nutrientTrends: {
          'Protein': {
            current: Math.floor(Math.random() * 20) + 40,
            target: 60,
            trend: Math.random() > 0.5 ? 'improving' : 'stable'
          },
          'Iron': {
            current: Math.floor(Math.random() * 10) + 5,
            target: 12,
            trend: Math.random() > 0.3 ? 'improving' : 'declining'
          },
          'Vitamin C': {
            current: Math.floor(Math.random() * 30) + 40,
            target: 75,
            trend: 'stable'
          }
        },
        healthInsights: [
          'Consistent protein intake supporting muscle health',
          'Iron levels improving with dietary changes',
          'Vitamin C intake meeting daily requirements'
        ]
      })
    }
    
    return data
  }

  const mockData = progressData.length > 0 ? progressData : generateMockProgressData()

  const getTrendIcon = (trend: 'improving' | 'stable' | 'declining') => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getTrendColor = (trend: 'improving' | 'stable' | 'declining') => {
    switch (trend) {
      case 'improving':
        return 'text-green-600 dark:text-green-400'
      case 'declining':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const periods = [
    { value: 'week', label: '7 Days', icon: Calendar },
    { value: 'month', label: '30 Days', icon: BarChart3 },
    { value: 'quarter', label: '90 Days', icon: PieChart }
  ]

  const currentScore = dailyIntake?.molecularBalanceScore || 0
  const averageScore = mockData.length > 0 
    ? mockData.reduce((sum, data) => sum + data.molecularBalanceScore, 0) / mockData.length 
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-primary-600 dark:text-primary-400" />
            Progress Insights
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Track your molecular nutrition journey over time
          </p>
        </div>
        
        {/* Period Selector */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {periods.map(period => {
            const Icon = period.icon
            return (
              <motion.button
                key={period.value}
                type="button"
                onClick={() => setSelectedPeriod(period.value as any)}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  selectedPeriod === period.value
                    ? "bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="h-4 w-4" />
                <span>{period.label}</span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 text-center"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full mx-auto mb-4">
            <Zap className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
            {currentScore}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Current Balance Score
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${currentScore}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className="bg-primary-500 h-2 rounded-full"
            />
          </div>
        </motion.div>

        {/* Average Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 text-center"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full mx-auto mb-4">
            <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            {formatNumber(averageScore, 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Average Score
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Last 30 days
          </div>
        </motion.div>

        {/* Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6 text-center"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full mx-auto mb-4">
            <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex items-center justify-center space-x-2 mb-2">
            {trendAnalysis && getTrendIcon(trendAnalysis.overallTrend)}
            <span className={cn(
              "text-lg font-semibold",
              getTrendColor(trendAnalysis?.overallTrend || 'stable')
            )}>
              {trendAnalysis?.overallTrend || 'stable'}
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Overall Trend
          </div>
        </motion.div>
      </div>

      {/* Balance Score Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
          <LineChart className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
          Molecular Balance Score Trend
        </h3>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData.slice(-30)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value) => [`${value}`, 'Balance Score']}
              />
              <Area
                type="monotone"
                dataKey="molecularBalanceScore"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Nutrient Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
            Key Nutrient Trends
          </h3>
          
          <div className="space-y-4">
            {mockData.length > 0 && Object.entries(mockData[mockData.length - 1].nutrientTrends).map(([nutrient, data]) => (
              <div key={nutrient} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getTrendIcon(data.trend)}
                  <span className="font-medium text-gray-900 dark:text-gray-100">{nutrient}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {data.current}/{data.target}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatNumber((data.current / data.target) * 100, 0)}% of target
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
            <Heart className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
            Health Insights
          </h3>
          
          <div className="space-y-4">
            {trendAnalysis?.keyInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg"
              >
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                  <Award className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200">{insight}</p>
              </motion.div>
            ))}
            
            {trendAnalysis?.recommendations.map((recommendation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900 rounded-lg"
              >
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                  <Target className="h-3 w-3 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-sm text-green-800 dark:text-green-200">{recommendation}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Long-term Predictions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
          Long-term Health Predictions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Positive Trends</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Consistent protein intake supporting muscle health</span>
              </div>
              <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Iron levels improving with dietary changes</span>
              </div>
              <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Vitamin C intake meeting daily requirements</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Areas for Improvement</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
                <TrendingDown className="h-4 w-4" />
                <span className="text-sm">Consider increasing fiber intake for digestive health</span>
              </div>
              <div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
                <TrendingDown className="h-4 w-4" />
                <span className="text-sm">Omega-3 levels could be optimized for heart health</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
