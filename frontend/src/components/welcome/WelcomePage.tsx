import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  User, 
  Heart, 
  Target, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Dna
} from 'lucide-react'
import type { HealthGoal } from '@/types'
import { cn } from '@/lib/utils'

const userProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  age: z.number().min(1, 'Age must be at least 1').max(120, 'Age must be less than 120'),
  sex: z.enum(['male', 'female', 'other']),
  height: z.number().min(100, 'Height must be at least 100cm').max(250, 'Height must be less than 250cm'),
  weight: z.number().min(30, 'Weight must be at least 30kg').max(300, 'Weight must be less than 300kg'),
  ethnicity: z.string().min(1, 'Ethnicity is required'),
  region: z.string().min(1, 'Region is required'),
  medicalHistory: z.array(z.string()),
  lifestyle: z.enum(['vegan', 'vegetarian', 'omnivore', 'pescatarian', 'keto', 'paleo']),
  healthGoals: z.array(z.string()).min(1, 'Select at least one health goal')
}).refine((data) => {
  return data.name && data.age && data.sex && data.height && data.weight && data.ethnicity && data.region && data.lifestyle
}, {
  message: "All fields are required",
  path: ["name"]
})

const ethnicities = [
  'Caucasian', 'African American', 'Hispanic/Latino', 'Asian', 
  'Native American', 'Pacific Islander', 'Mixed Race', 'Other'
]

const regions = [
  'North America', 'South America', 'Europe', 'Asia', 
  'Africa', 'Oceania', 'Middle East', 'Other'
]

const medicalConditions = [
  'diabetes', 'cardiovascular', 'hypertension', 'allergies', 
  'digestive_issues', 'autoimmune', 'mental_health', 'none'
]

const healthGoals: { value: HealthGoal; label: string; icon: string }[] = [
  { value: 'muscle_gain', label: 'Muscle Gain', icon: '💪' },
  { value: 'weight_loss', label: 'Weight Loss', icon: '⚖️' },
  { value: 'energy_boost', label: 'Energy Boost', icon: '⚡' },
  { value: 'longevity', label: 'Longevity', icon: '🌱' },
  { value: 'disease_prevention', label: 'Disease Prevention', icon: '🛡️' },
  { value: 'athletic_performance', label: 'Athletic Performance', icon: '🏃' },
  { value: 'mental_clarity', label: 'Mental Clarity', icon: '🧠' },
  { value: 'immune_support', label: 'Immune Support', icon: '🦠' }
]

interface WelcomePageProps {
  onComplete: (profile: any) => void
}

