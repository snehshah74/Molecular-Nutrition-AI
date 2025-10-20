import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Activity, 
  Zap, 
  Clock, 
  Database, 
  TrendingUp,
  RefreshCw,
  Trash2
} from 'lucide-react'
import { PerformanceService } from '@/services/api'
import { cn } from '@/lib/utils'

export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(PerformanceService.getMetrics())
    }

    updateMetrics()
    const interval = setInterval(updateMetrics, 2000) // Update every 2 seconds

    return () => clearInterval(interval)
  }, [])

  if (!isVisible) {
    return (
      <motion.button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 p-3 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Show Performance Dashboard"
      >
        <Activity className="h-5 w-5" />
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed bottom-4 right-4 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary-600" />
            Performance Metrics
          </h3>
          <div className="flex gap-2">
            <motion.button
              onClick={() => setMetrics(PerformanceService.getMetrics())}
              className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Refresh Metrics"
            >
              <RefreshCw className="h-4 w-4" />
            </motion.button>
            <motion.button
              onClick={() => {
                PerformanceService.clearCache()
                setMetrics(PerformanceService.getMetrics())
              }}
              className="p-1 text-gray-500 hover:text-red-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Clear Cache"
            >
              <Trash2 className="h-4 w-4" />
            </motion.button>
            <motion.button
              onClick={() => setIsVisible(false)}
              className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Close"
            >
              ×
            </motion.button>
          </div>
        </div>

        {metrics && (
          <div className="space-y-3">
            {/* Cache Performance */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  <Database className="h-4 w-4" />
                  Cache Performance
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {PerformanceService.getCacheSize()} items
                </span>
              </div>
              <div className="text-2xl font-bold text-primary-600">
                {metrics.cacheHitRate}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Cache hit rate
              </div>
            </div>

            {/* Request Statistics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Total Requests
                  </span>
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {metrics.totalRequests}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Avg Response
                  </span>
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {metrics.averageResponseTime.toFixed(0)}ms
                </div>
              </div>
            </div>

            {/* Last Request Time */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Request Time
                </span>
                <span className={cn(
                  "text-sm font-semibold",
                  metrics.lastRequestTime < 1000 ? "text-green-600" : 
                  metrics.lastRequestTime < 3000 ? "text-yellow-600" : "text-red-600"
                )}>
                  {metrics.lastRequestTime}ms
                </span>
              </div>
            </div>

            {/* Performance Status */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Performance Status
                </span>
                <span className={cn(
                  "text-sm font-semibold px-2 py-1 rounded-full",
                  metrics.averageResponseTime < 2000 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                  metrics.averageResponseTime < 5000 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" :
                  "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                )}>
                  {metrics.averageResponseTime < 2000 ? "Excellent" :
                   metrics.averageResponseTime < 5000 ? "Good" : "Needs Optimization"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
