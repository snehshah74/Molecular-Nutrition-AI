import type { 
  UserProfile, 
  Macronutrient, 
  Micronutrient
} from '@/types'

// Daily nutrient targets based on user profile
export class NutrientTargets {
  static getMacronutrientTargets(userProfile: UserProfile): Macronutrient[] {
    const { age, sex, height, weight, healthGoals } = userProfile
    
    // Calculate BMR using Harris-Benedict equation
    let bmr: number
    if (sex === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
    }
    
    // Activity factor (assuming moderate activity level)
    const activityFactor = 1.55
    let baseCalories = Math.round(bmr * activityFactor)
    
    // Adjust for health goals
    if (healthGoals.includes('muscle_gain')) baseCalories += 300
    if (healthGoals.includes('weight_loss')) baseCalories -= 300
    
    // BMI-based adjustments
    const bmi = weight / ((height / 100) ** 2)
    if (bmi < 18.5) {
      baseCalories += 200 // Underweight - increase calories
    } else if (bmi > 30) {
      baseCalories -= 400 // Obese - more aggressive deficit
    }
    
    // Macronutrient distribution - protein based on body weight
    const proteinGrams = Math.round(weight * 1.6) // 1.6g per kg body weight
    const proteinCalories = proteinGrams * 4
    const remainingCalories = baseCalories - proteinCalories
    const carbGrams = Math.round(remainingCalories * 0.55 / 4)   // 55% of remaining calories
    const fatGrams = Math.round(remainingCalories * 0.45 / 9)    // 45% of remaining calories
    const fiberGrams = Math.round(weight * 0.4) // 0.4g per kg body weight
    
    return [
      {
        name: 'Calories',
        amount: baseCalories,
        unit: 'kcal',
        calories: baseCalories,
        status: 'good'
      },
      {
        name: 'Protein',
        amount: proteinGrams,
        unit: 'g',
        calories: proteinGrams * 4,
        status: 'good'
      },
      {
        name: 'Carbohydrates',
        amount: carbGrams,
        unit: 'g',
        calories: carbGrams * 4,
        status: 'good'
      },
      {
        name: 'Fat',
        amount: fatGrams,
        unit: 'g',
        calories: fatGrams * 9,
        status: 'good'
      },
      {
        name: 'Fiber',
        amount: fiberGrams,
        unit: 'g',
        calories: 0,
        status: 'good'
      }
    ]
  }
  
  static getMicronutrientTargets(userProfile: UserProfile): Micronutrient[] {
    const { sex, weight, lifestyle, medicalHistory } = userProfile
    
    // Base targets (RDA values) - some adjusted for body weight
    const targets: Micronutrient[] = [
      { name: 'Iron', amount: sex === 'female' ? 18 : 8, unit: 'mg', status: 'good', category: 'mineral' },
      { name: 'Calcium', amount: Math.round(weight * 12.5), unit: 'mg', status: 'good', category: 'mineral' }, // 12.5mg per kg
      { name: 'Vitamin C', amount: Math.round(weight * 1.5), unit: 'mg', status: 'good', category: 'vitamin' }, // 1.5mg per kg
      { name: 'Vitamin D', amount: Math.round(weight * 8), unit: 'IU', status: 'good', category: 'vitamin' }, // 8 IU per kg
      { name: 'Vitamin B12', amount: 2.4, unit: 'mcg', status: 'good', category: 'vitamin' },
      { name: 'Zinc', amount: sex === 'male' ? 11 : 8, unit: 'mg', status: 'good', category: 'mineral' },
      { name: 'Magnesium', amount: Math.round(weight * 5), unit: 'mg', status: 'good', category: 'mineral' }, // 5mg per kg
      { name: 'Folate', amount: 400, unit: 'mcg', status: 'good', category: 'vitamin' },
      { name: 'Vitamin A', amount: sex === 'male' ? 900 : 700, unit: 'mcg', status: 'good', category: 'vitamin' },
      { name: 'Vitamin E', amount: Math.round(weight * 0.2), unit: 'mg', status: 'good', category: 'vitamin' } // 0.2mg per kg
    ]
    
    // Adjust for lifestyle
    if (lifestyle === 'vegan' || lifestyle === 'vegetarian') {
      // Increase B12 and iron targets for plant-based diets
      const b12Target = targets.find(t => t.name === 'Vitamin B12')
      if (b12Target) b12Target.amount = 2.8
      
      const ironTarget = targets.find(t => t.name === 'Iron')
      if (ironTarget) ironTarget.amount *= 1.8 // Plant iron is less bioavailable
    }
    
    // Adjust for medical conditions
    if (medicalHistory.includes('diabetes')) {
      const chromiumTarget: Micronutrient = {
        name: 'Chromium',
        amount: 35,
        unit: 'mcg',
        status: 'good',
        category: 'mineral'
      }
      targets.push(chromiumTarget)
    }
    
    if (medicalHistory.includes('cardiovascular')) {
      const omega3Target: Micronutrient = {
        name: 'Omega-3',
        amount: 1000,
        unit: 'mg',
        status: 'good',
        category: 'fatty_acid'
      }
      targets.push(omega3Target)
    }
    
    return targets
  }
}

