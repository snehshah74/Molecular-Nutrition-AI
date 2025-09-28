import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { useAppState } from '@/hooks/useAppState'
import type { UserProfile } from '@/types'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Footer } from '@/components/layout/Footer'
import { UserProfileSetup } from '@/components/profiles/UserProfileSetup'
import { FoodLogger } from '@/components/logging/FoodLogger'
import { ModernNutrientDashboard } from '@/components/dashboard/ModernNutrientDashboard'
import { AIRecommendations } from '@/components/ai/AIRecommendations'
import { ProgressInsights } from '@/components/progress/ProgressInsights'
import { MealPlanGenerator } from '@/components/mealPlanning/MealPlanGenerator'
import { NutritionQuiz } from '@/components/education/NutritionQuiz'
import { SupplementRecommendations } from '@/components/supplements/SupplementRecommendations'
import { HealthTrendAnalysis } from '@/components/analytics/HealthTrendAnalysis'
import { CommunityFeatures } from '@/components/community/CommunityFeatures'
import { DebugPanel } from '@/components/debug/DebugPanel'
import { PerformanceDashboard } from '@/components/debug/PerformanceDashboard'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { AlertCircle, X } from 'lucide-react'
import type { UserProfileFormData } from '@/types'
import { generateId } from '@/lib/utils'

