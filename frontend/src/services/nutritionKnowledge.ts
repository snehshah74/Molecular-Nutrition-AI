// Comprehensive Nutrition Knowledge Base for AI Training

export interface NutritionFact {
  nutrient: string
  function: string
  sources: string[]
  dailyValue: { male: number; female: number; unit: string }
  deficiency: string[]
  excess: string[]
  molecularBenefits: string[]
  absorptionFactors: string[]
}

export interface FoodProfile {
  name: string
  category: string
  macronutrients: {
    protein: number
    carbohydrates: number
    fat: number
    fiber: number
    calories: number
  }
  micronutrients: { [key: string]: number }
  molecularCompounds: string[]
  healthBenefits: string[]
  preparationTips: string[]
  bioavailability: string
}

export class NutritionKnowledgeBase {
  // Comprehensive nutrient database
  static readonly NUTRIENTS: { [key: string]: NutritionFact } = {
    // Macronutrients
    protein: {
      nutrient: 'Protein',
      function: 'Essential for muscle synthesis, enzyme production, hormone regulation, and immune function',
      sources: ['Quinoa', 'Lentils', 'Chickpeas', 'Tempeh', 'Hemp seeds', 'Chia seeds', 'Spirulina', 'Greek yogurt', 'Eggs', 'Fish'],
      dailyValue: { male: 56, female: 46, unit: 'g' },
      deficiency: ['Muscle wasting', 'Weak immune system', 'Hair loss', 'Edema', 'Fatigue'],
      excess: ['Kidney stress', 'Dehydration', 'Bone loss'],
      molecularBenefits: ['Provides 9 essential amino acids', 'Supports collagen synthesis', 'Enhances neurotransmitter production'],
      absorptionFactors: ['Vitamin C enhances iron absorption', 'Consume with complex carbohydrates', 'Avoid excessive fiber during meals']
    },
    
    iron: {
      nutrient: 'Iron',
      function: 'Critical for oxygen transport, energy production, and cognitive function',
      sources: ['Spinach', 'Lentils', 'Quinoa', 'Dark chocolate', 'Pumpkin seeds', 'Beans', 'Fortified cereals', 'Red meat'],
      dailyValue: { male: 8, female: 18, unit: 'mg' },
      deficiency: ['Anemia', 'Fatigue', 'Cognitive impairment', 'Cold intolerance', 'Brittle nails'],
      excess: ['Organ damage', 'Oxidative stress', 'Constipation'],
      molecularBenefits: ['Forms hemoglobin for oxygen transport', 'Supports mitochondrial function', 'Essential for DNA synthesis'],
      absorptionFactors: ['Vitamin C increases absorption 6x', 'Avoid calcium and tannins', 'Heme iron (animal sources) more bioavailable']
    },
    
    vitaminC: {
      nutrient: 'Vitamin C',
      function: 'Powerful antioxidant, collagen synthesis, immune support, and iron absorption',
      sources: ['Citrus fruits', 'Bell peppers', 'Strawberries', 'Broccoli', 'Kiwi', 'Papaya', 'Brussels sprouts'],
      dailyValue: { male: 90, female: 75, unit: 'mg' },
      deficiency: ['Scurvy', 'Poor wound healing', 'Bleeding gums', 'Fatigue', 'Joint pain'],
      excess: ['Diarrhea', 'Kidney stones', 'Iron overload'],
      molecularBenefits: ['Regenerates vitamin E', 'Synthesizes collagen', 'Enhances iron absorption', 'Supports neurotransmitter synthesis'],
      absorptionFactors: ['Heat sensitive - consume raw', 'Water soluble - excess excreted', 'Smoking increases requirements']
    },
    
    omega3: {
      nutrient: 'Omega-3 Fatty Acids',
      function: 'Anti-inflammatory, brain health, heart protection, and joint mobility',
      sources: ['Flaxseeds', 'Chia seeds', 'Walnuts', 'Hemp seeds', 'Algae oil', 'Fatty fish', 'Seaweed'],
      dailyValue: { male: 1.6, female: 1.1, unit: 'g' },
      deficiency: ['Inflammation', 'Depression', 'Poor memory', 'Dry skin', 'Joint pain'],
      excess: ['Bleeding risk', 'Immune suppression'],
      molecularBenefits: ['Reduces inflammatory cytokines', 'Supports brain cell membranes', 'Regulates gene expression'],
      absorptionFactors: ['Consume with healthy fats', 'Avoid high heat cooking', 'Balance with omega-6']
    },
    
    magnesium: {
      nutrient: 'Magnesium',
      function: 'Muscle relaxation, energy production, bone health, and stress management',
      sources: ['Spinach', 'Pumpkin seeds', 'Almonds', 'Black beans', 'Quinoa', 'Dark chocolate', 'Avocado'],
      dailyValue: { male: 420, female: 320, unit: 'mg' },
      deficiency: ['Muscle cramps', 'Anxiety', 'Insomnia', 'High blood pressure', 'Osteoporosis'],
      excess: ['Diarrhea', 'Nausea', 'Low blood pressure'],
      molecularBenefits: ['Activates 300+ enzymes', 'Supports ATP production', 'Regulates calcium channels'],
      absorptionFactors: ['Vitamin D enhances absorption', 'Avoid excessive calcium', 'Stress depletes magnesium']
    },
    
    zinc: {
      nutrient: 'Zinc',
      function: 'Immune function, wound healing, taste perception, and hormone production',
      sources: ['Pumpkin seeds', 'Hemp seeds', 'Lentils', 'Chickpeas', 'Cashews', 'Quinoa', 'Oysters'],
      dailyValue: { male: 11, female: 8, unit: 'mg' },
      deficiency: ['Weak immunity', 'Slow healing', 'Loss of taste', 'Hair loss', 'Skin problems'],
      excess: ['Nausea', 'Copper deficiency', 'Immune suppression'],
      molecularBenefits: ['Essential for 100+ enzymes', 'Supports DNA repair', 'Regulates gene expression'],
      absorptionFactors: ['Phytates reduce absorption', 'Protein enhances absorption', 'Avoid excessive iron']
    },
    
    vitaminB12: {
      nutrient: 'Vitamin B12',
      function: 'Nerve function, red blood cell formation, and DNA synthesis',
      sources: ['Nutritional yeast', 'Fortified cereals', 'Algae supplements', 'Dairy products', 'Eggs', 'Meat'],
      dailyValue: { male: 2.4, female: 2.4, unit: 'mcg' },
      deficiency: ['Pernicious anemia', 'Neurological damage', 'Fatigue', 'Memory problems', 'Depression'],
      excess: ['Acne', 'Allergic reactions'],
      molecularBenefits: ['Essential for myelin sheath', 'Supports neurotransmitter synthesis', 'Prevents homocysteine buildup'],
      absorptionFactors: ['Requires intrinsic factor', 'Stomach acid needed', 'Vegans need supplementation']
    },
    
    folate: {
      nutrient: 'Folate',
      function: 'DNA synthesis, cell division, and neural tube development',
      sources: ['Dark leafy greens', 'Lentils', 'Chickpeas', 'Asparagus', 'Avocado', 'Citrus fruits', 'Beans'],
      dailyValue: { male: 400, female: 400, unit: 'mcg' },
      deficiency: ['Megaloblastic anemia', 'Birth defects', 'Depression', 'Cognitive decline'],
      excess: ['Masks B12 deficiency', 'Seizures'],
      molecularBenefits: ['Essential for DNA methylation', 'Supports neurotransmitter synthesis', 'Prevents neural tube defects'],
      absorptionFactors: ['Heat sensitive', 'Alcohol interferes', 'Some medications reduce absorption']
    },
    
    calcium: {
      nutrient: 'Calcium',
      function: 'Bone health, muscle contraction, nerve transmission, and blood clotting',
      sources: ['Kale', 'Broccoli', 'Almonds', 'Sesame seeds', 'Fortified plant milks', 'Dairy products', 'Sardines'],
      dailyValue: { male: 1000, female: 1000, unit: 'mg' },
      deficiency: ['Osteoporosis', 'Muscle cramps', 'Numbness', 'Abnormal heart rhythm'],
      excess: ['Kidney stones', 'Constipation', 'Interferes with iron absorption'],
      molecularBenefits: ['Forms hydroxyapatite in bones', 'Regulates muscle contraction', 'Supports blood clotting'],
      absorptionFactors: ['Vitamin D essential', 'Magnesium needed', 'Avoid excessive phosphorus']
    },
    
    vitaminD: {
      nutrient: 'Vitamin D',
      function: 'Bone health, immune function, mood regulation, and calcium absorption',
      sources: ['Sunlight', 'Mushrooms', 'Fortified foods', 'Fatty fish', 'Egg yolks', 'Supplements'],
      dailyValue: { male: 15, female: 15, unit: 'mcg' },
      deficiency: ['Rickets', 'Osteoporosis', 'Depression', 'Weak immunity', 'Muscle weakness'],
      excess: ['Hypercalcemia', 'Kidney damage', 'Nausea'],
      molecularBenefits: ['Regulates 200+ genes', 'Supports immune cell function', 'Enhances calcium absorption'],
      absorptionFactors: ['Fat-soluble vitamin', 'Sunlight exposure', 'Age reduces synthesis']
    }
  }