// Nutrient calculation utilities
export class NutrientCalculations {
  static calculateDailyTotals(meals: any[]): { macronutrients: Macronutrient[], micronutrients: Micronutrient[] } {
    const macroTotals: { [key: string]: number } = {}
    const microTotals: { [key: string]: number } = {}
    
    meals.forEach(meal => {
      meal.foodItems?.forEach((foodItem: any) => {
        // Sum macronutrients
        Object.entries(foodItem.macronutrients || {}).forEach(([key, value]) => {
          macroTotals[key] = (macroTotals[key] || 0) + (value as number)
        })
        
        // Sum micronutrients
        foodItem.micronutrients?.forEach((nutrient: Micronutrient) => {
          microTotals[nutrient.name] = (microTotals[nutrient.name] || 0) + nutrient.amount
        })
      })
    })
    
    // Convert to arrays
    const macronutrients: Macronutrient[] = Object.entries(macroTotals).map(([name, amount]) => ({
      name: this.formatNutrientName(name),
      amount: Math.round(amount * 10) / 10,
      unit: this.getNutrientUnit(name),
      calories: name === 'Calories' ? amount : 0,
      status: 'good'
    }))
    
    const micronutrients: Micronutrient[] = Object.entries(microTotals).map(([name, amount]) => ({
      name,
      amount: Math.round(amount * 10) / 10,
      unit: this.getNutrientUnit(name),
      status: 'good',
      category: this.getNutrientCategory(name)
    }))
    
    return { macronutrients, micronutrients }
  }
  
  static calculateNutrientStatus(
    current: number,
    target: number,
    nutrientName: string
  ): 'excellent' | 'good' | 'warning' | 'poor' | 'critical' {
    const percentage = (current / target) * 100
    
    // Special handling for certain nutrients
    if (nutrientName === 'Calories' || nutrientName === 'Fat') {
      // For calories and fat, being slightly under is better than over
      if (percentage >= 90 && percentage <= 110) return 'excellent'
      if (percentage >= 80 && percentage <= 120) return 'good'
      if (percentage >= 70 && percentage <= 130) return 'warning'
      if (percentage >= 60 && percentage <= 140) return 'poor'
      return 'critical'
    }
    
    // For most nutrients, meeting or exceeding target is good
    if (percentage >= 100) return 'excellent'
    if (percentage >= 80) return 'good'
    if (percentage >= 60) return 'warning'
    if (percentage >= 40) return 'poor'
    return 'critical'
  }
  
  static identifyDeficiencies(
    current: Micronutrient[],
    targets: Micronutrient[]
  ): string[] {
    const deficiencies: string[] = []
    
    targets.forEach(target => {
      const currentNutrient = current.find(c => c.name === target.name)
      if (currentNutrient) {
        const status = this.calculateNutrientStatus(
          currentNutrient.amount,
          target.amount,
          target.name
        )
        
        if (status === 'poor' || status === 'critical') {
          deficiencies.push(target.name)
        }
      } else {
        // Nutrient not consumed at all
        deficiencies.push(target.name)
      }
    })
    
    return deficiencies
  }
  
