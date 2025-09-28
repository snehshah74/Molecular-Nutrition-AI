import { useState, memo } from 'react'
import { motion } from 'framer-motion'
import { 
  Brain, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Trophy, 
  BookOpen,
  Zap,
  Target,
  Award
} from 'lucide-react'

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  molecularInsight: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
}

interface QuizResult {
  score: number
  totalQuestions: number
  percentage: number
  correctAnswers: number
  incorrectAnswers: number
  timeSpent: number
  categoryScores: { [key: string]: number }
}

interface NutritionQuizProps {
  userProfile: any
  onQuizComplete: (result: QuizResult) => void
}

export const NutritionQuiz = memo(function NutritionQuiz({ 
  onQuizComplete 
}: NutritionQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [answers, setAnswers] = useState<{ [key: string]: number }>({})
  const [startTime, setStartTime] = useState<number>(0)
  const [result, setResult] = useState<QuizResult | null>(null)

  // Advanced nutrition quiz questions
  const quizQuestions: QuizQuestion[] = [
    {
      id: '1',
      question: 'Which nutrient enhances iron absorption by up to 6-fold when consumed together?',
      options: [
        'Vitamin D',
        'Vitamin C',
        'Vitamin B12',
        'Vitamin E'
      ],
      correctAnswer: 1,
      explanation: 'Vitamin C significantly enhances non-heme iron absorption by reducing ferric iron to ferrous iron, making it more bioavailable.',
      molecularInsight: 'Vitamin C acts as a reducing agent, converting Fe³⁺ to Fe²⁺, which is the form required for intestinal absorption via DMT1 transporter.',
      difficulty: 'intermediate',
      category: 'Nutrient Interactions'
    },
    {
      id: '2',
      question: 'What is the optimal omega-6 to omega-3 ratio for reducing inflammation?',
      options: [
        '10:1',
        '4:1',
        '20:1',
        '1:1'
      ],
      correctAnswer: 1,
      explanation: 'A 4:1 or lower ratio of omega-6 to omega-3 fatty acids is optimal for reducing chronic inflammation and supporting cardiovascular health.',
      molecularInsight: 'Omega-6 and omega-3 fatty acids compete for the same desaturase enzymes. Lower ratios favor anti-inflammatory EPA/DHA production.',
      difficulty: 'advanced',
      category: 'Fatty Acids'
    },
    {
      id: '3',
      question: 'Which form of magnesium has the highest bioavailability?',
      options: [
        'Magnesium Oxide',
        'Magnesium Glycinate',
        'Magnesium Sulfate',
        'Magnesium Carbonate'
      ],
      correctAnswer: 1,
      explanation: 'Magnesium glycinate has the highest bioavailability (80%) due to its chelated form, which enhances absorption and reduces gastrointestinal side effects.',
      molecularInsight: 'Chelated magnesium (bound to amino acids) bypasses the limited solubility issues of inorganic forms and utilizes amino acid transporters.',
      difficulty: 'advanced',
      category: 'Supplements'
    },
    {
      id: '4',
      question: 'What is the primary function of the MTHFR gene in nutrition?',
      options: [
        'Protein synthesis',
        'Folate metabolism',
        'Iron absorption',
        'Vitamin D activation'
      ],
      correctAnswer: 1,
      explanation: 'MTHFR (Methylenetetrahydrofolate reductase) is crucial for folate metabolism and methylation processes, affecting B12 utilization and DNA synthesis.',
      molecularInsight: 'MTHFR converts 5,10-methylenetetrahydrofolate to 5-methyltetrahydrofolate, the active form needed for homocysteine remethylation.',
      difficulty: 'advanced',
      category: 'Genetics'
    },
    {
      id: '5',
      question: 'Which nutrient is most critical for neurotransmitter synthesis?',
      options: [
        'Vitamin C',
        'Vitamin B6',
        'Iron',
        'Calcium'
      ],
      correctAnswer: 1,
      explanation: 'Vitamin B6 is essential as a cofactor for neurotransmitter synthesis, including serotonin, dopamine, and GABA production.',
      molecularInsight: 'B6-dependent enzymes (AADC, GAD) are rate-limiting steps in neurotransmitter synthesis pathways.',
      difficulty: 'intermediate',
      category: 'Brain Health'
    },
    {
      id: '6',
      question: 'What is the molecular mechanism by which curcumin exerts anti-inflammatory effects?',
      options: [
        'Direct antioxidant scavenging',
        'NF-κB pathway inhibition',
        'COX enzyme activation',
        'Histamine release'
      ],
      correctAnswer: 1,
      explanation: 'Curcumin primarily works by inhibiting the NF-κB pathway, reducing the production of pro-inflammatory cytokines like TNF-α and IL-6.',
      molecularInsight: 'Curcumin blocks IκB kinase, preventing NF-κB nuclear translocation and subsequent inflammatory gene expression.',
      difficulty: 'advanced',
      category: 'Phytonutrients'
    },
    {
      id: '7',
      question: 'Which amino acid is most critical for muscle protein synthesis?',
      options: [
        'Tryptophan',
        'Leucine',
        'Glycine',
        'Proline'
      ],
      correctAnswer: 1,
      explanation: 'Leucine is the key amino acid that triggers mTOR pathway activation, initiating muscle protein synthesis.',
      molecularInsight: 'Leucine acts as a molecular switch, activating mTORC1 which phosphorylates S6K1 and 4E-BP1 to initiate translation.',
      difficulty: 'intermediate',
      category: 'Protein'
    },
    {
      id: '8',
      question: 'What is the primary mechanism of circadian nutrition timing?',
      options: [
        'Digestive enzyme activity',
        'Hormone secretion patterns',
        'Blood glucose regulation',
        'All of the above'
      ],
      correctAnswer: 3,
      explanation: 'Circadian nutrition timing optimizes metabolic processes by aligning food intake with natural hormone rhythms, digestive capacity, and glucose sensitivity.',
      molecularInsight: 'Circadian clocks in peripheral tissues regulate glucose transporters, digestive enzymes, and metabolic gene expression in time-dependent patterns.',
      difficulty: 'advanced',
      category: 'Chronobiology'
    },
    {
      id: '9',
      question: 'Which probiotic strain has the strongest evidence for mood support?',
      options: [
        'Lactobacillus acidophilus',
        'Bifidobacterium longum',
        'Lactobacillus helveticus',
        'Saccharomyces boulardii'
      ],
      correctAnswer: 2,
      explanation: 'Lactobacillus helveticus has the strongest clinical evidence for reducing anxiety and improving mood through the gut-brain axis.',
      molecularInsight: 'L. helveticus produces GABA and modulates tryptophan metabolism, affecting serotonin synthesis and neuroinflammation.',
      difficulty: 'advanced',
      category: 'Microbiome'
    },
    {
      id: '10',
      question: 'What is the molecular basis for vitamin D\'s immune-modulating effects?',
      options: [
        'Direct antimicrobial action',
        'VDR gene regulation',
        'Antioxidant properties',
        'Hormone synthesis'
      ],
      correctAnswer: 1,
      explanation: 'Vitamin D regulates over 200 genes through the vitamin D receptor (VDR), including immune system genes that control inflammation and pathogen defense.',
      molecularInsight: 'VDR binding to vitamin D response elements (VDREs) regulates transcription of antimicrobial peptides like cathelicidin and defensins.',
      difficulty: 'advanced',
      category: 'Immune Function'
    }
  ]

  const startQuiz = () => {
    setQuizStarted(true)
    setStartTime(Date.now())
    setCurrentQuestionIndex(0)
    setAnswers({})
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      const currentQuestion = quizQuestions[currentQuestionIndex]
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: selectedAnswer
      }))

      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
        setSelectedAnswer(null)
        setShowExplanation(false)
      } else {
        completeQuiz()
      }
    } else {
      setShowExplanation(true)
    }
  }

  const completeQuiz = () => {
    const endTime = Date.now()
    const timeSpent = Math.round((endTime - startTime) / 1000)
    
    let correctAnswers = 0
    let categoryScores: { [key: string]: number } = {}
    
    quizQuestions.forEach(question => {
      const userAnswer = answers[question.id]
      const isCorrect = userAnswer === question.correctAnswer
      
      if (isCorrect) {
        correctAnswers++
      }
      
      if (!categoryScores[question.category]) {
        categoryScores[question.category] = 0
      }
      if (isCorrect) {
        categoryScores[question.category]++
      }
    })

    const quizResult: QuizResult = {
      score: correctAnswers,
      totalQuestions: quizQuestions.length,
      percentage: Math.round((correctAnswers / quizQuestions.length) * 100),
      correctAnswers,
      incorrectAnswers: quizQuestions.length - correctAnswers,
      timeSpent,
      categoryScores
    }

    setResult(quizResult)
    setQuizCompleted(true)
    onQuizComplete(quizResult)
  }

  const resetQuiz = () => {
    setQuizStarted(false)
    setQuizCompleted(false)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setAnswers({})
    setResult(null)
  }

  const currentQuestion = quizQuestions[currentQuestionIndex]
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer

  if (!quizStarted) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
          <Brain className="h-16 w-16 text-primary-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Molecular Nutrition Quiz
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Test your knowledge of molecular nutrition, nutrient interactions, and advanced nutrition science.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <BookOpen className="h-6 w-6 text-primary-600 mx-auto mb-2" />
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {quizQuestions.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Questions</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <Target className="h-6 w-6 text-primary-600 mx-auto mb-2" />
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Advanced
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Level</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <Zap className="h-6 w-6 text-primary-600 mx-auto mb-2" />
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                15 min
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Estimated</div>
            </div>
          </div>

          <motion.button
            onClick={startQuiz}
            className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 mx-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Brain className="h-5 w-5" />
            Start Quiz
          </motion.button>
        </div>
      </div>
    )
  }

  if (quizCompleted && result) {
    const getScoreMessage = (percentage: number) => {
      if (percentage >= 90) return { message: "Outstanding! You're a molecular nutrition expert!", color: "text-green-600", icon: Trophy }
      if (percentage >= 80) return { message: "Excellent! Great understanding of nutrition science!", color: "text-blue-600", icon: Award }
      if (percentage >= 70) return { message: "Good job! Solid nutrition knowledge!", color: "text-yellow-600", icon: Target }
      return { message: "Keep learning! Nutrition science is complex.", color: "text-orange-600", icon: BookOpen }
    }

    const scoreInfo = getScoreMessage(result.percentage)
    const ScoreIcon = scoreInfo.icon

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
          <ScoreIcon className={`h-16 w-16 ${scoreInfo.color} mx-auto mb-4`} />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Quiz Complete!
          </h2>
          <p className={`text-lg font-semibold ${scoreInfo.color} mb-4`}>
            {scoreInfo.message}
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
            <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {result.percentage}%
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              {result.correctAnswers} out of {result.totalQuestions} correct
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Time: {Math.floor(result.timeSpent / 60)}m {result.timeSpent % 60}s
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-lg font-semibold text-green-700 dark:text-green-300">
                {result.correctAnswers}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">Correct</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <XCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
              <div className="text-lg font-semibold text-red-700 dark:text-red-300">
                {result.incorrectAnswers}
              </div>
              <div className="text-sm text-red-600 dark:text-red-400">Incorrect</div>
            </div>
          </div>

          <motion.button
            onClick={resetQuiz}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 mx-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RotateCcw className="h-4 w-4" />
            Retake Quiz
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Question {currentQuestionIndex + 1} of {quizQuestions.length}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(((currentQuestionIndex + 1) / quizQuestions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-primary-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-2 py-1 text-xs rounded-full ${
              currentQuestion.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
              currentQuestion.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {currentQuestion.difficulty}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {currentQuestion.category}
            </span>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            {currentQuestion.question}
          </h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedAnswer === index
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedAnswer === index
                      ? 'border-primary-600 bg-primary-600'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {selectedAnswer === index && (
                      <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                    )}
                  </div>
                  <span className="text-gray-900 dark:text-gray-100">{option}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Explanation */}
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6"
          >
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
              )}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </h4>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  {currentQuestion.explanation}
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-3">
                  <h5 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                    Molecular Insight:
                  </h5>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {currentQuestion.molecularInsight}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Time: {Math.floor((Date.now() - startTime) / 1000)}s
          </div>
          <motion.button
            onClick={handleNextQuestion}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {currentQuestionIndex === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </motion.button>
        </div>
      </div>
    </div>
  )
})
