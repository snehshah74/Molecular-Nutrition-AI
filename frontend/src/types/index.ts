// User Profile Types
export interface UserProfile {
  id: string;
  name: string;
  age: number;
  sex: 'male' | 'female' | 'other';
  height: number; // in cm
  weight: number; // in kg
  ethnicity: string;
  region: string;
  medicalHistory: string[];
  lifestyle: 'vegan' | 'vegetarian' | 'omnivore' | 'pescatarian' | 'keto' | 'paleo';
  healthGoals: HealthGoal[];
  createdAt: Date;
  updatedAt: Date;
}

export type HealthGoal = 
  | 'muscle_gain'
  | 'weight_loss'
  | 'energy_boost'
  | 'longevity'
  | 'disease_prevention'
  | 'athletic_performance'
  | 'mental_clarity'
  | 'immune_support';

// Nutrition Types
export interface Nutrient {
  name: string;
  amount: number;
  unit: string;
  dailyValue?: number;
  status: 'excellent' | 'good' | 'warning' | 'poor' | 'critical';
}

export interface Macronutrient extends Nutrient {
  calories: number;
}

export interface Micronutrient extends Nutrient {
  category: 'vitamin' | 'mineral' | 'amino_acid' | 'fatty_acid';
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  macronutrients: {
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
    calories: number;
  };
  micronutrients: Micronutrient[];
  timestamp: Date;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  foodItems: FoodItem[];
  timestamp: Date;
  totalNutrients: {
    macronutrients: Macronutrient[];
    micronutrients: Micronutrient[];
  };
}

export interface DailyIntake {
  date: string;
  meals: Meal[];
  totalNutrients: {
    macronutrients: Macronutrient[];
    micronutrients: Micronutrient[];
  };
  molecularBalanceScore: number;
}

// AI Recommendation Types
export interface AIRecommendation {
  id: string;
  type: 'food_suggestion' | 'deficiency_alert' | 'optimization_tip' | 'health_insight';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  reasoning: string;
  suggestedFoods?: string[];
  targetNutrients?: string[];
  createdAt: Date;
  isRead: boolean;
}

// Progress Tracking Types
export interface ProgressData {
  date: string;
  molecularBalanceScore: number;
  nutrientTrends: {
    [nutrient: string]: {
      current: number;
      target: number;
      trend: 'improving' | 'stable' | 'declining';
    };
  };
  healthInsights: string[];
}

export interface TrendAnalysis {
  period: 'week' | 'month' | 'quarter' | 'year';
  data: ProgressData[];
  overallTrend: 'improving' | 'stable' | 'declining';
  keyInsights: string[];
  recommendations: string[];
}

// API Response Types
export interface NutritionAPIResponse {
  food: {
    name: string;
    nutrients: {
      [key: string]: number;
    };
  };
}

export interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// Form Types
export interface UserProfileFormData {
  name: string;
  age: number;
  sex: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  ethnicity: string;
  region: string;
  medicalHistory: string[];
  lifestyle: 'vegan' | 'vegetarian' | 'omnivore' | 'pescatarian' | 'keto' | 'paleo';
  healthGoals: HealthGoal[];
}

export interface FoodLogFormData {
  description: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: Date;
}

// Component Props Types
export interface ChartData {
  name: string;
  value: number;
  color?: string;
  target?: number;
}

export interface NutrientStatus {
  name: string;
  current: number;
  target: number;
  unit: string;
  status: 'excellent' | 'good' | 'warning' | 'poor' | 'critical';
  trend?: 'up' | 'down' | 'stable';
}

// Theme Types
export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// App State Types
export interface AppState {
  user: UserProfile | null;
  currentDate: string;
  dailyIntake: DailyIntake | null;
  recommendations: AIRecommendation[];
  progressData: ProgressData[];
  isLoading: boolean;
  error: string | null;
}
