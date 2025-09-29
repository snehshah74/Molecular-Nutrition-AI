import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'

interface LandingPageProps {
  onNavigate?: (page: string) => void
  onAuthClick?: (mode: 'signin' | 'signup') => void
}
import { 
  Dna, 
  Brain, 
  Target, 
  TrendingUp, 
  Shield, 
  Zap, 
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  Play,
  Clock,
  Award,
  Lock,
  Sparkles,
  Beaker,
  Sun,
  Moon
} from 'lucide-react'

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onAuthClick }) => {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const { theme, toggleTheme } = useTheme()

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Molecular Analysis",
      description: "Revolutionary machine learning algorithms analyze your genetic profile, biomarkers, and lifestyle to deliver personalized nutrition recommendations with 95% accuracy.",
      color: "from-blue-500 to-purple-600",
      benefits: ["Genetic Analysis", "Biomarker Tracking", "Predictive Modeling"]
    },
    {
      icon: Dna,
      title: "Cellular-Level Nutrition",
      description: "Dive deep into cellular nutrition with real-time molecular balance scoring, micronutrient optimization, and metabolic pathway analysis for peak performance.",
      color: "from-green-500 to-teal-600",
      benefits: ["Molecular Balance", "Cellular Health", "Metabolic Optimization"]
    },
    {
      icon: Target,
      title: "Hyper-Personalized Plans",
      description: "Receive tailored nutrition strategies based on your unique genetic makeup, health goals, lifestyle preferences, and real-time biomarker data.",
      color: "from-orange-500 to-red-600",
      benefits: ["Custom Meal Plans", "Supplement Recommendations", "Lifestyle Integration"]
    },
    {
      icon: TrendingUp,
      title: "Advanced Progress Analytics",
      description: "Track your health transformation with comprehensive analytics, predictive insights, and detailed reports that show measurable improvements over time.",
      color: "from-purple-500 to-pink-600",
      benefits: ["Health Trends", "Predictive Insights", "Progress Reports"]
    },
    {
      icon: Shield,
      title: "Clinical-Grade Precision",
      description: "Built on evidence-based nutrition science with clinical validation, ensuring every recommendation is backed by peer-reviewed research and medical expertise.",
      color: "from-indigo-500 to-blue-600",
      benefits: ["Evidence-Based", "Clinical Validation", "Medical Expertise"]
    },
    {
      icon: Zap,
      title: "Real-Time Optimization",
      description: "Get instant feedback, smart notifications, and dynamic adjustments to your nutrition plan based on real-time data and changing health markers.",
      color: "from-yellow-500 to-orange-600",
      benefits: ["Instant Feedback", "Smart Notifications", "Dynamic Adjustments"]
    }
  ]

  const stats = [
    { number: "10,000+", label: "Active Users", icon: Users },
    { number: "95%", label: "Accuracy Rate", icon: Target },
    { number: "50+", label: "Nutrients Tracked", icon: Beaker },
    { number: "24/7", label: "AI Monitoring", icon: Clock }
  ]

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Nutritionist",
      content: "This platform revolutionized how I approach personalized nutrition. The molecular insights are incredible.",
      avatar: "SC",
      rating: 5
    },
    {
      name: "Mike Rodriguez",
      role: "Fitness Enthusiast",
      content: "Finally, a nutrition app that understands the science behind optimal health. Game changer!",
      avatar: "MR",
      rating: 5
    },
    {
      name: "Dr. Emily Watson",
      role: "Health Researcher",
      content: "The AI recommendations are spot-on. It's like having a personal nutritionist in your pocket.",
      avatar: "EW",
      rating: 5
    }
  ]

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      period: "forever",
      features: [
        "Basic nutrition tracking",
        "5 AI recommendations daily",
        "Progress insights",
        "Community access"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Pro",
      price: "$19",
      period: "month",
      features: [
        "Advanced molecular analysis",
        "Unlimited AI recommendations",
        "Detailed progress reports",
        "Meal planning",
        "Supplement recommendations",
        "Priority support"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Custom integrations",
        "Dedicated support",
        "Advanced analytics",
        "White-label options"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative">
                <Dna className="h-8 w-8 text-primary-600 dark:text-primary-400 animate-pulse" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-secondary-500 rounded-full animate-bounce" />
              </div>
              <span className="text-xl font-bold gradient-text">Molecular Nutrition AI</span>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors">Reviews</a>
              
              {/* Theme Toggle Button */}
              <motion.button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </motion.button>
              
              <motion.button 
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate?.('dashboard')}
              >
                Get Started
              </motion.button>
              <motion.button 
                className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg hover:border-primary-600 hover:text-primary-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onAuthClick?.('signin')}
              >
                Sign In
              </motion.button>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              {/* Mobile Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </motion.button>
              
              <motion.button 
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate?.('dashboard')}
              >
                Get Started
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 rounded-full text-primary-700 dark:text-primary-300 text-sm font-semibold mb-8 border border-primary-200 dark:border-primary-700/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                🚀 Now Available: AI-Powered Molecular Nutrition
              </motion.div>
              
              <motion.h1 
                className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Transform Your Health with
                <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"> Molecular</span>
                <br />
                <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">Nutrition AI</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                The world's first AI platform that analyzes your molecular profile to deliver 
                <span className="font-semibold text-primary-600 dark:text-primary-400"> precise nutrition recommendations</span> 
                that optimize your health, energy, and longevity.
              </motion.p>
              
              {/* Key Benefits */}
              <motion.div 
                className="flex flex-wrap gap-6 mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">95% Accuracy</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                  <Target className="h-5 w-5" />
                  <span className="font-medium">Personalized Plans</span>
                </div>
                <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
                  <Zap className="h-5 w-5" />
                  <span className="font-medium">Real-time Insights</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.button 
                  className="group bg-gradient-to-r from-primary-600 to-purple-600 text-white px-10 py-5 rounded-xl text-xl font-bold hover:from-primary-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center shadow-2xl hover:shadow-primary-500/25 relative overflow-hidden"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate?.('dashboard')}
                >
                  <span className="relative z-10 flex items-center">
                    Get Started Free
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
                
                <motion.button 
                  className="group border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-10 py-5 rounded-xl text-xl font-semibold hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Play className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                  Watch Demo
                </motion.button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div 
                className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
                  Trusted by health professionals worldwide
                </p>
                <div className="flex justify-center items-center space-x-8 opacity-60">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">HIPAA Compliant</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">FDA Approved</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Lock className="h-5 w-5 text-purple-500" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Secure & Private</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative z-10">
                <motion.div 
                  className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700 relative overflow-hidden"
                  style={{ y }}
                  animate={{ 
                    y: [0, -15, 0],
                    rotate: [0, 0.5, 0]
                  }}
                  transition={{ 
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {/* Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-transparent to-purple-50/50 dark:from-primary-900/10 dark:to-purple-900/10" />
                  
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <Dna className="h-8 w-8 text-white animate-pulse" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Molecular Balance</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Real-time Analysis</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">94/100</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">+18% this week</div>
                      </div>
                    </div>

                    {/* Progress Ring */}
                    <div className="relative w-32 h-32 mx-auto mb-6">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-gray-200 dark:text-gray-700"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="transparent"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-green-500"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          fill="transparent"
                          strokeDasharray="94, 100"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">94%</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Optimal</div>
                  </div>
                      </div>
                    </div>
                    
                    {/* Metrics */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700/30">
                      <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-white" />
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white">Protein Synthesis</span>
                        </div>
                        <span className="text-sm font-bold text-green-600 dark:text-green-400">Optimal</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-700/30">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <Brain className="h-5 w-5 text-white" />
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white">Cognitive Function</span>
                        </div>
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">Enhanced</span>
                    </div>
                    
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-700/30">
                      <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                            <Zap className="h-5 w-5 text-white" />
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white">Energy Levels</span>
                        </div>
                        <span className="text-sm font-bold text-purple-600 dark:text-purple-400">Peak</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Floating Elements */}
              <motion.div 
                className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-r from-primary-400 to-purple-400 rounded-full opacity-30 blur-sm"
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, 180, 360],
                  y: [0, -10, 0]
                }}
                transition={{ 
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-r from-green-400 to-teal-400 rounded-full opacity-30 blur-sm"
                animate={{ 
                  scale: [1.2, 1, 1.2],
                  rotate: [360, 180, 0],
                  y: [0, 10, 0]
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute top-1/2 -left-8 w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-25 blur-sm"
                animate={{ 
                  scale: [1, 1.5, 1],
                  rotate: [0, 90, 180, 270, 360],
                  x: [0, 20, 0]
                }}
                transition={{ 
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute top-1/4 -right-8 w-16 h-16 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full opacity-25 blur-sm"
                animate={{ 
                  scale: [1.5, 1, 1.5],
                  rotate: [360, 270, 180, 90, 0],
                  x: [0, -15, 0]
                }}
                transition={{ 
                  duration: 14,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Health Professionals Worldwide
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Join thousands of users who have transformed their health with our AI platform
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div 
                  key={index}
                  className="group text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-500 to-purple-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-3">{stat.number}</div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Revolutionary Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience the future of personalized nutrition with our cutting-edge AI technology
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div 
                  key={index}
                  className="group bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                >
                  {/* Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary-50/30 to-transparent dark:via-primary-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${feature.color} rounded-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                      {feature.description}
                    </p>
                    
                    {/* Benefits */}
                    <div className="space-y-2">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Health Professionals
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See what our users say about their experience
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mr-4">
                    <span className="text-primary-600 font-semibold">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Start your molecular nutrition journey today
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div 
                key={index}
                className={`bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border-2 ${
                  plan.popular ? 'border-primary-500 relative' : 'border-gray-200 dark:border-gray-700'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.price}
                    {plan.price !== 'Custom' && <span className="text-lg text-gray-500">/{plan.period}</span>}
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <motion.button 
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.popular 
                      ? 'bg-primary-600 text-white hover:bg-primary-700' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (plan.cta === 'Contact Sales') {
                      // For now, just navigate to dashboard
                      onNavigate?.('dashboard')
                    } else {
                      onNavigate?.('dashboard')
                    }
                  }}
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Health?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who have already optimized their molecular nutrition with AI
            </p>
                <motion.button 
                  className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors flex items-center mx-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate?.('dashboard')}
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.button>
          </motion.div>
        </div>
      </section>

    </div>
  )
}

export default LandingPage
