import { useState, useMemo, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, 
  BellRing, 
  X, 
  AlertTriangle, 
  Info, 
  Clock, 
  Target,
  Brain,
  Star,
  Settings,
  CheckCircle
} from 'lucide-react'
import type { UserProfile, DailyIntake } from '@/types'
import { cn } from '@/lib/utils'

interface SmartNotificationsProps {
  userProfile: UserProfile | null
  dailyIntake: DailyIntake | null
  notifications?: Notification[]
  onNotificationRead?: (id: string) => void
  onNotificationDismiss?: (id: string) => void
}

interface Notification {
  id: string
  type: 'reminder' | 'achievement' | 'insight' | 'warning' | 'tip' | 'milestone'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  title: string
  message: string
  action?: string
  timestamp: Date
  isRead: boolean
  isDismissed: boolean
  category: 'nutrition' | 'fitness' | 'wellness' | 'health' | 'system'
  data?: any
}

interface NotificationRule {
  id: string
  name: string
  description: string
  category: string
  enabled: boolean
  conditions: any[]
  actions: string[]
}

export const SmartNotifications = memo(function SmartNotifications({ 
  userProfile, 
  dailyIntake,
  notifications = [],
  onNotificationRead,
  onNotificationDismiss
}: SmartNotificationsProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'read'>('unread')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [_notificationRules] = useState<NotificationRule[]>([])

  // Generate smart notifications based on user data
  const smartNotifications = useMemo(() => {
    const generated: Notification[] = []
    const now = new Date()

    if (!userProfile || !dailyIntake) return generated

    // Water intake reminder
    const waterIntake = dailyIntake.totalNutrients?.macronutrients?.find(m => m.name === 'Water')?.amount || 0
    if (waterIntake < 2000) {
      generated.push({
        id: 'water-reminder-1',
        type: 'reminder',
        priority: 'medium',
        title: 'Hydration Reminder',
        message: 'You\'ve had less than 2L of water today. Stay hydrated for optimal molecular function!',
        action: 'Log Water Intake',
        timestamp: new Date(now.getTime() - 30 * 60000), // 30 minutes ago
        isRead: false,
        isDismissed: false,
        category: 'wellness',
        data: { targetAmount: 2500, currentAmount: waterIntake }
      })
    }

    // Meal logging reminder
    const mealCount = dailyIntake.meals?.length || 0
    const currentHour = now.getHours()
    if (mealCount < 2 && currentHour >= 14) {
      generated.push({
        id: 'meal-reminder-1',
        type: 'reminder',
        priority: 'medium',
        title: 'Meal Logging Reminder',
        message: 'You\'ve only logged ' + mealCount + ' meal(s) today. Don\'t forget to track your nutrition!',
        action: 'Log Meal',
        timestamp: new Date(now.getTime() - 15 * 60000), // 15 minutes ago
        isRead: false,
        isDismissed: false,
        category: 'nutrition'
      })
    }

    // Protein intake insight
    const proteinIntake = dailyIntake.totalNutrients?.macronutrients?.find(m => m.name === 'Protein')?.amount || 0
    const proteinTarget = userProfile.sex === 'male' ? 150 : 120
    if (proteinIntake < proteinTarget * 0.8) {
      generated.push({
        id: 'protein-insight-1',
        type: 'insight',
        priority: 'medium',
        title: 'Protein Intake Insight',
        message: `Your protein intake (${proteinIntake}g) is below optimal levels. Consider adding protein-rich foods.`,
        action: 'View Recommendations',
        timestamp: new Date(now.getTime() - 45 * 60000), // 45 minutes ago
        isRead: false,
        isDismissed: false,
        category: 'nutrition',
        data: { current: proteinIntake, target: proteinTarget }
      })
    }

    // Sleep optimization tip
    const currentHour2 = now.getHours()
    if (currentHour2 >= 21 && currentHour2 <= 23) {
      generated.push({
        id: 'sleep-tip-1',
        type: 'tip',
        priority: 'low',
        title: 'Sleep Optimization Tip',
        message: 'Optimal sleep timing for molecular repair is 10 PM - 6 AM. Consider winding down soon.',
        action: 'View Sleep Tips',
        timestamp: new Date(now.getTime() - 10 * 60000), // 10 minutes ago
        isRead: false,
        isDismissed: false,
        category: 'wellness'
      })
    }

    // Achievement notification
    const molecularScore = dailyIntake.molecularBalanceScore || 0
    if (molecularScore >= 90) {
      generated.push({
        id: 'achievement-1',
        type: 'achievement',
        priority: 'high',
        title: 'Molecular Excellence!',
        message: `Amazing! Your molecular balance score is ${molecularScore}. You're optimizing your cellular health!`,
        action: 'Share Achievement',
        timestamp: new Date(now.getTime() - 5 * 60000), // 5 minutes ago
        isRead: false,
        isDismissed: false,
        category: 'health',
        data: { score: molecularScore }
      })
    }

    // Nutrient deficiency warning
    const micronutrients = dailyIntake.totalNutrients?.micronutrients || []
    const deficiencies = micronutrients.filter(m => {
      const percentage = (m.amount / (m.amount || 1)) * 100
      return percentage < 60
    })

    if (deficiencies.length > 0) {
      generated.push({
        id: 'deficiency-warning-1',
        type: 'warning',
        priority: 'high',
        title: 'Nutrient Deficiency Alert',
        message: `Low levels detected: ${deficiencies.slice(0, 3).map(d => d.name).join(', ')}. Consider supplementation.`,
        action: 'View Supplements',
        timestamp: new Date(now.getTime() - 20 * 60000), // 20 minutes ago
        isRead: false,
        isDismissed: false,
        category: 'health',
        data: { deficiencies: deficiencies.map(d => d.name) }
      })
    }

    // Weekly progress milestone
    const dayOfWeek = now.getDay()
    if (dayOfWeek === 0 && currentHour >= 10) { // Sunday morning
      generated.push({
        id: 'weekly-milestone-1',
        type: 'milestone',
        priority: 'medium',
        title: 'Weekly Progress Review',
        message: 'Great week! Review your molecular nutrition progress and plan for the week ahead.',
        action: 'View Weekly Report',
        timestamp: new Date(now.getTime() - 60 * 60000), // 1 hour ago
        isRead: false,
        isDismissed: false,
        category: 'health'
      })
    }

    // Exercise reminder
    const steps = 8500 // Mock data - would come from fitness tracker
    if (steps < 8000 && currentHour >= 18) {
      generated.push({
        id: 'exercise-reminder-1',
        type: 'reminder',
        priority: 'low',
        title: 'Activity Reminder',
        message: `You've taken ${steps.toLocaleString()} steps today. A short walk could help reach your daily goal!`,
        action: 'Log Exercise',
        timestamp: new Date(now.getTime() - 25 * 60000), // 25 minutes ago
        isRead: false,
        isDismissed: false,
        category: 'fitness',
        data: { currentSteps: steps, targetSteps: 10000 }
      })
    }

    return generated.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }, [userProfile, dailyIntake])

  // Combine generated notifications with passed notifications
  const allNotifications = useMemo(() => {
    return [...notifications, ...smartNotifications].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }, [notifications, smartNotifications])

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return allNotifications.filter(notification => {
      const typeMatch = filterType === 'all' || 
                       (filterType === 'unread' && !notification.isRead) ||
                       (filterType === 'read' && notification.isRead)
      const categoryMatch = filterCategory === 'all' || notification.category === filterCategory
      return typeMatch && categoryMatch && !notification.isDismissed
    })
  }, [allNotifications, filterType, filterCategory])

  // Count unread notifications
  const unreadCount = useMemo(() => {
    return allNotifications.filter(n => !n.isRead && !n.isDismissed).length
  }, [allNotifications])

  // Get notification icon
  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = priority === 'urgent' ? 'text-red-600' : 
                     priority === 'high' ? 'text-orange-600' :
                     priority === 'medium' ? 'text-blue-600' : 'text-gray-600'

    switch (type) {
      case 'reminder': return <Clock className={`h-5 w-5 ${iconClass}`} />
      case 'achievement': return <Star className={`h-5 w-5 ${iconClass}`} />
      case 'insight': return <Brain className={`h-5 w-5 ${iconClass}`} />
      case 'warning': return <AlertTriangle className={`h-5 w-5 ${iconClass}`} />
      case 'tip': return <Info className={`h-5 w-5 ${iconClass}`} />
      case 'milestone': return <Target className={`h-5 w-5 ${iconClass}`} />
      default: return <Bell className={`h-5 w-5 ${iconClass}`} />
    }
  }

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-500 bg-red-50 dark:bg-red-900/20'
      case 'high': return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
      case 'medium': return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
      case 'low': return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20'
      default: return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20'
    }
  }

  // Handle notification actions
  const handleNotificationAction = (notification: Notification) => {
    if (onNotificationRead) {
      onNotificationRead(notification.id)
    }
    
    // Handle different action types
    switch (notification.action) {
      case 'Log Water Intake':
        // Navigate to water logging
        break
      case 'Log Meal':
        // Navigate to meal logging
        break
      case 'View Recommendations':
        // Navigate to recommendations
        break
      case 'View Supplements':
        // Navigate to supplements
        break
      case 'Share Achievement':
        // Share achievement
        break
      default:
        break
    }
  }

  const handleDismiss = (notificationId: string) => {
    if (onNotificationDismiss) {
      onNotificationDismiss(notificationId)
    }
  }

  const handleMarkAllRead = () => {
    allNotifications.forEach(notification => {
      if (!notification.isRead && !notification.isDismissed && onNotificationRead) {
        onNotificationRead(notification.id)
      }
    })
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <motion.button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {unreadCount > 0 ? (
          <BellRing className="h-6 w-6 text-primary-600" />
        ) : (
          <Bell className="h-6 w-6 text-gray-600 dark:text-gray-400" />
        )}
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </motion.button>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute right-0 top-12 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Smart Notifications
                </h3>
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </motion.button>
                  <motion.button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </motion.button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-2 mb-3">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="unread">Unread</option>
                  <option value="all">All</option>
                  <option value="read">Read</option>
                </select>
                
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">All Categories</option>
                  <option value="nutrition">Nutrition</option>
                  <option value="fitness">Fitness</option>
                  <option value="wellness">Wellness</option>
                  <option value="health">Health</option>
                </select>
              </div>

              {/* Actions */}
              {unreadCount > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={handleMarkAllRead}
                    className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-1"
                  >
                    <CheckCircle className="h-3 w-3" />
                    Mark All Read
                  </button>
                </div>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-6 text-center">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {filterType === 'unread' ? 'No unread notifications' : 'No notifications'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors",
                        !notification.isRead && "bg-blue-50 dark:bg-blue-900/10",
                        getPriorityColor(notification.priority)
                      )}
                      onClick={() => handleNotificationAction(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getNotificationIcon(notification.type, notification.priority)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={cn(
                              "text-sm font-medium",
                              !notification.isRead ? "text-gray-900 dark:text-gray-100" : "text-gray-700 dark:text-gray-300"
                            )}>
                              {notification.title}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDismiss(notification.id)
                              }}
                              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                              <X className="h-3 w-3 text-gray-400" />
                            </button>
                          </div>
                          <p className={cn(
                            "text-sm mt-1",
                            !notification.isRead ? "text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-400"
                          )}>
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {notification.timestamp.toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                            {notification.action && (
                              <span className="text-xs text-primary-600 font-medium">
                                {notification.action}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{filteredNotifications.length} notification(s)</span>
                <span>Smart notifications enabled</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})