  static calculateMolecularBalanceScore(
    macronutrients: Macronutrient[],
    micronutrients: Micronutrient[],
    targets: { macronutrients: Macronutrient[], micronutrients: Micronutrient[] }
  ): number {
    const allNutrients = [...macronutrients, ...micronutrients]
    const allTargets = [...targets.macronutrients, ...targets.micronutrients]
    
    if (allNutrients.length === 0) return 0
    
    const scores = allNutrients.map(nutrient => {
      const target = allTargets.find(t => t.name === nutrient.name)
      if (!target) return 0
      
      const percentage = (nutrient.amount / target.amount) * 100
      
      // Score calculation (0-100)
      if (percentage >= 100) return 100
      if (percentage >= 80) return 80 + (percentage - 80) * 1
      if (percentage >= 60) return 60 + (percentage - 60) * 1
      if (percentage >= 40) return 40 + (percentage - 40) * 1
      return Math.max(0, percentage * 1)
    })
    
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
  }
  
  private static formatNutrientName(name: string): string {
    const nameMap: { [key: string]: string } = {
      'protein': 'Protein',
      'carbohydrates': 'Carbohydrates',
      'fat': 'Fat',
      'fiber': 'Fiber',
      'calories': 'Calories'
    }
    return nameMap[name] || name
  }
  
  private static getNutrientUnit(name: string): string {
    const unitMap: { [key: string]: string } = {
      'protein': 'g',
      'carbohydrates': 'g',
      'fat': 'g',
      'fiber': 'g',
      'calories': 'kcal',
      'Iron': 'mg',
      'Calcium': 'mg',
      'Vitamin C': 'mg',
      'Vitamin D': 'IU',
      'Vitamin B12': 'mcg',
      'Zinc': 'mg',
      'Magnesium': 'mg',
      'Folate': 'mcg',
      'Vitamin A': 'mcg',
      'Vitamin E': 'mg',
      'Chromium': 'mcg',
      'Omega-3': 'mg'
    }
    return unitMap[name] || 'g'
  }
  
  private static getNutrientCategory(name: string): 'vitamin' | 'mineral' | 'amino_acid' | 'fatty_acid' {
    const vitaminNames = ['Vitamin C', 'Vitamin D', 'Vitamin B12', 'Folate', 'Vitamin A', 'Vitamin E']
    const mineralNames = ['Iron', 'Calcium', 'Zinc', 'Magnesium', 'Chromium']
    const fattyAcidNames = ['Omega-3']
    
    if (vitaminNames.includes(name)) return 'vitamin'
    if (mineralNames.includes(name)) return 'mineral'
    if (fattyAcidNames.includes(name)) return 'fatty_acid'
    return 'mineral' // default
  }
}

// Progress analysis utilities
export class ProgressAnalysis {
  static analyzeTrends(progressData: any[]): {
    overallTrend: 'improving' | 'stable' | 'declining'
    keyInsights: string[]
    recommendations: string[]
  } {
    if (progressData.length < 2) {
      return {
        overallTrend: 'stable',
        keyInsights: ['Insufficient data for trend analysis'],
        recommendations: ['Continue logging meals to get better insights']
      }
    }
    
    const recentScores = progressData.slice(-7).map(d => d.molecularBalanceScore)
    const olderScores = progressData.slice(-14, -7).map(d => d.molecularBalanceScore)
    
    const recentAvg = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length
    const olderAvg = olderScores.length > 0 
      ? olderScores.reduce((sum, score) => sum + score, 0) / olderScores.length
      : recentAvg
    
    const trend = recentAvg > olderAvg + 5 ? 'improving' 
                 : recentAvg < olderAvg - 5 ? 'declining' 
                 : 'stable'
    
    const insights: string[] = []
    const recommendations: string[] = []
    
    if (trend === 'improving') {
      insights.push('Your molecular balance score is improving!')
      recommendations.push('Keep up the great work with your current nutrition plan')
    } else if (trend === 'declining') {
      insights.push('Your molecular balance score has decreased recently')
      recommendations.push('Consider reviewing your meal choices and increasing nutrient-dense foods')
    } else {
      insights.push('Your nutrition balance has been stable')
      recommendations.push('Try adding more variety to optimize your nutrient intake')
    }
    
    return { overallTrend: trend, keyInsights: insights, recommendations }
  }
}