  // Food profiles with molecular insights
  static readonly FOODS: { [key: string]: FoodProfile } = {
    quinoa: {
      name: 'Quinoa',
      category: 'Complete Protein Grain',
      macronutrients: { protein: 8, carbohydrates: 39, fat: 3.5, fiber: 5, calories: 222 },
      micronutrients: { iron: 2.8, magnesium: 118, phosphorus: 281, folate: 78, zinc: 2.0 },
      molecularCompounds: ['Quercetin', 'Kaempferol', 'Saponins', 'Betaine'],
      healthBenefits: ['Complete protein source', 'Anti-inflammatory', 'Heart health', 'Blood sugar control'],
      preparationTips: ['Rinse before cooking', 'Toast for nutty flavor', 'Use 2:1 water ratio'],
      bioavailability: 'High - complete amino acid profile with excellent mineral absorption'
    },
    
    lentils: {
      name: 'Lentils',
      category: 'Legume',
      macronutrients: { protein: 18, carbohydrates: 40, fat: 1, fiber: 16, calories: 230 },
      micronutrients: { iron: 6.6, folate: 358, magnesium: 71, phosphorus: 356, zinc: 3.3 },
      molecularCompounds: ['Isoflavones', 'Saponins', 'Phytic acid', 'Resistant starch'],
      healthBenefits: ['Heart health', 'Blood sugar control', 'Digestive health', 'Weight management'],
      preparationTips: ['Soak overnight', 'Add kombu for digestibility', 'Cook with herbs'],
      bioavailability: 'Good - high protein and minerals, enhanced by vitamin C'
    },
    
    spinach: {
      name: 'Spinach',
      category: 'Dark Leafy Green',
      macronutrients: { protein: 3, carbohydrates: 3.6, fat: 0.4, fiber: 2.2, calories: 23 },
      micronutrients: { iron: 2.7, folate: 194, vitaminK: 483, vitaminA: 469, magnesium: 79 },
      molecularCompounds: ['Lutein', 'Zeaxanthin', 'Nitrates', 'Chlorophyll', 'Betaine'],
      healthBenefits: ['Eye health', 'Bone strength', 'Heart health', 'Cognitive function'],
      preparationTips: ['Eat raw or lightly steamed', 'Pair with vitamin C', 'Avoid overcooking'],
      bioavailability: 'Moderate - oxalates reduce mineral absorption, enhanced by cooking'
    },
    
    chiaSeeds: {
      name: 'Chia Seeds',
      category: 'Superfood Seed',
      macronutrients: { protein: 4.7, carbohydrates: 12, fat: 8.6, fiber: 10.6, calories: 137 },
      micronutrients: { calcium: 177, magnesium: 95, phosphorus: 265, omega3: 4.9 },
      molecularCompounds: ['Alpha-linolenic acid', 'Chlorogenic acid', 'Caffeic acid', 'Quercetin'],
      healthBenefits: ['Heart health', 'Blood sugar control', 'Hydration', 'Digestive health'],
      preparationTips: ['Soak for gel formation', 'Grind for better absorption', 'Store in refrigerator'],
      bioavailability: 'High - excellent omega-3 and mineral content with gel-forming properties'
    },
    
    hempSeeds: {
      name: 'Hemp Seeds',
      category: 'Complete Protein Seed',
      macronutrients: { protein: 9.5, carbohydrates: 2.6, fat: 14.6, fiber: 1.2, calories: 161 },
      micronutrients: { magnesium: 210, phosphorus: 700, zinc: 2.4, iron: 2.4 },
      molecularCompounds: ['Gamma-linolenic acid', 'Edestin protein', 'Phytosterols', 'Chlorophyll'],
      healthBenefits: ['Complete protein', 'Heart health', 'Skin health', 'Hormone balance'],
      preparationTips: ['Eat raw or lightly toasted', 'Add to smoothies', 'Store in refrigerator'],
      bioavailability: 'Excellent - complete amino acid profile with optimal omega-6:3 ratio'
    }
  }

