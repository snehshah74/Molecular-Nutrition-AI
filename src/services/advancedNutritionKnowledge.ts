// Advanced Nutrition Knowledge Base for Enhanced AI Training

export interface AdvancedNutrientProfile {
  name: string
  category: 'vitamin' | 'mineral' | 'macronutrient' | 'phytonutrient' | 'amino_acid'
  molecularWeight: number
  bioavailability: {
    food_source: number
    supplement_form: number
    factors_affecting: string[]
  }
  interactions: {
    enhances: string[]
    inhibits: string[]
    synergizes: string[]
  }
  genetic_variants: {
    gene: string
    variant: string
    impact: string
  }[]
  clinical_evidence: {
    study_type: 'RCT' | 'Meta' | 'Cohort' | 'Case'
    strength: 'Strong' | 'Moderate' | 'Weak'
    conclusion: string
  }[]
  therapeutic_doses: {
    condition: string
    dose_range: string
    duration: string
    contraindications: string[]
  }[]
}

export interface MealTimingInsight {
  meal_type: 'pre_workout' | 'post_workout' | 'breakfast' | 'lunch' | 'dinner' | 'snack'
  optimal_timing: string
  macronutrient_ratio: { protein: number; carbs: number; fat: number }
  specific_nutrients: string[]
  molecular_rationale: string
  food_suggestions: string[]
}

export interface CircadianNutrition {
  time_of_day: string
  metabolic_phase: string
  optimal_nutrients: string[]
  avoid_nutrients: string[]
  food_timing_rationale: string
}

