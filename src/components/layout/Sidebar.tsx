import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  Utensils, 
  BarChart3, 
  Brain, 
  TrendingUp, 
  User, 
  Settings,
  Calendar,
  Pill,
  BookOpen,
  X,
  LineChart,
  Users
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  currentPage: string
  onPageChange: (page: string) => void
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'food-log', label: 'Food Log', icon: Utensils },
  { id: 'nutrients', label: 'Nutrients', icon: BarChart3 },
  { id: 'ai-insights', label: 'AI Insights', icon: Brain },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
  { id: 'meal-planning', label: 'Meal Plans', icon: Calendar },
  { id: 'supplements', label: 'Supplements', icon: Pill },
  { id: 'education', label: 'Learn', icon: BookOpen },
  { id: 'analytics', label: 'Analytics', icon: LineChart },
  { id: 'community', label: 'Community', icon: Users },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function Sidebar({ isOpen, onClose, currentPage, onPageChange }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "fixed left-0 top-0 z-50 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700",
              "md:relative md:translate-x-0 md:border-r"
            )}
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Navigation
                </h2>
                <button
                  onClick={onClose}
                  className="md:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 p-4 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const isActive = currentPage === item.id
                  
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => {
                        onPageChange(item.id)
                        onClose()
                      }}
                      className={cn(
                        "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200",
                        isActive
                          ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className={cn(
                        "h-5 w-5",
                        isActive 
                          ? "text-primary-600 dark:text-primary-400" 
                          : "text-gray-500 dark:text-gray-400"
                      )} />
                      <span className="font-medium">{item.label}</span>
                    </motion.button>
                  )
                })}
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  <p>Molecular Nutrition AI</p>
                  <p>v1.0.0</p>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
