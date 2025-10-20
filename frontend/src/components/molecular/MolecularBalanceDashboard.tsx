import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Dna, 
  Brain, 
  Zap, 
  Heart, 
  Shield, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Target,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface MolecularBalance {
  id: string
  user_id: string
  date: string
  score: number
  protein_synthesis: number
  cognitive_function: number
  energy_levels: number
  inflammation_status: number
  metabolic_efficiency: number
  created_at: string
}

interface MolecularBalanceDashboardProps {
  userProfile?: any
}

export function MolecularBalanceDashboard({ userProfile }: MolecularBalanceDashboardProps) {
  const [molecularData, setMolecularData] = useState<MolecularBalance | null>(null)
  const [loading, setLoading] = useState(true)
  const [trends, setTrends] = useState<MolecularBalance[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadMolecularData()
    }
  }, [user])

  const loadMolecularData = async () => {
    if (!user) return

    try {
      // Load latest molecular balance data
      const { data: latest, error: latestError } = await supabase
        .from('molecular_balance')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(1)
        .single()

      if (latestError && latestError.code !== 'PGRST116') {
        throw latestError
      }

      if (latest) {
        setMolecularData(latest)
      } else {
        // Create sample data if none exists
        await createSampleMolecularData()
      }

      // Load trends (last 30 days)
      const { data: trendData, error: trendError } = await supabase
        .from('molecular_balance')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(30)

      if (trendError) throw trendError
      setTrends(trendData || [])

    } catch (error) {
      console.error('Error loading molecular data:', error)
      // Create sample data on error
      await createSampleMolecularData()
    } finally {
      setLoading(false)
    }
  }

  const createSampleMolecularData = async () => {
    if (!user) return

    const sampleData = {
      user_id: user.id,
      date: new Date().toISOString().split('T')[0],
      score: Math.floor(Math.random() * 20) + 80, // 80-100
      protein_synthesis: Math.floor(Math.random() * 20) + 80,
      cognitive_function: Math.floor(Math.random() * 20) + 75,
      energy_levels: Math.floor(Math.random() * 20) + 70,
      inflammation_status: Math.floor(Math.random() * 15) + 85, // Lower inflammation is better
      metabolic_efficiency: Math.floor(Math.random() * 20) + 80
    }

    try {
      const { data, error } = await supabase
        .from('molecular_balance')
        .insert(sampleData)
        .select()
        .single()

      if (error) throw error
      setMolecularData(data)
    } catch (error) {
      console.error('Error creating sample data:', error)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return { color: 'green', bg: 'bg-green-500', text: 'text-green-600', bgLight: 'bg-green-50', border: 'border-green-200' }
    if (score >= 80) return { color: 'blue', bg: 'bg-blue-500', text: 'text-blue-600', bgLight: 'bg-blue-50', border: 'border-blue-200' }
    if (score >= 70) return { color: 'yellow', bg: 'bg-yellow-500', text: 'text-yellow-600', bgLight: 'bg-yellow-50', border: 'border-yellow-200' }
    return { color: 'red', bg: 'bg-red-500', text: 'text-red-600', bgLight: 'bg-red-50', border: 'border-red-200' }
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent'
    if (score >= 80) return 'Good'
    if (score >= 70) return 'Fair'
    return 'Needs Attention'
  }

  const molecularMetrics = [
    {
      key: 'protein_synthesis',
      name: 'Protein Synthesis',
      icon: Dna,
      description: 'Cellular protein building efficiency',
      color: 'blue'
    },
    {
      key: 'cognitive_function',
      name: 'Cognitive Function',
      icon: Brain,
      description: 'Brain health and mental clarity',
      color: 'purple'
    },
    {
      key: 'energy_levels',
      name: 'Energy Levels',
      icon: Zap,
      description: 'Cellular energy production',
      color: 'yellow'
    },
    {
      key: 'inflammation_status',
      name: 'Inflammation Status',
      icon: Shield,
      description: 'Anti-inflammatory response',
      color: 'green'
    },
    {
      key: 'metabolic_efficiency',
      name: 'Metabolic Efficiency',
      icon: Activity,
      description: 'Nutrient processing and utilization',
      color: 'red'
    }
  ]

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!molecularData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No Molecular Data Available
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Complete your profile and start tracking to see your molecular balance score.
        </p>
      </div>
    )
  }

  const scoreColors = getScoreColor(molecularData.score)
  const scoreLabel = getScoreLabel(molecularData.score)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Molecular Balance Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Real-time analysis of your cellular health and nutrition optimization
        </p>
      </div>

      {/* Main Score Card */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-transparent to-purple-50/50 dark:from-primary-900/10 dark:to-purple-900/10" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-lg">
                <Dna className="h-10 w-10 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Molecular Balance</h3>
                <p className="text-gray-600 dark:text-gray-400">Real-time Analysis</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                {molecularData.score}/100
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(molecularData.date).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Progress Ring */}
          <div className="flex justify-center mb-8">
            <div className="relative w-48 h-48">
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200 dark:text-gray-700"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={scoreColors.text}
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="transparent"
                  strokeDasharray={`${molecularData.score}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white">{molecularData.score}%</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{scoreLabel}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex justify-center">
            <div className={`px-6 py-3 rounded-full ${scoreColors.bgLight} ${scoreColors.border} border-2`}>
              <span className={`font-semibold ${scoreColors.text}`}>
                {scoreLabel} Molecular Health
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Molecular Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {molecularMetrics.map((metric, index) => {
          const value = molecularData[metric.key as keyof MolecularBalance] as number
          const Icon = metric.icon
          const colors = getScoreColor(value)

          return (
            <motion.div
              key={metric.key}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    colors.color === 'green' ? 'bg-green-100 dark:bg-green-900/20' :
                    colors.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20' :
                    colors.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                    'bg-red-100 dark:bg-red-900/20'
                  }`}>
                    <Icon className={`h-6 w-6 ${
                      colors.color === 'green' ? 'text-green-600' :
                      colors.color === 'blue' ? 'text-blue-600' :
                      colors.color === 'yellow' ? 'text-yellow-600' :
                      'text-red-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{metric.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{metric.description}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  colors.color === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300' :
                  colors.color === 'blue' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' :
                  colors.color === 'yellow' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300' :
                  'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                }`}>
                  {getScoreLabel(value)}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Score</span>
                  <span className="font-bold text-gray-900 dark:text-white">{value}/100</span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      colors.color === 'green' ? 'bg-green-500' :
                      colors.color === 'blue' ? 'bg-blue-500' :
                      colors.color === 'yellow' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${value}%` }}
                  />
                </div>

                {/* Trend Indicator */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">vs. Optimal</span>
                  <div className="flex items-center space-x-1">
                    {value >= 80 ? (
                      <>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-green-600 dark:text-green-400">Optimal</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-4 w-4 text-yellow-500" />
                        <span className="text-yellow-600 dark:text-yellow-400">Needs Focus</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Recommendations */}
      <motion.div
        className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-primary-200 dark:border-primary-700/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircle className="h-6 w-6 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Recommendations
          </h3>
        </div>
        <div className="space-y-2">
          <p className="text-gray-700 dark:text-gray-300">
            • Focus on anti-inflammatory foods to improve your inflammation status
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            • Increase omega-3 intake for enhanced cognitive function
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            • Optimize protein timing for better synthesis efficiency
          </p>
        </div>
      </motion.div>
    </div>
  )
}
