import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Heart,
  Brain,
  Zap,
  Shield
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface Biomarker {
  id: string
  date: string
  blood_glucose: number | null
  cholesterol: number | null
  inflammation_markers: number | null
  vitamin_d: number | null
  b12: number | null
  iron: number | null
  omega3: number | null
}

interface BiomarkerTrackerProps {
  userProfile?: any
}

export function BiomarkerTracker({ userProfile }: BiomarkerTrackerProps) {
  const [biomarkers, setBiomarkers] = useState<Biomarker[]>([])
  const [loading, setLoading] = useState(true)
  const [newBiomarker, setNewBiomarker] = useState({
    blood_glucose: '',
    cholesterol: '',
    inflammation_markers: '',
    vitamin_d: '',
    b12: '',
    iron: '',
    omega3: ''
  })
  const [showForm, setShowForm] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadBiomarkers()
    }
  }, [user])

  const loadBiomarkers = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('biomarkers')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(10)

      if (error) throw error
      setBiomarkers(data || [])
    } catch (error) {
      console.error('Error loading biomarkers:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveBiomarker = async () => {
    if (!user) return

    try {
      const biomarkerData = {
        user_id: user.id,
        date: new Date().toISOString().split('T')[0],
        blood_glucose: newBiomarker.blood_glucose ? parseFloat(newBiomarker.blood_glucose) : null,
        cholesterol: newBiomarker.cholesterol ? parseFloat(newBiomarker.cholesterol) : null,
        inflammation_markers: newBiomarker.inflammation_markers ? parseFloat(newBiomarker.inflammation_markers) : null,
        vitamin_d: newBiomarker.vitamin_d ? parseFloat(newBiomarker.vitamin_d) : null,
        b12: newBiomarker.b12 ? parseFloat(newBiomarker.b12) : null,
        iron: newBiomarker.iron ? parseFloat(newBiomarker.iron) : null,
        omega3: newBiomarker.omega3 ? parseFloat(newBiomarker.omega3) : null
      }

      const { error } = await supabase
        .from('biomarkers')
        .insert(biomarkerData)

      if (error) throw error

      setNewBiomarker({
        blood_glucose: '',
        cholesterol: '',
        inflammation_markers: '',
        vitamin_d: '',
        b12: '',
        iron: '',
        omega3: ''
      })
      setShowForm(false)
      loadBiomarkers()
    } catch (error) {
      console.error('Error saving biomarker:', error)
    }
  }

  const getBiomarkerStatus = (value: number | null, optimal: { min: number; max: number }) => {
    if (!value) return { status: 'unknown', color: 'gray', icon: Target }
    if (value >= optimal.min && value <= optimal.max) {
      return { status: 'optimal', color: 'green', icon: CheckCircle }
    } else if (value < optimal.min) {
      return { status: 'low', color: 'blue', icon: TrendingDown }
    } else {
      return { status: 'high', color: 'red', icon: TrendingUp }
    }
  }

  const biomarkerConfigs = {
    blood_glucose: { 
      name: 'Blood Glucose', 
      unit: 'mg/dL', 
      optimal: { min: 70, max: 100 },
      icon: Heart,
      description: 'Fasting blood sugar levels'
    },
    cholesterol: { 
      name: 'Total Cholesterol', 
      unit: 'mg/dL', 
      optimal: { min: 150, max: 200 },
      icon: Shield,
      description: 'Total cholesterol levels'
    },
    inflammation_markers: { 
      name: 'Inflammation (CRP)', 
      unit: 'mg/L', 
      optimal: { min: 0, max: 3 },
      icon: AlertTriangle,
      description: 'C-reactive protein levels'
    },
    vitamin_d: { 
      name: 'Vitamin D', 
      unit: 'ng/mL', 
      optimal: { min: 30, max: 100 },
      icon: Zap,
      description: '25-hydroxyvitamin D levels'
    },
    b12: { 
      name: 'Vitamin B12', 
      unit: 'pg/mL', 
      optimal: { min: 300, max: 900 },
      icon: Brain,
      description: 'B12 levels for cognitive function'
    },
    iron: { 
      name: 'Iron (Ferritin)', 
      unit: 'ng/mL', 
      optimal: { min: 15, max: 200 },
      icon: Activity,
      description: 'Iron storage levels'
    },
    omega3: { 
      name: 'Omega-3 Index', 
      unit: '%', 
      optimal: { min: 8, max: 12 },
      icon: Heart,
      description: 'Omega-3 fatty acid levels'
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Molecular Biomarker Tracking
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor your key health indicators with precision
          </p>
        </div>
        <motion.button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showForm ? 'Cancel' : 'Add Biomarkers'}
        </motion.button>
      </div>

      {/* Add Biomarker Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Add New Biomarker Data
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(biomarkerConfigs).map(([key, config]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {config.name} ({config.unit})
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newBiomarker[key as keyof typeof newBiomarker]}
                  onChange={(e) => setNewBiomarker(prev => ({ ...prev, [key]: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder={`Optimal: ${config.optimal.min}-${config.optimal.max}`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveBiomarker}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Save Biomarkers
            </button>
          </div>
        </motion.div>
      )}

      {/* Biomarker Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(biomarkerConfigs).map(([key, config]) => {
          const latestValue = biomarkers[0]?.[key as keyof Biomarker]
          const status = getBiomarkerStatus(latestValue as number, config.optimal)
          const Icon = config.icon

          return (
            <motion.div
              key={key}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    status.color === 'green' ? 'bg-green-100 dark:bg-green-900/20' :
                    status.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20' :
                    status.color === 'red' ? 'bg-red-100 dark:bg-red-900/20' :
                    'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <Icon className={`h-6 w-6 ${
                      status.color === 'green' ? 'text-green-600' :
                      status.color === 'blue' ? 'text-blue-600' :
                      status.color === 'red' ? 'text-red-600' :
                      'text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{config.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{config.unit}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  status.color === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300' :
                  status.color === 'blue' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' :
                  status.color === 'red' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300' :
                  'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Current Value</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {latestValue ? `${latestValue} ${config.unit}` : 'Not recorded'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Optimal Range</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {config.optimal.min}-{config.optimal.max} {config.unit}
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {config.description}
                </div>
              </div>

              {/* Progress Bar */}
              {latestValue && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>{config.optimal.min}</span>
                    <span>{config.optimal.max}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        status.color === 'green' ? 'bg-green-500' :
                        status.color === 'blue' ? 'bg-blue-500' :
                        status.color === 'red' ? 'bg-red-500' :
                        'bg-gray-400'
                      }`}
                      style={{
                        width: `${Math.min(100, Math.max(0, ((latestValue - config.optimal.min) / (config.optimal.max - config.optimal.min)) * 100))}%`
                      }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Recent Data */}
      {biomarkers.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Biomarker History
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 text-gray-600 dark:text-gray-400">Date</th>
                  {Object.entries(biomarkerConfigs).map(([key, config]) => (
                    <th key={key} className="text-center py-2 text-gray-600 dark:text-gray-400">
                      {config.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {biomarkers.slice(0, 5).map((biomarker) => (
                  <tr key={biomarker.id} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-3 text-gray-900 dark:text-white">
                      {new Date(biomarker.date).toLocaleDateString()}
                    </td>
                    {Object.keys(biomarkerConfigs).map((key) => {
                      const value = biomarker[key as keyof Biomarker]
                      return (
                        <td key={key} className="py-3 text-center text-gray-900 dark:text-white">
                          {value ? value : '-'}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