  // Lifestyle-specific nutrition guidance
  static getLifestyleGuidance(lifestyle: string): string[] {
    const guidance: { [key: string]: string[] } = {
      vegan: [
        'Focus on complete proteins: quinoa, hemp seeds, chia seeds, and complementary combinations',
        'Ensure B12 supplementation or fortified foods',
        'Pair iron-rich foods with vitamin C for enhanced absorption',
        'Include omega-3 sources: flaxseeds, chia seeds, walnuts, algae oil',
        'Consume calcium-rich foods: kale, broccoli, almonds, fortified plant milks',
        'Consider zinc supplementation or include pumpkin seeds, hemp seeds regularly'
      ],
      vegetarian: [
        'Include dairy and eggs for complete protein and B12',
        'Focus on plant-based iron sources with vitamin C',
        'Ensure adequate omega-3 from plant sources',
        'Include fermented foods for better nutrient absorption',
        'Consider algae-based omega-3 supplements'
      ],
      omnivore: [
        'Balance plant and animal proteins for optimal amino acid profile',
        'Include fatty fish for omega-3 fatty acids',
        'Focus on lean proteins and limit processed meats',
        'Ensure adequate fiber from plant sources',
        'Include organ meats occasionally for micronutrients'
      ],
      keto: [
        'Focus on healthy fats: avocados, nuts, seeds, olive oil',
        'Ensure adequate electrolytes: sodium, potassium, magnesium',
        'Include non-starchy vegetables for micronutrients',
        'Consider MCT oil for ketone production',
        'Monitor protein intake to maintain ketosis'
      ],
      paleo: [
        'Focus on whole, unprocessed foods',
        'Include grass-fed meats and wild-caught fish',
        'Emphasize vegetables and fruits for micronutrients',
        'Include nuts and seeds for healthy fats',
        'Avoid grains, legumes, and dairy'
      ]
    }
    return guidance[lifestyle] || guidance.omnivore
  }

