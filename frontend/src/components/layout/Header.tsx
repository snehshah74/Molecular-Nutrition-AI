import { motion } from 'framer-motion'
import { Sun, Moon, Dna, Menu, X } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { ProfileDropdown } from '@/components/profile/ProfileDropdown'
import { SmartNotifications } from '@/components/notifications/SmartNotifications'

interface HeaderProps {
  onMenuToggle: () => void
  isMenuOpen: boolean
  userProfile?: any
  onNavigate?: (page: string) => void
  currentPage?: string
  onLogout?: () => void
  onUpdateProfile?: (updatedProfile: any) => void
  dailyIntake?: any
}

export function Header({ onMenuToggle, isMenuOpen, userProfile, onNavigate, currentPage, onLogout, onUpdateProfile, dailyIntake }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Title */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="relative">
              <Dna className="h-8 w-8 text-primary-600 dark:text-primary-400 animate-molecular-float" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-secondary-500 rounded-full animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold gradient-text">
                Molecular Nutrition AI
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {userProfile ? `Welcome, ${userProfile.name || (userProfile.sex === 'male' ? 'Mr.' : userProfile.sex === 'female' ? 'Ms.' : '')} ${userProfile.age ? `(${userProfile.age}y)` : ''}` : 'Personalized nutrition at the molecular level'}
              </p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <motion.button
              onClick={() => onNavigate?.('dashboard')}
              className={cn(
                "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200",
                currentPage === 'dashboard' && "text-primary-600 dark:text-primary-400 font-semibold"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Dashboard
            </motion.button>
            <motion.button
              onClick={() => onNavigate?.('food-log')}
              className={cn(
                "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200",
                currentPage === 'food-log' && "text-primary-600 dark:text-primary-400 font-semibold"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Food Log
            </motion.button>
            <motion.button
              onClick={() => onNavigate?.('ai-insights')}
              className={cn(
                "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200",
                currentPage === 'ai-insights' && "text-primary-600 dark:text-primary-400 font-semibold"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              AI Insights
            </motion.button>
            <motion.button
              onClick={() => onNavigate?.('progress')}
              className={cn(
                "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200",
                currentPage === 'progress' && "text-primary-600 dark:text-primary-400 font-semibold"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Progress
            </motion.button>
            <motion.button
              onClick={() => onNavigate?.('molecular')}
              className={cn(
                "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200",
                currentPage === 'molecular' && "text-primary-600 dark:text-primary-400 font-semibold"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Molecular
            </motion.button>
            <motion.button
              onClick={() => onNavigate?.('biomarkers')}
              className={cn(
                "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200",
                currentPage === 'biomarkers' && "text-primary-600 dark:text-primary-400 font-semibold"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Biomarkers
            </motion.button>
            <motion.button
              onClick={() => onNavigate?.('meal-planning')}
              className={cn(
                "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200",
                currentPage === 'meal-planning' && "text-primary-600 dark:text-primary-400 font-semibold"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Meal Plans
            </motion.button>
            <motion.button
              onClick={() => onNavigate?.('supplements')}
              className={cn(
                "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200",
                currentPage === 'supplements' && "text-primary-600 dark:text-primary-400 font-semibold"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Supplements
            </motion.button>
            <motion.button
              onClick={() => onNavigate?.('education')}
              className={cn(
                "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200",
                currentPage === 'education' && "text-primary-600 dark:text-primary-400 font-semibold"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn
            </motion.button>
            <motion.button
              onClick={() => onNavigate?.('analytics')}
              className={cn(
                "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200",
                currentPage === 'analytics' && "text-primary-600 dark:text-primary-400 font-semibold"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Analytics
            </motion.button>
            <motion.button
              onClick={() => onNavigate?.('community')}
              className={cn(
                "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200",
                currentPage === 'community' && "text-primary-600 dark:text-primary-400 font-semibold"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Community
            </motion.button>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Smart Notifications */}
            {userProfile && (
              <SmartNotifications
                userProfile={userProfile}
                dailyIntake={dailyIntake}
              />
            )}

            {/* Profile Dropdown */}
            {userProfile && (
              <ProfileDropdown
                userProfile={userProfile}
                onLogout={onLogout || (() => {})}
                onUpdateProfile={onUpdateProfile || (() => {})}
              />
            )}

            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                "hover:bg-gray-100 dark:hover:bg-gray-700",
                "focus:outline-none focus:ring-2 focus:ring-primary-500"
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              )}
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={onMenuToggle}
              className={cn(
                "md:hidden p-2 rounded-lg transition-all duration-200",
                "hover:bg-gray-100 dark:hover:bg-gray-700",
                "focus:outline-none focus:ring-2 focus:ring-primary-500"
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
