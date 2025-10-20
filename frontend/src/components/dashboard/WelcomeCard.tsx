import { motion } from 'framer-motion'
import { 
  Sparkles, 
  TrendingUp, 
  Target, 
  Calendar,
  Clock,
  Star,
  ArrowRight,
  Zap
} from 'lucide-react'

interface WelcomeCardProps {
  userProfile: any
  molecularBalanceScore: number
  lastLogin?: string
  onNavigate?: (page: string) => void
}

export function WelcomeCard({ userProfile, molecularBalanceScore, lastLogin, onNavigate }: WelcomeCardProps) {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const getMotivationalMessage = (score: number) => {
    if (score >= 90) return "Outstanding! You're optimizing your molecular nutrition perfectly!"
    if (score >= 80) return "Excellent work! Your nutrition is on track for optimal health."
    if (score >= 70) return "Good progress! A few tweaks could boost your molecular balance."
    if (score >= 60) return "You're on the right path! Let's optimize your nutrition further."
    return "Let's work together to improve your molecular nutrition balance!"
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-orange-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-100 dark:bg-green-900/20'
    if (score >= 80) return 'bg-blue-100 dark:bg-blue-900/20'
    if (score >= 70) return 'bg-yellow-100 dark:bg-yellow-900/20'
    return 'bg-orange-100 dark:bg-orange-900/20'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-2xl p-8 text-white"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 w-20 h-20 border border-white/20 rounded-full"></div>
        <div className="absolute top-12 right-8 w-16 h-16 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-8 left-12 w-12 h-12 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-4 right-4 w-24 h-24 border border-white/20 rounded-full"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <motion.h1 
              className="text-3xl font-bold mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {getGreeting()}, {userProfile?.sex === 'male' ? 'Mr.' : userProfile?.sex === 'female' ? 'Ms.' : ''}!
            </motion.h1>
            <motion.p 
              className="text-primary-100 text-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              Welcome back to your molecular nutrition journey
            </motion.p>
          </div>
          
          <motion.div 
            className={`${getScoreBg(molecularBalanceScore)} rounded-xl p-4 text-center`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          >
            <div className={`text-2xl font-bold ${getScoreColor(molecularBalanceScore)}`}>
              {molecularBalanceScore}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Balance Score
            </div>
          </motion.div>
        </div>

        <motion.p 
          className="text-primary-100 mb-6 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {getMotivationalMessage(molecularBalanceScore)}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div 
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="h-5 w-5 text-primary-200" />
              <span className="text-sm font-medium text-primary-200">Today's Focus</span>
            </div>
            <p className="text-sm text-white">
              {userProfile?.healthGoals?.[0]?.replace('_', ' ') || 'Overall Health'}
            </p>
          </motion.div>

          <motion.div 
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-5 w-5 text-primary-200" />
              <span className="text-sm font-medium text-primary-200">Last Activity</span>
            </div>
            <p className="text-sm text-white">
              {lastLogin ? new Date(lastLogin).toLocaleDateString() : 'Today'}
            </p>
          </motion.div>

          <motion.div 
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Star className="h-5 w-5 text-primary-200" />
              <span className="text-sm font-medium text-primary-200">Streak</span>
            </div>
            <p className="text-sm text-white">7 days</p>
          </motion.div>
        </div>

        <motion.div 
          className="flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <motion.button
            onClick={() => onNavigate?.('food-log')}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Zap className="h-4 w-4" />
            Quick Log Meal
          </motion.button>
          
          <motion.button
            onClick={() => onNavigate?.('ai-insights')}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Target className="h-4 w-4" />
            View Insights
            <ArrowRight className="h-3 w-3" />
          </motion.button>
          
          <motion.button
            onClick={() => onNavigate?.('progress')}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <TrendingUp className="h-4 w-4" />
            Progress Report
          </motion.button>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-8 right-8 opacity-20"
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Sparkles className="h-8 w-8 text-white" />
      </motion.div>
    </motion.div>
  )
}