  // Health goal-specific recommendations
  static getHealthGoalRecommendations(goals: string[]): { [key: string]: string[] } {
    const recommendations: { [key: string]: { [key: string]: string[] } } = {
      muscle_gain: {
        protein: ['Aim for 1.6-2.2g protein per kg body weight', 'Include complete proteins at each meal', 'Consider leucine-rich foods for muscle synthesis'],
        timing: ['Consume protein within 2 hours post-workout', 'Include protein in pre-workout meal', 'Distribute protein evenly throughout day'],
        nutrients: ['Ensure adequate zinc for testosterone production', 'Include magnesium for muscle relaxation', 'Consider creatine supplementation']
      },
      weight_loss: {
        calories: ['Create moderate calorie deficit (500-750 kcal/day)', 'Focus on nutrient-dense, low-calorie foods', 'Include fiber for satiety'],
        macronutrients: ['Increase protein to 25-30% of calories', 'Include healthy fats for hormone production', 'Choose complex carbohydrates'],
        timing: ['Consider intermittent fasting', 'Eat protein with each meal', 'Avoid late-night eating']
      },
      energy_boost: {
        nutrients: ['Ensure adequate iron for oxygen transport', 'Include B-vitamins for energy metabolism', 'Consider magnesium for ATP production'],
        foods: ['Include complex carbohydrates for sustained energy', 'Add nuts and seeds for healthy fats', 'Stay hydrated'],
        lifestyle: ['Optimize sleep quality', 'Manage stress levels', 'Consider adaptogenic herbs']
      },
      mental_clarity: {
        nutrients: ['Include omega-3 fatty acids for brain health', 'Ensure adequate B12 and folate', 'Consider choline-rich foods'],
        foods: ['Blueberries for antioxidants', 'Dark leafy greens for folate', 'Nuts and seeds for vitamin E'],
        lifestyle: ['Maintain stable blood sugar', 'Stay hydrated', 'Consider meditation and exercise']
      },
      immune_support: {
        nutrients: ['Ensure adequate vitamin C and D', 'Include zinc for immune function', 'Consider probiotics for gut health'],
        foods: ['Citrus fruits for vitamin C', 'Mushrooms for vitamin D', 'Fermented foods for probiotics'],
        lifestyle: ['Manage stress levels', 'Get adequate sleep', 'Exercise regularly']
      }
    }

    const result: { [key: string]: string[] } = {}
    goals.forEach(goal => {
      if (recommendations[goal]) {
        Object.keys(recommendations[goal]).forEach(category => {
          if (!result[category]) result[category] = []
          result[category].push(...recommendations[goal][category])
        })
      }
    })
    return result
  }

  // Molecular nutrition insights
  static getMolecularInsights(nutrient: string): string[] {
    const insights: { [key: string]: string[] } = {
      protein: [
        'Proteins are composed of 20 amino acids, 9 of which are essential',
        'Complete proteins contain all essential amino acids in optimal ratios',
        'Protein synthesis requires adequate energy and micronutrients',
        'Amino acids serve as precursors for neurotransmitters and hormones'
      ],
      iron: [
        'Iron exists in two forms: heme (animal) and non-heme (plant)',
        'Heme iron has 15-35% absorption vs 2-20% for non-heme',
        'Vitamin C can increase non-heme iron absorption by 6-fold',
        'Iron is essential for oxygen transport via hemoglobin and myoglobin'
      ],
      omega3: [
        'Omega-3 fatty acids are essential for cell membrane fluidity',
        'EPA and DHA are the most bioactive forms',
        'Omega-3s compete with omega-6s for enzyme binding sites',
        'Optimal omega-6:3 ratio is 4:1 or lower'
      ],
      magnesium: [
        'Magnesium is a cofactor for over 300 enzymatic reactions',
        'It regulates calcium channels and muscle contraction',
        'Stress and exercise increase magnesium requirements',
        'Magnesium deficiency is common due to soil depletion'
      ]
    }
    return insights[nutrient] || []
  }
}
