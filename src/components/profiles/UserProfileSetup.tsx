import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  User, 
  Calendar, 
  Heart, 
  Target, 
  CheckCircle,
  ArrowRight,
  AlertCircle
} from 'lucide-react'
import type { UserProfileFormData, HealthGoal } from '@/types'
import { cn } from '@/lib/utils'

const userProfileSchema = z.object({
  age: z.number().min(1, 'Age must be at least 1').max(120, 'Age must be less than 120'),
  sex: z.enum(['male', 'female', 'other']),
  ethnicity: z.string().min(1, 'Ethnicity is required'),
  region: z.string().min(1, 'Region is required'),
  medicalHistory: z.array(z.string()),
  lifestyle: z.enum(['vegan', 'vegetarian', 'omnivore', 'pescatarian', 'keto', 'paleo']),
  healthGoals: z.array(z.string()).min(1, 'Select at least one health goal')
}).refine((data) => {
  // Custom validation to ensure all fields are filled
  return data.age && data.sex && data.ethnicity && data.region && data.lifestyle
}, {
  message: "All fields are required",
  path: ["age"] // This will show the error on the age field
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

interface UserProfileSetupProps {
  onComplete: (profile: UserProfileFormData) => void
  initialData?: Partial<UserProfileFormData>
}

export function UserProfileSetup({ onComplete, initialData }: UserProfileSetupProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedGoals, setSelectedGoals] = useState<HealthGoal[]>(initialData?.healthGoals || [])
  const [selectedMedical, setSelectedMedical] = useState<string[]>(initialData?.medicalHistory || [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      age: initialData?.age || 25,
      sex: initialData?.sex || 'other',
      ethnicity: initialData?.ethnicity || '',
      region: initialData?.region || '',
      medicalHistory: initialData?.medicalHistory || [],
      lifestyle: initialData?.lifestyle || 'omnivore',
      healthGoals: initialData?.healthGoals || []
    }
  })

  const onSubmit = (data: UserProfileFormData) => {
    console.log('=== FORM SUBMISSION STARTED ===')
    console.log('Form data:', data)
    console.log('Selected goals:', selectedGoals)
    console.log('Selected medical:', selectedMedical)
    console.log('Current step:', currentStep)
    
    // Validate all required fields
    if (!data.age || !data.sex || !data.ethnicity || !data.region || !data.lifestyle) {
      console.error('Missing required fields:', {
        age: data.age,
        sex: data.sex,
        ethnicity: data.ethnicity,
        region: data.region,
        lifestyle: data.lifestyle
      })
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
    console.log('onComplete function:', onComplete)
    
    try {
      onComplete(profileData)
      console.log('onComplete called successfully')
    } catch (error) {
      console.error('Error calling onComplete:', error)
    }
    
    console.log('=== FORM SUBMISSION COMPLETED ===')
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

  // Test function with random data
  const testWithRandomData = () => {
    console.log('=== TESTING WITH RANDOM DATA ===')
    const randomData = {
      age: 25,
      sex: 'female' as const,
      ethnicity: 'Asian',
      region: 'North America',
      medicalHistory: ['none'],
      lifestyle: 'vegan' as const,
      healthGoals: ['muscle_gain', 'energy_boost'] as HealthGoal[]
    }
    
    console.log('Random test data:', randomData)
    onComplete(randomData)
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const steps = [
    { number: 1, title: 'Basic Info', icon: User },
    { number: 2, title: 'Health & Lifestyle', icon: Heart },
    { number: 3, title: 'Goals & Preferences', icon: Target }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 molecular-bg">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full mb-4"
            >
              <User className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Welcome to Molecular Nutrition AI
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Let's create your personalized nutrition profile
            </p>
            {/* Test Buttons */}
            <div className="flex space-x-2">
              <motion.button
                onClick={testWithRandomData}
                className="btn-secondary text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🧪 Test with Random Data
              </motion.button>
              <motion.button
                onClick={() => {
                  console.log('=== DIRECT PROFILE SAVE TEST ===')
                  const testData = {
                    age: 25,
                    sex: 'male' as const,
                    ethnicity: 'African American',
                    region: 'South America',
                    medicalHistory: [],
                    lifestyle: 'vegan' as const,
                    healthGoals: ['mental_clarity', 'muscle_gain'] as HealthGoal[]
                  }
                  console.log('Direct test data:', testData)
                  onComplete(testData)
                }}
                className="btn-secondary text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🔧 Direct Save Test
              </motion.button>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = currentStep === step.number
                const isCompleted = currentStep > step.number
                
                return (
                  <React.Fragment key={step.number}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className={cn(
                        "flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200",
                        isActive 
                          ? "bg-primary-600 text-white" 
                          : isCompleted
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                      <span className="font-medium">{step.title}</span>
                    </motion.div>
                    {index < steps.length - 1 && (
                      <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600" />
                    )}
                  </React.Fragment>
                )
              })}
            </div>
          </div>

          {/* Form */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="card p-8"
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <Calendar className="h-12 w-12 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      Basic Information
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Tell us about yourself to personalize your experience
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Age
                      </label>
                      <input
                        id="age"
                        type="number"
                        autoComplete="bday-year"
                        {...register('age', { valueAsNumber: true })}
                        className={cn("input", errors.age && "input-error")}
                        placeholder="Enter your age"
                      />
                      {errors.age && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.age.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="sex" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sex
                      </label>
                      <select
                        id="sex"
                        autoComplete="sex"
                        {...register('sex')}
                        className={cn("input", errors.sex && "input-error")}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="ethnicity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ethnicity
                      </label>
                      <select
                        id="ethnicity"
                        autoComplete="off"
                        {...register('ethnicity')}
                        className={cn("input", errors.ethnicity && "input-error")}
                      >
                        <option value="">Select ethnicity</option>
                        {ethnicities.map(ethnicity => (
                          <option key={ethnicity} value={ethnicity}>{ethnicity}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="region" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Region
                      </label>
                      <select
                        id="region"
                        autoComplete="country"
                        {...register('region')}
                        className={cn("input", errors.region && "input-error")}
                      >
                        <option value="">Select region</option>
                        {regions.map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Health & Lifestyle */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <Heart className="h-12 w-12 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      Health & Lifestyle
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Help us understand your health background and dietary preferences
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Dietary Lifestyle
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['vegan', 'vegetarian', 'omnivore', 'pescatarian', 'keto', 'paleo'].map(lifestyle => (
                        <motion.button
                          key={lifestyle}
                          type="button"
                          onClick={() => setValue('lifestyle', lifestyle as any)}
                          className={cn(
                            "p-3 rounded-lg border-2 transition-all duration-200 text-center",
                            watch('lifestyle') === lifestyle
                              ? "border-primary-500 bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
                              : "border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-500"
                          )}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="font-medium capitalize">{lifestyle}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Medical History (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {medicalConditions.map(condition => (
                        <motion.button
                          key={condition}
                          type="button"
                          onClick={() => toggleMedical(condition)}
                          className={cn(
                            "p-3 rounded-lg border-2 transition-all duration-200 text-center",
                            selectedMedical.includes(condition)
                              ? "border-red-500 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300"
                              : "border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-500"
                          )}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="font-medium capitalize">
                            {condition.replace('_', ' ')}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Goals & Preferences */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <Target className="h-12 w-12 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      Health Goals
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      What would you like to achieve with your nutrition?
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Select your health goals (Choose at least one)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {healthGoals.map(goal => (
                        <motion.button
                          key={goal.value}
                          type="button"
                          onClick={() => toggleGoal(goal.value)}
                          className={cn(
                            "p-4 rounded-lg border-2 transition-all duration-200 text-center",
                            selectedGoals.includes(goal.value)
                              ? "border-primary-500 bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
                              : "border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-500"
                          )}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="text-2xl mb-2">{goal.icon}</div>
                          <span className="font-medium text-sm">{goal.label}</span>
                        </motion.button>
                      ))}
                    </div>
                    {selectedGoals.length === 0 && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Please select at least one health goal
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <motion.button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={cn(
                    "btn-secondary",
                    currentStep === 1 && "opacity-50 cursor-not-allowed"
                  )}
                  whileHover={{ scale: currentStep === 1 ? 1 : 1.05 }}
                  whileTap={{ scale: currentStep === 1 ? 1 : 0.95 }}
                >
                  Previous
                </motion.button>

                {currentStep < 3 ? (
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
                      
                      // Get form data and call onSubmit directly
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
        </motion.div>
      </div>
    </div>
  )
}