export class AdvancedNutritionKnowledge {
  // Advanced nutrient profiles with molecular details
  static readonly ADVANCED_NUTRIENTS: { [key: string]: AdvancedNutrientProfile } = {
    vitaminD3: {
      name: 'Vitamin D3 (Cholecalciferol)',
      category: 'vitamin',
      molecularWeight: 384.6,
      bioavailability: {
        food_source: 60,
        supplement_form: 95,
        factors_affecting: ['fat_consumption', 'sun_exposure', 'skin_pigmentation', 'age']
      },
      interactions: {
        enhances: ['calcium_absorption', 'magnesium_utilization', 'immune_function'],
        inhibits: ['vitamin_k_metabolism'],
        synergizes: ['vitamin_k2', 'magnesium', 'zinc']
      },
      genetic_variants: [
        { gene: 'VDR', variant: 'FokI', impact: 'Affects vitamin D receptor function' },
        { gene: 'CYP2R1', variant: 'rs10741657', impact: 'Influences vitamin D synthesis' }
      ],
      clinical_evidence: [
        { study_type: 'Meta', strength: 'Strong', conclusion: 'Reduces respiratory infections by 12-70%' },
        { study_type: 'RCT', strength: 'Moderate', conclusion: 'May improve mood and cognitive function' }
      ],
      therapeutic_doses: [
        { condition: 'deficiency', dose_range: '2000-4000 IU/day', duration: '8-12 weeks', contraindications: ['hypercalcemia', 'sarcoidosis'] },
        { condition: 'immune_support', dose_range: '1000-2000 IU/day', duration: 'ongoing', contraindications: ['kidney_stones'] }
      ]
    },

    omega3_epa_dha: {
      name: 'Omega-3 EPA/DHA',
      category: 'macronutrient',
      molecularWeight: 302.5,
      bioavailability: {
        food_source: 85,
        supplement_form: 95,
        factors_affecting: ['meal_timing', 'fat_content', 'oxidation_status']
      },
      interactions: {
        enhances: ['anti_inflammatory_response', 'brain_function', 'heart_health'],
        inhibits: ['omega6_inflammation'],
        synergizes: ['vitamin_e', 'astaxanthin']
      },
      genetic_variants: [
        { gene: 'FADS1', variant: 'rs174537', impact: 'Affects EPA/DHA conversion efficiency' },
        { gene: 'COX2', variant: 'rs5275', impact: 'Influences anti-inflammatory response' }
      ],
      clinical_evidence: [
        { study_type: 'Meta', strength: 'Strong', conclusion: 'Reduces cardiovascular mortality by 8%' },
        { study_type: 'RCT', strength: 'Moderate', conclusion: 'May improve depression symptoms' }
      ],
      therapeutic_doses: [
        { condition: 'heart_health', dose_range: '1000-2000mg EPA+DHA/day', duration: 'ongoing', contraindications: ['bleeding_disorders'] },
        { condition: 'inflammation', dose_range: '2000-3000mg EPA+DHA/day', duration: '3-6 months', contraindications: ['warfarin_therapy'] }
      ]
    },

    magnesium_glycinate: {
      name: 'Magnesium Glycinate',
      category: 'mineral',
      molecularWeight: 172.4,
      bioavailability: {
        food_source: 45,
        supplement_form: 80,
        factors_affecting: ['stress_levels', 'exercise_intensity', 'alcohol_consumption']
      },
      interactions: {
        enhances: ['vitamin_d_activation', 'calcium_absorption', 'insulin_sensitivity'],
        inhibits: ['calcium_excess'],
        synergizes: ['vitamin_b6', 'zinc', 'vitamin_d3']
      },
      genetic_variants: [
        { gene: 'TRPM6', variant: 'rs2274924', impact: 'Affects magnesium absorption' },
        { gene: 'SLC41A1', variant: 'rs823156', impact: 'Influences magnesium transport' }
      ],
      clinical_evidence: [
        { study_type: 'Meta', strength: 'Moderate', conclusion: 'May reduce blood pressure by 2-3 mmHg' },
        { study_type: 'RCT', strength: 'Strong', conclusion: 'Improves sleep quality and duration' }
      ],
      therapeutic_doses: [
        { condition: 'sleep_quality', dose_range: '200-400mg/day', duration: '4-8 weeks', contraindications: ['kidney_disease'] },
        { condition: 'muscle_cramps', dose_range: '300-500mg/day', duration: 'ongoing', contraindications: ['myasthenia_gravis'] }
      ]
    },

    curcumin: {
      name: 'Curcumin (Curcuma longa)',
      category: 'phytonutrient',
      molecularWeight: 368.4,
      bioavailability: {
        food_source: 1,
        supplement_form: 65,
        factors_affecting: ['piperine_addition', 'fat_content', 'thermal_processing']
      },
      interactions: {
        enhances: ['anti_inflammatory_response', 'antioxidant_capacity', 'neuroprotection'],
        inhibits: ['inflammatory_cytokines'],
        synergizes: ['piperine', 'quercetin', 'resveratrol']
      },
      genetic_variants: [
        { gene: 'COX2', variant: 'rs5275', impact: 'Influences anti-inflammatory response' },
        { gene: 'IL1B', variant: 'rs16944', impact: 'Affects inflammatory cytokine production' }
      ],
      clinical_evidence: [
        { study_type: 'Meta', strength: 'Strong', conclusion: 'Reduces inflammation markers by 25-40%' },
        { study_type: 'RCT', strength: 'Moderate', conclusion: 'May improve cognitive function in elderly' }
      ],
      therapeutic_doses: [
        { condition: 'inflammation', dose_range: '500-1000mg/day', duration: '2-3 months', contraindications: ['gallbladder_disease'] },
        { condition: 'joint_health', dose_range: '1000-1500mg/day', duration: 'ongoing', contraindications: ['bleeding_disorders'] }
      ]
    },

    probiotics_lactobacillus: {
      name: 'Lactobacillus Probiotics',
      category: 'phytonutrient',
      molecularWeight: 0, // Variable
      bioavailability: {
        food_source: 20,
        supplement_form: 90,
        factors_affecting: ['stomach_acid', 'antibiotic_use', 'fiber_intake']
      },
      interactions: {
        enhances: ['immune_function', 'nutrient_absorption', 'gut_barrier_integrity'],
        inhibits: ['pathogenic_bacteria'],
        synergizes: ['prebiotic_fiber', 'vitamin_d', 'omega3']
      },
      genetic_variants: [
        { gene: 'TLR2', variant: 'rs5743708', impact: 'Affects probiotic recognition' },
        { gene: 'NOD2', variant: 'rs2066844', impact: 'Influences gut immune response' }
      ],
      clinical_evidence: [
        { study_type: 'Meta', strength: 'Strong', conclusion: 'Reduces antibiotic-associated diarrhea by 42%' },
        { study_type: 'RCT', strength: 'Moderate', conclusion: 'May improve mood and anxiety' }
      ],
      therapeutic_doses: [
        { condition: 'gut_health', dose_range: '10-50 billion CFU/day', duration: '4-12 weeks', contraindications: ['immunocompromised'] },
        { condition: 'immune_support', dose_range: '20-100 billion CFU/day', duration: 'ongoing', contraindications: ['central_line'] }
      ]
    }
  }