type Page = 'dashboard' | 'food-log' | 'nutrients' | 'ai-insights' | 'progress' | 'profile' | 'settings' | 'meal-planning' | 'education' | 'supplements' | 'analytics' | 'community'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const {
    userProfile,
    dailyIntake,
    recommendations,
    progressData,
    isLoading,
    error,
    saveUserProfile,
    addMeal,
    updateMeal,
    deleteMeal,
    updateRecommendations,
    clearError,
    setUserProfile,
    setDailyIntake,
    setRecommendations,
    setProgressData
  } = useAppState()

  const handleProfileComplete = useCallback((profileData: UserProfileFormData) => {
    console.log('=== PROFILE COMPLETION TRIGGERED ===')
    console.log('Profile data received:', profileData)
    
    try {
      const profile: any = {
        id: generateId(),
        ...profileData,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      console.log('Profile object created:', profile)
      console.log('Calling saveUserProfile...')
      saveUserProfile(profile)
      console.log('Profile saved successfully!')
      
      // Force a small delay to ensure state updates
      setTimeout(() => {
        console.log('Current userProfile state:', userProfile)
      }, 100)
    } catch (error) {
      console.error('Error in handleProfileComplete:', error)
    }
  }, [saveUserProfile, userProfile])

  const handleLogout = useCallback(() => {
    // Clear all data
    localStorage.clear()
    // Reset state
    setUserProfile(null)
    setDailyIntake(null)
    setRecommendations([])
    setProgressData([])
    // Redirect to profile setup
    setCurrentPage('profile')
  }, [setUserProfile, setDailyIntake, setRecommendations, setProgressData])

  const handleUpdateProfile = useCallback((updatedProfile: UserProfile) => {
    try {
      saveUserProfile(updatedProfile)
      console.log('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }, [saveUserProfile])

  const renderPage = useMemo(() => {
    if (!userProfile) {
      return <UserProfileSetup onComplete={handleProfileComplete} />
    }

    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <ModernNutrientDashboard 
              dailyIntake={dailyIntake} 
              userProfile={userProfile}
              onNavigate={(page) => setCurrentPage(page as Page)}
            />
            <ErrorBoundary>
              <AIRecommendations
                userProfile={userProfile}
                dailyIntake={dailyIntake}
                recommendations={recommendations}
                onRecommendationsUpdate={updateRecommendations}
              />
            </ErrorBoundary>
          </div>
        )
      case 'food-log':
        return (
          <FoodLogger
            onMealAdded={addMeal}
            meals={dailyIntake?.meals || []}
            onMealUpdate={updateMeal}
            onMealDelete={deleteMeal}
          />
        )
      case 'nutrients':
        return (
          <ModernNutrientDashboard 
            dailyIntake={dailyIntake} 
            userProfile={userProfile}
            onNavigate={(page) => setCurrentPage(page as Page)}
          />
        )
      case 'ai-insights':
        return (
          <ErrorBoundary>
            <AIRecommendations
              userProfile={userProfile}
              dailyIntake={dailyIntake}
              recommendations={recommendations}
              onRecommendationsUpdate={updateRecommendations}
            />
          </ErrorBoundary>
        )
      case 'progress':
        return <ProgressInsights progressData={progressData} dailyIntake={dailyIntake} />
      case 'profile':
        return <UserProfileSetup onComplete={handleProfileComplete} initialData={userProfile} />
      case 'settings':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Settings
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Settings panel coming soon...
            </p>
          </div>
        )
      case 'meal-planning':
        return (
          <ErrorBoundary>
            <MealPlanGenerator
              userProfile={userProfile}
              dailyIntake={dailyIntake}
              onMealPlanGenerated={(mealPlan) => {
                console.log('Meal plan generated:', mealPlan)
                // Handle meal plan saving
              }}
            />
          </ErrorBoundary>
        )
      case 'education':
        return (
          <ErrorBoundary>
            <NutritionQuiz
              userProfile={userProfile}
              onQuizComplete={(result) => {
                console.log('Quiz completed:', result)
                // Handle quiz results
              }}
            />
          </ErrorBoundary>
        )
          case 'supplements':
            return (
              <ErrorBoundary>
                <SupplementRecommendations
                  userProfile={userProfile}
                  dailyIntake={dailyIntake}
                  onSupplementsSelected={(supplements) => {
                    console.log('Supplements selected:', supplements)
                    // Handle supplement selection
                  }}
                />
              </ErrorBoundary>
            )
          case 'analytics':
            return (
              <ErrorBoundary>
                <HealthTrendAnalysis
                  userProfile={userProfile}
                  dailyIntake={dailyIntake}
                />
              </ErrorBoundary>
            )
          case 'community':
            return (
              <ErrorBoundary>
                <CommunityFeatures
                  userProfile={userProfile}
                  onJoinCommunity={(communityId) => {
                    console.log('Joined community:', communityId)
                    // Handle community join
                  }}
                  onLeaveCommunity={(communityId) => {
                    console.log('Left community:', communityId)
                    // Handle community leave
                  }}
                />
              </ErrorBoundary>
            )
          default:
            return null
    }
  }, [userProfile, currentPage, dailyIntake, recommendations, handleProfileComplete, addMeal, updateMeal, deleteMeal, updateRecommendations, progressData])

  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 molecular-bg">
        {/* Error Toast */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              className="fixed top-4 right-4 z-50 max-w-sm"
            >
              <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 shadow-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                      Error
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      {error}
                    </p>
                  </div>
                  <button
                    onClick={clearError}
                    className="text-red-400 hover:text-red-600 dark:hover:text-red-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl"
              >
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                  <span className="text-gray-900 dark:text-gray-100">Loading...</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <Header 
          onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} 
          isMenuOpen={isMenuOpen}
          userProfile={userProfile}
          onNavigate={(page) => setCurrentPage(page as Page)}
          currentPage={currentPage}
          onLogout={handleLogout}
          onUpdateProfile={handleUpdateProfile}
          dailyIntake={dailyIntake}
        />

        <div className="flex">
          {/* Sidebar */}
          <Sidebar
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page as Page)}
          />

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ 
                duration: 0.4,
                ease: [0.4, 0.0, 0.2, 1],
                scale: { duration: 0.3 }
              }}
            >
              {renderPage}
            </motion.div>
          </div>
        </main>
        </div>

        {/* Footer */}
        <Footer />
        </div>

        {/* Debug Panel */}
        <DebugPanel 
          userProfile={userProfile}
          dailyIntake={dailyIntake}
          recommendations={recommendations}
        />

        {/* Performance Dashboard */}
        <PerformanceDashboard />
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
