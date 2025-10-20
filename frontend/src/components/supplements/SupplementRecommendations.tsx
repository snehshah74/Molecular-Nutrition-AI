import { useState, useEffect, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Pill, 
  Shield, 
  Brain, 
  Heart, 
  Zap, 
  Star,
  AlertTriangle,
  CheckCircle,
  Info,
  ExternalLink
} from 'lucide-react'
import type { UserProfile, DailyIntake } from '@/types'

interface Supplement {
  id: string
  name: string
  category: 'vitamin' | 'mineral' | 'probiotic' | 'herbal' | 'amino_acid' | 'omega3'
  priority: 'essential' | 'recommended' | 'optional'
  dosage: {
    amount: string
    frequency: string
    timing: string
    form: string
  }
  benefits: string[]
  molecularMechanisms: string[]
  clinicalEvidence: {
    studyType: string
    strength: 'Strong' | 'Moderate' | 'Weak'
    conclusion: string
  }[]
  contraindications: string[]
  interactions: string[]
  cost: {
    daily: number
    monthly: number
    quality: 'budget' | 'standard' | 'premium'
  }
  brandRecommendations: {
    name: string
    price: number
    rating: number
    notes: string
  }[]
  geneticConsiderations: string[]
  lifestyleFactors: string[]
}

interface SupplementRecommendationsProps {
  userProfile: UserProfile | null
  dailyIntake: DailyIntake | null
  onSupplementsSelected: (supplements: Supplement[]) => void
}