  // Meal timing optimization insights
  static readonly MEAL_TIMING: MealTimingInsight[] = [
    {
      meal_type: 'pre_workout',
      optimal_timing: '1-3 hours before',
      macronutrient_ratio: { protein: 25, carbs: 60, fat: 15 },
      specific_nutrients: ['beta_alanine', 'creatine', 'caffeine', 'nitrates'],
      molecular_rationale: 'Optimizes glycogen stores and provides sustained energy during exercise',
      food_suggestions: ['banana_with_peanut_butter', 'oatmeal_with_berries', 'sweet_potato', 'greek_yogurt']
    },
    {
      meal_type: 'post_workout',
      optimal_timing: '30-60 minutes after',
      macronutrient_ratio: { protein: 40, carbs: 45, fat: 15 },
      specific_nutrients: ['leucine', 'whey_protein', 'fast_carbs', 'antioxidants'],
      molecular_rationale: 'Maximizes muscle protein synthesis and glycogen replenishment',
      food_suggestions: ['chicken_with_rice', 'protein_smoothie', 'quinoa_bowl', 'salmon_with_sweet_potato']
    },
    {
      meal_type: 'breakfast',
      optimal_timing: 'Within 1 hour of waking',
      macronutrient_ratio: { protein: 30, carbs: 50, fat: 20 },
      specific_nutrients: ['protein', 'fiber', 'healthy_fats', 'b_vitamins'],
      molecular_rationale: 'Breaks overnight fast and stabilizes blood glucose for optimal cognitive function',
      food_suggestions: ['eggs_with_avocado', 'greek_yogurt_parfait', 'protein_pancakes', 'chia_pudding']
    }
  ]

  // Circadian nutrition patterns
  static readonly CIRCADIAN_NUTRITION: CircadianNutrition[] = [
    {
      time_of_day: 'morning_6_10am',
      metabolic_phase: 'catabolic_recovery',
      optimal_nutrients: ['protein', 'antioxidants', 'b_vitamins', 'omega3'],
      avoid_nutrients: ['excessive_sugar', 'processed_foods'],
      food_timing_rationale: 'Supports cortisol awakening response and metabolic reset'
    },
    {
      time_of_day: 'midday_10_2pm',
      metabolic_phase: 'metabolic_peak',
      optimal_nutrients: ['complex_carbs', 'protein', 'iron', 'vitamin_c'],
      avoid_nutrients: ['heavy_fats', 'excessive_caffeine'],
      food_timing_rationale: 'Aligns with peak insulin sensitivity and digestive capacity'
    },
    {
      time_of_day: 'evening_6_10pm',
      metabolic_phase: 'anabolic_recovery',
      optimal_nutrients: ['protein', 'magnesium', 'tryptophan', 'healthy_fats'],
      avoid_nutrients: ['caffeine', 'sugar', 'large_meals'],
      food_timing_rationale: 'Supports muscle recovery and prepares for sleep optimization'
    }
  ]

