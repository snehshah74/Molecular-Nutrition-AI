import { useState, useMemo, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, 
  Activity, 
  Heart, 
  Brain, 
  Shield,
  Target,
  Calendar,
  BarChart3,
  PieChart,
  Zap,
  Clock,
  Award,
  Star,
  ArrowUp,
  ArrowDown,
  Minus,
  Download,
  Share2
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
} from 'recharts'
import type { UserProfile, DailyIntake } from '@/types'
import { cn } from '@/lib/utils'

interface HealthTrendAnalysisProps {
  userProfile: UserProfile | null
  dailyIntake: DailyIntake | null
  historicalData?: HealthData[]
}

interface HealthData {
  date: string
  molecularBalanceScore: number
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  water: number
  steps: number
  sleep: number
  stress: number
  energy: number
  mood: number
  weight?: number
  bodyFat?: number
  muscleMass?: number
  deficiencies: string[]
  achievements: string[]
}

interface TrendInsight {
  metric: string
  trend: 'up' | 'down' | 'stable'
  percentage: number
  significance: 'high' | 'medium' | 'low'
  insight: string
  recommendation: string
  icon: any
  color: string
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: any
  date: string
  category: 'nutrition' | 'fitness' | 'wellness' | 'streak'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export const HealthTrendAnalysis = memo(function HealthTrendAnalysis({ 
  userProfile, 
  dailyIntake: _dailyIntake,
  historicalData = []
}: HealthTrendAnalysisProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [selectedMetric, setSelectedMetric] = useState<'overview' | 'nutrition' | 'fitness' | 'wellness'>('overview')
  const [showInsights, setShowInsights] = useState(true)

  // Generate mock historical data if none provided
  const healthData = useMemo(() => {
    if (historicalData.length > 0) return historicalData

    // Generate 30 days of mock data
    const data: HealthData[] = []
    const today = new Date()
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      // Add some realistic variation and trends
      const baseScore = 75 + Math.sin(i * 0.2) * 15 + Math.random() * 10
      const calories = 1800 + Math.sin(i * 0.1) * 200 + Math.random() * 100
      const protein = 120 + Math.sin(i * 0.15) * 20 + Math.random() * 15
      
      data.push({
        date: date.toISOString().split('T')[0],
        molecularBalanceScore: Math.max(60, Math.min(95, baseScore)),
        calories: Math.round(calories),
        protein: Math.round(protein),
        carbs: Math.round(calories * 0.45 / 4),
        fat: Math.round(calories * 0.25 / 9),
        fiber: Math.round(25 + Math.random() * 10),
        water: Math.round(6 + Math.random() * 2),
        steps: Math.round(8000 + Math.sin(i * 0.3) * 2000 + Math.random() * 1000),
        sleep: Math.round(7.5 + Math.sin(i * 0.2) * 1 + Math.random() * 0.5),
        stress: Math.round(3 + Math.sin(i * 0.25) * 2 + Math.random() * 1),
        energy: Math.round(7 + Math.sin(i * 0.18) * 2 + Math.random() * 1),
        mood: Math.round(7.5 + Math.sin(i * 0.22) * 1.5 + Math.random() * 1),
        weight: userProfile ? (70 + Math.sin(i * 0.05) * 2 + Math.random() * 1) : undefined,
        bodyFat: userProfile ? (15 + Math.sin(i * 0.08) * 3 + Math.random() * 1) : undefined,
        muscleMass: userProfile ? (25 + Math.sin(i * 0.1) * 2 + Math.random() * 1) : undefined,
        deficiencies: i % 7 === 0 ? ['Iron', 'Vitamin D'] : i % 5 === 0 ? ['Magnesium'] : [],
        achievements: i % 10 === 0 ? ['Perfect Week', 'Hydration Master'] : i % 15 === 0 ? ['Consistency King'] : []
      })
    }
    
    return data
  }, [historicalData, userProfile])

  // Filter data based on selected period
  const filteredData = useMemo(() => {
    const days = selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : selectedPeriod === '90d' ? 90 : 365
    return healthData.slice(-days)
  }, [healthData, selectedPeriod])

  // Calculate trends and insights
  const trendInsights = useMemo(() => {
    if (filteredData.length < 2) return []

    const insights: TrendInsight[] = []
    const recent = filteredData.slice(-7)
    const previous = filteredData.slice(-14, -7)
    
    // Molecular Balance Score trend
    const recentScore = recent.reduce((sum, d) => sum + d.molecularBalanceScore, 0) / recent.length
    const previousScore = previous.length > 0 ? previous.reduce((sum, d) => sum + d.molecularBalanceScore, 0) / previous.length : recentScore
    const scoreChange = ((recentScore - previousScore) / previousScore) * 100
    
    insights.push({
      metric: 'Molecular Balance',
      trend: scoreChange > 2 ? 'up' : scoreChange < -2 ? 'down' : 'stable',
      percentage: Math.abs(scoreChange),
      significance: Math.abs(scoreChange) > 10 ? 'high' : Math.abs(scoreChange) > 5 ? 'medium' : 'low',
      insight: scoreChange > 2 ? 'Your molecular nutrition is improving!' : 
               scoreChange < -2 ? 'Your molecular balance needs attention' : 'Your molecular balance is stable',
      recommendation: scoreChange < -2 ? 'Focus on nutrient-dense foods and hydration' : 
                     scoreChange > 2 ? 'Great progress! Keep maintaining this balance' : 'Continue current nutrition habits',
      icon: Shield,
      color: scoreChange > 2 ? '#10b981' : scoreChange < -2 ? '#ef4444' : '#3b82f6'
    })

    // Protein trend
    const recentProtein = recent.reduce((sum, d) => sum + d.protein, 0) / recent.length
    const previousProtein = previous.length > 0 ? previous.reduce((sum, d) => sum + d.protein, 0) / previous.length : recentProtein
    const proteinChange = ((recentProtein - previousProtein) / previousProtein) * 100
    
    insights.push({
      metric: 'Protein Intake',
      trend: proteinChange > 5 ? 'up' : proteinChange < -5 ? 'down' : 'stable',
      percentage: Math.abs(proteinChange),
      significance: Math.abs(proteinChange) > 15 ? 'high' : Math.abs(proteinChange) > 8 ? 'medium' : 'low',
      insight: proteinChange > 5 ? 'Your protein intake has increased significantly' : 
               proteinChange < -5 ? 'Your protein intake has decreased' : 'Your protein intake is consistent',
      recommendation: proteinChange < -5 ? 'Consider adding more protein-rich foods' : 
                     proteinChange > 15 ? 'Excellent protein intake! Monitor for balance' : 'Maintain current protein levels',
      icon: Target,
      color: proteinChange > 5 ? '#10b981' : proteinChange < -5 ? '#f59e0b' : '#3b82f6'
    })

    // Steps trend
    const recentSteps = recent.reduce((sum, d) => sum + d.steps, 0) / recent.length
    const previousSteps = previous.length > 0 ? previous.reduce((sum, d) => sum + d.steps, 0) / previous.length : recentSteps
    const stepsChange = ((recentSteps - previousSteps) / previousSteps) * 100
    
    insights.push({
      metric: 'Daily Steps',
      trend: stepsChange > 5 ? 'up' : stepsChange < -5 ? 'down' : 'stable',
      percentage: Math.abs(stepsChange),
      significance: Math.abs(stepsChange) > 20 ? 'high' : Math.abs(stepsChange) > 10 ? 'medium' : 'low',
      insight: stepsChange > 5 ? 'You\'ve been more active recently!' : 
               stepsChange < -5 ? 'Your activity level has decreased' : 'Your activity level is consistent',
      recommendation: stepsChange < -5 ? 'Try to incorporate more walking into your daily routine' : 
                     stepsChange > 20 ? 'Great job staying active!' : 'Keep up the good work',
      icon: Activity,
      color: stepsChange > 5 ? '#10b981' : stepsChange < -5 ? '#f59e0b' : '#3b82f6'
    })

    // Sleep trend
    const recentSleep = recent.reduce((sum, d) => sum + d.sleep, 0) / recent.length
    const previousSleep = previous.length > 0 ? previous.reduce((sum, d) => sum + d.sleep, 0) / previous.length : recentSleep
    const sleepChange = ((recentSleep - previousSleep) / previousSleep) * 100
    
    insights.push({
      metric: 'Sleep Quality',
      trend: sleepChange > 3 ? 'up' : sleepChange < -3 ? 'down' : 'stable',
      percentage: Math.abs(sleepChange),
      significance: Math.abs(sleepChange) > 10 ? 'high' : Math.abs(sleepChange) > 5 ? 'medium' : 'low',
      insight: sleepChange > 3 ? 'Your sleep quality has improved' : 
               sleepChange < -3 ? 'Your sleep quality needs attention' : 'Your sleep quality is stable',
      recommendation: sleepChange < -3 ? 'Focus on sleep hygiene and stress management' : 
                     sleepChange > 10 ? 'Excellent sleep habits!' : 'Continue current sleep routine',
      icon: Clock,
      color: sleepChange > 3 ? '#10b981' : sleepChange < -3 ? '#ef4444' : '#3b82f6'
    })

    return insights
  }, [filteredData])

  // Calculate achievements
  const achievements = useMemo(() => {
    const recentAchievements: Achievement[] = []
    
    // Check for streaks
    let currentStreak = 0
    let maxStreak = 0
    for (let i = filteredData.length - 1; i >= 0; i--) {
      if (filteredData[i].molecularBalanceScore >= 80) {
        currentStreak++
        maxStreak = Math.max(maxStreak, currentStreak)
      } else {
        currentStreak = 0
      }
    }
    
    if (currentStreak >= 7) {
      recentAchievements.push({
        id: 'streak-7',
        title: 'Perfect Week',
        description: 'Maintained excellent molecular balance for 7 days',
        icon: Star,
        date: new Date().toISOString(),
        category: 'streak',
        rarity: 'rare'
      })
    }
    
    if (currentStreak >= 30) {
      recentAchievements.push({
        id: 'streak-30',
        title: 'Consistency King',
        description: 'Maintained excellent molecular balance for 30 days',
        icon: Award,
        date: new Date().toISOString(),
        category: 'streak',
        rarity: 'epic'
      })
    }
    
    // Check for nutrition achievements
    const avgProtein = filteredData.reduce((sum, d) => sum + d.protein, 0) / filteredData.length
    if (avgProtein >= 120) {
      recentAchievements.push({
        id: 'protein-master',
        title: 'Protein Power',
        description: 'Consistently high protein intake',
        icon: Target,
        date: new Date().toISOString(),
        category: 'nutrition',
        rarity: 'common'
      })
    }
    
    // Check for fitness achievements
    const avgSteps = filteredData.reduce((sum, d) => sum + d.steps, 0) / filteredData.length
    if (avgSteps >= 10000) {
      recentAchievements.push({
        id: 'step-master',
        title: 'Step Champion',
        description: 'Averaged 10,000+ steps daily',
        icon: Activity,
        date: new Date().toISOString(),
        category: 'fitness',
        rarity: 'rare'
      })
    }
    
    return recentAchievements
  }, [filteredData])

  // Get chart data based on selected metric
  const chartData = useMemo(() => {
    return filteredData.map(d => ({
      date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: d.date,
      molecularBalance: d.molecularBalanceScore,
      calories: d.calories,
      protein: d.protein,
      carbs: d.carbs,
      fat: d.fat,
      fiber: d.fiber,
      water: d.water,
      steps: d.steps,
      sleep: d.sleep,
      stress: d.stress,
      energy: d.energy,
      mood: d.mood,
      weight: d.weight,
      bodyFat: d.bodyFat,
      muscleMass: d.muscleMass
    }))
  }, [filteredData, selectedMetric])

  const periods = [
    { id: '7d', label: '7 Days', icon: Calendar },
    { id: '30d', label: '30 Days', icon: Calendar },
    { id: '90d', label: '90 Days', icon: Calendar },
    { id: '1y', label: '1 Year', icon: Calendar }
  ]

  const metrics = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'nutrition', label: 'Nutrition', icon: PieChart },
    { id: 'fitness', label: 'Fitness', icon: Activity },
    { id: 'wellness', label: 'Wellness', icon: Heart }
  ]

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-4 w-4 text-green-600" />
      case 'down': return <ArrowDown className="h-4 w-4 text-red-600" />
      default: return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getAchievementColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      case 'rare': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
      case 'epic': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
      case 'legendary': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary-600" />
            Health Trend Analysis
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive analysis of your health and nutrition trends
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </motion.button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          {/* Period Selection */}
          <div className="flex gap-2">
            {periods.map(period => {
              const Icon = period.icon
              return (
                <button
                  key={period.id}
                  onClick={() => setSelectedPeriod(period.id as any)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                    selectedPeriod === period.id
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {period.label}
                </button>
              )
            })}
          </div>

          {/* Metric Selection */}
          <div className="flex gap-2">
            {metrics.map(metric => {
              const Icon = metric.icon
              return (
                <button
                  key={metric.id}
                  onClick={() => setSelectedMetric(metric.id as any)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                    selectedMetric === metric.id
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {metric.label}
                </button>
              )
            })}
          </div>

          {/* Toggle Insights */}
          <button
            onClick={() => setShowInsights(!showInsights)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
              showInsights
                ? "bg-green-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            )}
          >
            <Zap className="h-4 w-4" />
            AI Insights
          </button>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Balance Score</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {Math.round(filteredData.reduce((sum, d) => sum + d.molecularBalanceScore, 0) / filteredData.length)}
              </p>
            </div>
            <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
              <Shield className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Calories</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {Math.round(filteredData.reduce((sum, d) => sum + d.calories, 0) / filteredData.length)}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <Zap className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Steps</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {Math.round(filteredData.reduce((sum, d) => sum + d.steps, 0) / filteredData.length).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Sleep</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {filteredData.reduce((sum, d) => sum + d.sleep, 0) / filteredData.length | 0}h
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI Insights */}
      <AnimatePresence>
        {showInsights && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                <Brain className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                AI Trend Insights
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trendInsights.map((insight, index) => {
                const Icon = insight.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <Icon className="h-4 w-4" style={{ color: insight.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {insight.metric}
                          </span>
                          {getTrendIcon(insight.trend)}
                          <span className="text-sm font-semibold" style={{ color: insight.color }}>
                            {insight.percentage.toFixed(1)}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {insight.insight}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {insight.recommendation}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Award className="h-5 w-5 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Recent Achievements
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn("rounded-lg p-4 border-2", getAchievementColor(achievement.rarity))}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="h-5 w-5 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">{achievement.title}</h4>
                      <p className="text-xs opacity-80 mt-1">{achievement.description}</p>
                      <p className="text-xs opacity-60 mt-2">
                        {new Date(achievement.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
          {selectedMetric === 'overview' ? 'Molecular Balance Trend' :
           selectedMetric === 'nutrition' ? 'Nutrition Trends' :
           selectedMetric === 'fitness' ? 'Fitness Trends' :
           'Wellness Trends'}
        </h3>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {selectedMetric === 'overview' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="molecularBalance" stroke="#3b82f6" strokeWidth={3} name="Molecular Balance" />
              </LineChart>
            ) : selectedMetric === 'nutrition' ? (
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="calories" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Calories" />
                <Area type="monotone" dataKey="protein" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Protein" />
                <Area type="monotone" dataKey="carbs" stackId="3" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="Carbs" />
                <Area type="monotone" dataKey="fat" stackId="4" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} name="Fat" />
              </AreaChart>
            ) : selectedMetric === 'fitness' ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="steps" fill="#10b981" name="Steps" />
                <Bar dataKey="energy" fill="#3b82f6" name="Energy Level" />
              </BarChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sleep" stroke="#3b82f6" strokeWidth={2} name="Sleep (hours)" />
                <Line type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={2} name="Stress Level" />
                <Line type="monotone" dataKey="mood" stroke="#10b981" strokeWidth={2} name="Mood" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
})