export const SupplementRecommendations = memo(function SupplementRecommendations({ 
  userProfile, 
  onSupplementsSelected 
}: SupplementRecommendationsProps) {
  const [selectedSupplements, setSelectedSupplements] = useState<Supplement[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [showDetails, setShowDetails] = useState<string | null>(null)
  const [filterPriority, setFilterPriority] = useState<string>('all')

  // Advanced supplement database
  const supplementDatabase: Supplement[] = [
    {
      id: 'vitamin_d3',
      name: 'Vitamin D3 (Cholecalciferol)',
      category: 'vitamin',
      priority: 'essential',
      dosage: {
        amount: '2000-4000 IU',
        frequency: 'Daily',
        timing: 'With fat-containing meal',
        form: 'Softgel or liquid'
      },
      benefits: [
        'Immune system support',
        'Bone health optimization',
        'Mood regulation',
        'Muscle function improvement',
        'Cardiovascular protection'
      ],
      molecularMechanisms: [
        'VDR activation regulates 200+ genes',
        'Enhances calcium absorption via TRPV6',
        'Modulates immune cell function',
        'Supports neurotransmitter synthesis'
      ],
      clinicalEvidence: [
        { studyType: 'Meta-analysis', strength: 'Strong', conclusion: 'Reduces respiratory infections by 12-70%' },
        { studyType: 'RCT', strength: 'Moderate', conclusion: 'May improve mood and cognitive function' }
      ],
      contraindications: ['Hypercalcemia', 'Sarcoidosis', 'Kidney stones'],
      interactions: ['Warfarin', 'Calcium supplements', 'Magnesium'],
      cost: { daily: 0.15, monthly: 4.50, quality: 'standard' },
      brandRecommendations: [
        { name: 'Thorne Vitamin D/K2', price: 32.95, rating: 4.8, notes: 'High potency with K2' },
        { name: 'Pure Encapsulations D3', price: 28.50, rating: 4.7, notes: 'Professional grade' }
      ],
      geneticConsiderations: ['VDR FokI variant affects receptor function', 'CYP2R1 variants influence synthesis'],
      lifestyleFactors: ['Limited sun exposure', 'Darker skin pigmentation', 'Age >50', 'Indoor lifestyle']
    },
    {
      id: 'omega3_epa_dha',
      name: 'Omega-3 EPA/DHA',
      category: 'omega3',
      priority: 'recommended',
      dosage: {
        amount: '1000-2000mg EPA+DHA',
        frequency: 'Daily',
        timing: 'With meals',
        form: 'Fish oil or algae oil'
      },
      benefits: [
        'Anti-inflammatory effects',
        'Brain health support',
        'Heart health protection',
        'Joint mobility improvement',
        'Cognitive function enhancement'
      ],
      molecularMechanisms: [
        'Inhibits NF-κB pathway',
        'Competes with omega-6 for COX enzymes',
        'Supports cell membrane fluidity',
        'Modulates gene expression'
      ],
      clinicalEvidence: [
        { studyType: 'Meta-analysis', strength: 'Strong', conclusion: 'Reduces cardiovascular mortality by 8%' },
        { studyType: 'RCT', strength: 'Moderate', conclusion: 'May improve depression symptoms' }
      ],
      contraindications: ['Bleeding disorders', 'Anticoagulant therapy'],
      interactions: ['Blood thinners', 'High-dose vitamin E'],
      cost: { daily: 0.35, monthly: 10.50, quality: 'premium' },
      brandRecommendations: [
        { name: 'Nordic Naturals Ultimate Omega', price: 39.95, rating: 4.9, notes: 'High concentration, no fishy taste' },
        { name: 'Viva Naturals Triple Strength', price: 24.99, rating: 4.6, notes: 'Good value, high potency' }
      ],
      geneticConsiderations: ['FADS1/2 variants affect conversion efficiency', 'COX2 variants influence response'],
      lifestyleFactors: ['Low fish intake', 'Plant-based diet', 'Inflammatory conditions', 'Cardiovascular risk']
    },
    {
      id: 'magnesium_glycinate',
      name: 'Magnesium Glycinate',
      category: 'mineral',
      priority: 'recommended',
      dosage: {
        amount: '200-400mg elemental',
        frequency: 'Daily',
        timing: 'Evening with food',
        form: 'Chelated glycinate'
      },
      benefits: [
        'Muscle relaxation',
        'Sleep quality improvement',
        'Stress reduction',
        'Energy production support',
        'Bone health maintenance'
      ],
      molecularMechanisms: [
        'Cofactor for 300+ enzymes',
        'Regulates calcium channels',
        'Supports ATP production',
        'Modulates GABA receptors'
      ],
      clinicalEvidence: [
        { studyType: 'RCT', strength: 'Strong', conclusion: 'Improves sleep quality and duration' },
        { studyType: 'Meta-analysis', strength: 'Moderate', conclusion: 'May reduce blood pressure' }
      ],
      contraindications: ['Kidney disease', 'Severe heart block'],
      interactions: ['Calcium', 'Zinc', 'Antibiotics'],
      cost: { daily: 0.25, monthly: 7.50, quality: 'standard' },
      brandRecommendations: [
        { name: 'Thorne Magnesium Bisglycinate', price: 29.95, rating: 4.8, notes: 'Highly bioavailable form' },
        { name: 'Pure Encapsulations Magnesium', price: 24.50, rating: 4.7, notes: 'Professional grade' }
      ],
      geneticConsiderations: ['TRPM6 variants affect absorption', 'SLC41A1 variants influence transport'],
      lifestyleFactors: ['High stress levels', 'Exercise intensity', 'Poor sleep', 'Alcohol consumption']
    },
    {
      id: 'probiotics_lactobacillus',
      name: 'Lactobacillus Probiotics',
      category: 'probiotic',
      priority: 'recommended',
      dosage: {
        amount: '10-50 billion CFU',
        frequency: 'Daily',
        timing: 'Empty stomach or with food',
        form: 'Capsules or powder'
      },
      benefits: [
        'Digestive health support',
        'Immune function enhancement',
        'Mood regulation',
        'Nutrient absorption improvement',
        'Antibiotic-associated diarrhea prevention'
      ],
      molecularMechanisms: [
        'Modulates gut microbiota composition',
        'Enhances gut barrier integrity',
        'Produces beneficial metabolites',
        'Regulates immune responses'
      ],
      clinicalEvidence: [
        { studyType: 'Meta-analysis', strength: 'Strong', conclusion: 'Reduces antibiotic-associated diarrhea by 42%' },
        { studyType: 'RCT', strength: 'Moderate', conclusion: 'May improve mood and anxiety' }
      ],
      contraindications: ['Immunocompromised individuals', 'Central line access'],
      interactions: ['Antibiotics', 'Immunosuppressants'],
      cost: { daily: 0.45, monthly: 13.50, quality: 'premium' },
      brandRecommendations: [
        { name: 'Garden of Life Dr. Formulated', price: 34.99, rating: 4.8, notes: 'Multi-strain, high potency' },
        { name: 'Renew Life Ultimate Flora', price: 28.95, rating: 4.6, notes: 'Stable shelf life' }
      ],
      geneticConsiderations: ['TLR2 variants affect recognition', 'NOD2 variants influence response'],
      lifestyleFactors: ['Antibiotic use', 'Poor diet', 'High stress', 'Digestive issues']
    },
    {
      id: 'curcumin',
      name: 'Curcumin (Turmeric Extract)',
      category: 'herbal',
      priority: 'optional',
      dosage: {
        amount: '500-1000mg',
        frequency: 'Daily',
        timing: 'With fat-containing meal',
        form: 'Standardized extract with piperine'
      },
      benefits: [
        'Anti-inflammatory effects',
        'Joint health support',
        'Cognitive function enhancement',
        'Cardiovascular protection',
        'Antioxidant activity'
      ],
      molecularMechanisms: [
        'Inhibits NF-κB pathway',
        'Modulates COX-2 expression',
        'Enhances antioxidant enzymes',
        'Supports neuroprotection'
      ],
      clinicalEvidence: [
        { studyType: 'Meta-analysis', strength: 'Strong', conclusion: 'Reduces inflammation markers by 25-40%' },
        { studyType: 'RCT', strength: 'Moderate', conclusion: 'May improve cognitive function in elderly' }
      ],
      contraindications: ['Gallbladder disease', 'Bleeding disorders'],
      interactions: ['Blood thinners', 'Diabetes medications'],
      cost: { daily: 0.30, monthly: 9.00, quality: 'premium' },
      brandRecommendations: [
        { name: 'Thorne Meriva-SF', price: 39.95, rating: 4.9, notes: 'Enhanced bioavailability' },
        { name: 'Life Extension Curcumin Elite', price: 29.99, rating: 4.7, notes: 'High potency with piperine' }
      ],
      geneticConsiderations: ['COX2 variants affect response', 'IL1B variants influence inflammation'],
      lifestyleFactors: ['Inflammatory conditions', 'Joint pain', 'Cognitive concerns', 'Cardiovascular risk']
    }
  ]

  const getFilteredSupplements = () => {
    let filtered = supplementDatabase

    if (activeCategory !== 'all') {
      filtered = filtered.filter(supp => supp.category === activeCategory)
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(supp => supp.priority === filterPriority)
    }

    // Filter based on user profile and intake
    if (userProfile) {
      filtered = filtered.filter(supplement => {
        // Check lifestyle factors
        const lifestyleMatch = supplement.lifestyleFactors.some(factor => {
          switch (factor) {
            case 'Limited sun exposure':
              return userProfile.region === 'Northern'
            case 'Plant-based diet':
              return userProfile.lifestyle === 'vegan' || userProfile.lifestyle === 'vegetarian'
            case 'High stress levels':
              return userProfile.healthGoals.includes('energy_boost') || userProfile.healthGoals.includes('mental_clarity')
            case 'Exercise intensity':
              return userProfile.healthGoals.includes('muscle_gain')
            default:
              return true
          }
        })

        // Check health goals alignment
        const goalMatch = supplement.benefits.some(benefit => {
          if (userProfile.healthGoals.includes('muscle_gain') && benefit.includes('muscle')) return true
          if (userProfile.healthGoals.includes('weight_loss') && benefit.includes('metabolism')) return true
          if (userProfile.healthGoals.includes('mental_clarity') && benefit.includes('cognitive')) return true
          if (userProfile.healthGoals.includes('immune_support') && benefit.includes('immune')) return true
          return false
        })

        return lifestyleMatch || goalMatch || supplement.priority === 'essential'
      })
    }

    return filtered
  }

  const toggleSupplement = (supplement: Supplement) => {
    setSelectedSupplements(prev => {
      const exists = prev.find(s => s.id === supplement.id)
      if (exists) {
        return prev.filter(s => s.id !== supplement.id)
      } else {
        return [...prev, supplement]
      }
    })
  }

  const categories = [
    { id: 'all', name: 'All', icon: Pill },
    { id: 'vitamin', name: 'Vitamins', icon: Shield },
    { id: 'mineral', name: 'Minerals', icon: Zap },
    { id: 'probiotic', name: 'Probiotics', icon: Brain },
    { id: 'herbal', name: 'Herbal', icon: Star },
    { id: 'omega3', name: 'Omega-3', icon: Heart }
  ]

  const priorities = [
    { id: 'all', name: 'All Priorities' },
    { id: 'essential', name: 'Essential' },
    { id: 'recommended', name: 'Recommended' },
    { id: 'optional', name: 'Optional' }
  ]

  const filteredSupplements = getFilteredSupplements()

  useEffect(() => {
    onSupplementsSelected(selectedSupplements)
  }, [selectedSupplements, onSupplementsSelected])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Pill className="h-6 w-6 text-primary-600" />
          Personalized Supplement Recommendations
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          AI-powered supplement recommendations based on your profile and nutrition analysis
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <div className="flex gap-2">
              {categories.map(category => {
                const Icon = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors ${
                      activeCategory === category.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {category.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priority
            </label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              {priorities.map(priority => (
                <option key={priority.id} value={priority.id}>
                  {priority.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Selected Supplements Summary */}
      {selectedSupplements.length > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-300">
                {selectedSupplements.length} Supplement{selectedSupplements.length > 1 ? 's' : ''} Selected
              </h3>
              <p className="text-sm text-green-700 dark:text-green-400">
                Estimated monthly cost: ${selectedSupplements.reduce((sum, supp) => sum + supp.cost.monthly, 0).toFixed(2)}
              </p>
            </div>
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
        </div>
      )}

      {/* Supplements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSupplements.map(supplement => {
          const isSelected = selectedSupplements.find(s => s.id === supplement.id)
          const priorityColor = {
            essential: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
            recommended: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
            optional: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
          }

          return (
            <motion.div
              key={supplement.id}
              className={`bg-white dark:bg-gray-800 rounded-xl border-2 transition-all ${
                isSelected 
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {supplement.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${priorityColor[supplement.priority]}`}>
                      {supplement.priority}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleSupplement(supplement)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-primary-600 bg-primary-600'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {isSelected && <CheckCircle className="h-4 w-4 text-white" />}
                  </button>
                </div>

                {/* Dosage */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Dosage
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {supplement.dosage.amount} • {supplement.dosage.frequency}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {supplement.dosage.timing}
                  </p>
                </div>

                {/* Key Benefits */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Key Benefits
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {supplement.benefits.slice(0, 3).map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Star className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cost */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Monthly cost:</span>
                    <span className="ml-2 font-semibold text-gray-900 dark:text-gray-100">
                      ${supplement.cost.monthly}
                    </span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    supplement.cost.quality === 'premium' ? 'bg-blue-100 text-blue-800' :
                    supplement.cost.quality === 'standard' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {supplement.cost.quality}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDetails(showDetails === supplement.id ? null : supplement.id)}
                    className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Info className="h-4 w-4 inline mr-1" />
                    Details
                  </button>
                  <button
                    onClick={() => window.open('https://examine.com', '_blank')}
                    className="px-3 py-2 text-sm bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Detailed Information */}
              <AnimatePresence>
                {showDetails === supplement.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-200 dark:border-gray-700 p-6"
                  >
                    <div className="space-y-4">
                      {/* Molecular Mechanisms */}
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                          Molecular Mechanisms
                        </h5>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          {supplement.molecularMechanisms.map((mechanism, index) => (
                            <li key={index}>• {mechanism}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Clinical Evidence */}
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                          Clinical Evidence
                        </h5>
                        <div className="space-y-2">
                          {supplement.clinicalEvidence.map((evidence, index) => (
                            <div key={index} className="bg-blue-50 dark:bg-blue-900/20 rounded p-2">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium text-blue-900 dark:text-blue-300">
                                  {evidence.studyType}
                                </span>
                                <span className={`px-1 py-0.5 text-xs rounded ${
                                  evidence.strength === 'Strong' ? 'bg-green-100 text-green-800' :
                                  evidence.strength === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {evidence.strength}
                                </span>
                              </div>
                              <p className="text-xs text-blue-800 dark:text-blue-200">
                                {evidence.conclusion}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Contraindications */}
                      {supplement.contraindications.length > 0 && (
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                            Contraindications
                          </h5>
                          <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                            {supplement.contraindications.map((contraindication, index) => (
                              <li key={index}>• {contraindication}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Brand Recommendations */}
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                          Recommended Brands
                        </h5>
                        <div className="space-y-2">
                          {supplement.brandRecommendations.map((brand, index) => (
                            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {brand.name}
                                </span>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 text-yellow-500" />
                                  <span className="text-xs text-gray-600 dark:text-gray-400">
                                    {brand.rating}
                                  </span>
                                </div>
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                ${brand.price} • {brand.notes}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {filteredSupplements.length === 0 && (
        <div className="text-center py-12">
          <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No supplements found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters to see more options.
          </p>
        </div>
      )}
    </div>
  )
})