export function WelcomePage({ onComplete }: WelcomePageProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedGoals, setSelectedGoals] = useState<HealthGoal[]>([])
  const [selectedMedical, setSelectedMedical] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: '',
      age: 25,
      sex: 'other',
      height: 0,
      weight: 0,
      ethnicity: '',
      region: '',
      medicalHistory: [],
      lifestyle: 'omnivore',
      healthGoals: []
    }
  })

  const onSubmit = (data: any) => {
    console.log('=== FORM SUBMISSION STARTED ===')
    console.log('Form data:', data)
    console.log('Selected goals:', selectedGoals)
    console.log('Selected medical:', selectedMedical)
    
    if (!data.name || !data.age || !data.sex || !data.height || !data.weight || !data.ethnicity || !data.region || !data.lifestyle) {
      console.error('Missing required fields')
      alert('Please fill in all required fields')
      return
    }
    
    if (selectedGoals.length === 0) {
      console.error('No health goals selected')
      alert('Please select at least one health goal')
      return
    }
    
    const profileData = {
      ...data,
      healthGoals: selectedGoals,
      medicalHistory: selectedMedical
    }
    
    console.log('Final profile data:', profileData)
    console.log('Calling onComplete...')
    
    try {
      onComplete(profileData)
      console.log('onComplete called successfully')
    } catch (error) {
      console.error('Error calling onComplete:', error)
    }
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const toggleGoal = (goal: HealthGoal) => {
    setSelectedGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    )
  }

  const toggleMedical = (condition: string) => {
    setSelectedMedical(prev => 
      prev.includes(condition) 
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    )
  }

  const steps = [
    { number: 1, title: 'Basic Information', icon: User },
    { number: 2, title: 'Health & Lifestyle', icon: Heart },
    { number: 3, title: 'Health Goals', icon: Target },
    { number: 4, title: 'Complete Setup', icon: CheckCircle }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Logo */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="relative">
              <Dna className="h-12 w-12 text-primary-600 dark:text-primary-400 animate-pulse" />
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-secondary-500 rounded-full animate-bounce" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to Molecular Nutrition AI
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
            Great! Your account has been created successfully.
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Now let's create your personalized molecular nutrition profile
          </p>
        </motion.div>

        {/* Stepper */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.number
              const isCompleted = currentStep > step.number
              
              return (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                      isActive && "bg-primary-600 border-primary-600 text-white scale-110",
                      isCompleted && "bg-green-500 border-green-500 text-white",
                      !isActive && !isCompleted && "border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500"
                    )}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className={cn(
                      "mt-2 text-sm font-medium transition-colors duration-300",
                      isActive && "text-primary-600 dark:text-primary-400",
                      !isActive && "text-gray-500 dark:text-gray-400"
                    )}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "flex-1 h-0.5 mx-4 transition-colors duration-300",
                      isCompleted ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                    )} />
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Form Container */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Basic Information
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Tell us about yourself to get started
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      {...register('name')}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Age *
                    </label>
                    <input
                      {...register('age', { valueAsNumber: true })}
                      type="number"
                      min="1"
                      max="120"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    {errors.age && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.age.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sex *
                    </label>
                    <select
                      {...register('sex')}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="other">Prefer not to say</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Height (cm) *
                    </label>
                    <input
                      {...register('height', { valueAsNumber: true })}
                      type="number"
                      min="100"
                      max="250"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Weight (kg) *
                    </label>
                    <input
                      {...register('weight', { valueAsNumber: true })}
                      type="number"
                      min="30"
                      max="300"
                      step="0.1"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ethnicity *
                    </label>
                    <select
                      {...register('ethnicity')}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select ethnicity</option>
                      {ethnicities.map(ethnicity => (
                        <option key={ethnicity} value={ethnicity}>{ethnicity}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Region *
                    </label>
                    <select
                      {...register('region')}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select region</option>
                      {regions.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Health & Lifestyle */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Health & Lifestyle
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Help us understand your lifestyle and health background
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                      Dietary Lifestyle *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['vegan', 'vegetarian', 'omnivore', 'pescatarian', 'keto', 'paleo'].map(lifestyle => (
                        <label key={lifestyle} className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <input
                            {...register('lifestyle')}
                            type="radio"
                            value={lifestyle}
                            className="sr-only"
                          />
                          <div className={cn(
                            "w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center",
                            watch('lifestyle') === lifestyle ? "border-primary-500 bg-primary-500" : "border-gray-300 dark:border-gray-600"
                          )}>
                            {watch('lifestyle') === lifestyle && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                            {lifestyle}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                      Medical History (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {medicalConditions.map(condition => (
                        <button
                          key={condition}
                          type="button"
                          onClick={() => toggleMedical(condition)}
                          className={cn(
                            "p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium capitalize",
                            selectedMedical.includes(condition)
                              ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                              : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-600"
                          )}
                        >
                          {condition.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Health Goals */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Health Goals
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    What do you want to achieve with your nutrition?
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {healthGoals.map(goal => (
                    <button
                      key={goal.value}
                      type="button"
                      onClick={() => toggleGoal(goal.value)}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all duration-200 text-left",
                        selectedGoals.includes(goal.value)
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg scale-105"
                          : "border-gray-300 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{goal.icon}</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {goal.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {selectedGoals.length === 0 && (
                  <div className="text-center py-4">
                    <AlertCircle className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">
                      Please select at least one health goal to continue
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 4: Complete Setup */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="text-center space-y-6"
              >
                <div className="mb-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Ready to Get Started!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your personalized nutrition journey is about to begin
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Profile Summary:</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Name:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">{watch('name')}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Age:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">{watch('age')}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Lifestyle:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white capitalize">{watch('lifestyle')}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Goals:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">{selectedGoals.length} selected</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
              {currentStep > 1 ? (
                <motion.button
                  type="button"
                  onClick={prevStep}
                  className="btn-secondary flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </motion.button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <motion.button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={selectedGoals.length === 0}
                  className={cn(
                    "btn-primary flex items-center space-x-2",
                    selectedGoals.length === 0 && "opacity-50 cursor-not-allowed"
                  )}
                  whileHover={{ scale: selectedGoals.length === 0 ? 1 : 1.05 }}
                  whileTap={{ scale: selectedGoals.length === 0 ? 1 : 0.95 }}
                  onClick={(e) => {
                    e.preventDefault()
                    console.log('Complete Setup button clicked')
                    console.log('Selected goals:', selectedGoals)
                    console.log('Form data:', watch())
                    
                    const formData = watch()
                    console.log('Calling onSubmit with form data:', formData)
                    onSubmit(formData)
                  }}
                >
                  <span>Complete Setup</span>
                  <CheckCircle className="h-4 w-4" />
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