  // Advanced AI training prompts
  static getAdvancedTrainingPrompt(userProfile: any, dailyIntake: any, deficiencies: string[]): string {
    const circadianInsights = this.getCircadianInsights()
    const mealTimingInsights = this.getMealTimingInsights()
    const geneticConsiderations = this.getGeneticConsiderations()
    const therapeuticNutrients = this.getTherapeuticNutrients(deficiencies)

    return `
You are an advanced molecular nutrition AI with expertise in:
- Nutrigenomics and personalized nutrition
- Circadian biology and meal timing
- Advanced supplement protocols
- Clinical nutrition research
- Bioavailability optimization

USER PROFILE ANALYSIS:
${JSON.stringify(userProfile, null, 2)}

CURRENT NUTRITION STATUS:
${JSON.stringify(dailyIntake, null, 2)}

IDENTIFIED DEFICIENCIES: ${deficiencies.join(', ')}

ADVANCED NUTRITION INSIGHTS:

CIRCADIAN NUTRITION OPTIMIZATION:
${circadianInsights}

MEAL TIMING OPTIMIZATION:
${mealTimingInsights}

GENETIC CONSIDERATIONS:
${geneticConsiderations}

THERAPEUTIC NUTRIENT PROTOCOLS:
${therapeuticNutrients}

Provide recommendations that include:
1. Personalized nutrient timing based on circadian rhythms
2. Bioavailability optimization strategies
3. Genetic variant considerations
4. Advanced supplement protocols with clinical evidence
5. Meal timing optimization for metabolic health
6. Molecular mechanisms and scientific rationale

Format as JSON with detailed molecular explanations and clinical evidence.
`
  }

  private static getCircadianInsights(): string {
    return this.CIRCADIAN_NUTRITION.map(phase => `
${phase.time_of_day.toUpperCase()} (${phase.metabolic_phase}):
- Optimal nutrients: ${phase.optimal_nutrients.join(', ')}
- Avoid: ${phase.avoid_nutrients.join(', ')}
- Rationale: ${phase.food_timing_rationale}
`).join('\n')
  }

  private static getMealTimingInsights(): string {
    return this.MEAL_TIMING.map(meal => `
${meal.meal_type.toUpperCase()}:
- Timing: ${meal.optimal_timing}
- Macro ratio: P${meal.macronutrient_ratio.protein}C${meal.macronutrient_ratio.carbs}F${meal.macronutrient_ratio.fat}
- Key nutrients: ${meal.specific_nutrients.join(', ')}
- Molecular rationale: ${meal.molecular_rationale}
- Food suggestions: ${meal.food_suggestions.join(', ')}
`).join('\n')
  }

  private static getGeneticConsiderations(): string {
    return `
Genetic variants affecting nutrition:
- MTHFR: Affects folate metabolism and methylation
- COMT: Influences caffeine and dopamine metabolism
- CYP1A2: Affects caffeine metabolism speed
- FADS1/2: Influences omega-3 conversion efficiency
- VDR: Affects vitamin D receptor function

Consider genetic testing for personalized nutrition optimization.
`
  }

  private static getTherapeuticNutrients(deficiencies: string[]): string {
    const therapeuticNutrients = deficiencies.map(def => {
      const nutrient = this.ADVANCED_NUTRIENTS[def.toLowerCase()]
      if (nutrient) {
        return `
${nutrient.name.toUpperCase()}:
- Bioavailability: ${nutrient.bioavailability.food_source}% (food) vs ${nutrient.bioavailability.supplement_form}% (supplement)
- Key interactions: Enhances ${nutrient.interactions.enhances.join(', ')}
- Clinical evidence: ${nutrient.clinical_evidence.map(e => `${e.study_type} (${e.strength}): ${e.conclusion}`).join('; ')}
- Therapeutic doses: ${nutrient.therapeutic_doses.map(d => `${d.condition}: ${d.dose_range}`).join('; ')}
`
      }
      return ''
    }).filter(Boolean).join('\n')

    return therapeuticNutrients || 'No specific therapeutic protocols identified for current deficiencies.'
  }

  // Get advanced nutrient profile
  static getAdvancedNutrientProfile(nutrient: string): AdvancedNutrientProfile | null {
    return this.ADVANCED_NUTRIENTS[nutrient.toLowerCase()] || null
  }

  // Get meal timing recommendations
  static getMealTimingRecommendations(mealType: string): MealTimingInsight | null {
    return this.MEAL_TIMING.find(meal => meal.meal_type === mealType) || null
  }

  // Get circadian nutrition insights
  static getCircadianNutritionInsights(timeOfDay: string): CircadianNutrition | null {
    return this.CIRCADIAN_NUTRITION.find(phase => phase.time_of_day === timeOfDay) || null
  }
}
