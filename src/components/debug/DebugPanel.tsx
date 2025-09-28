import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bug, X, Trash2, User, Database } from 'lucide-react'

interface DebugPanelProps {
  userProfile: any
  dailyIntake: any
  recommendations: any[]
}

export function DebugPanel({ userProfile, dailyIntake, recommendations }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  const clearAllData = () => {
    localStorage.clear()
    window.location.reload()
  }

  const clearProfile = () => {
    localStorage.removeItem('molecular-nutrition-user')
    window.location.reload()
  }

  const clearDailyIntake = () => {
    if (window.confirm('Clear daily intake data? This will force recreation of sample nutrition data.')) {
      localStorage.removeItem('molecular-nutrition-daily-intake')
      window.location.reload()
    }
  }

  return (
    <>
      {/* Debug Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Debug Panel"
      >
        <Bug className="h-5 w-5" />
      </motion.button>

      {/* Debug Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-4 right-4 z-50 w-80 max-h-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                  <Bug className="h-5 w-5 mr-2 text-red-500" />
                  Debug Panel
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
              {/* User Profile Status */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  User Profile
                </h4>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {userProfile ? (
                    <div className="space-y-1">
                      <p>✅ Profile loaded</p>
                      <p>ID: {userProfile.id}</p>
                      <p>Age: {userProfile.age}</p>
                      <p>Sex: {userProfile.sex}</p>
                      <p>Lifestyle: {userProfile.lifestyle}</p>
                      <p>Goals: {userProfile.healthGoals?.length || 0}</p>
                    </div>
                  ) : (
                    <p>❌ No profile found</p>
                  )}
                </div>
              </div>

              {/* Daily Intake Status */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 flex items-center">
                  <Database className="h-4 w-4 mr-2" />
                  Daily Intake
                </h4>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {dailyIntake ? (
                    <div className="space-y-1">
                      <p>✅ Intake data loaded</p>
                      <p>Date: {dailyIntake.date}</p>
                      <p>Meals: {dailyIntake.meals?.length || 0}</p>
                      <p>Balance Score: {dailyIntake.molecularBalanceScore}</p>
                    </div>
                  ) : (
                    <p>❌ No intake data</p>
                  )}
                </div>
              </div>

              {/* Recommendations Status */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  AI Recommendations
                </h4>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>Count: {recommendations.length}</p>
                  <p>Unread: {recommendations.filter(r => !r.isRead).length}</p>
                </div>
              </div>

              {/* Local Storage Info */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  Local Storage
                </h4>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>Keys: {Object.keys(localStorage).length}</p>
                  <p>Size: {JSON.stringify(localStorage).length} chars</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={clearProfile}
                  className="w-full btn-secondary text-sm flex items-center justify-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Profile
                </button>
                <button
                  onClick={clearDailyIntake}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-2 px-3 rounded flex items-center justify-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Daily Intake
                </button>
                <button
                  onClick={clearAllData}
                  className="w-full bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-3 rounded flex items-center justify-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Data
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
