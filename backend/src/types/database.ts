// Supabase Database Types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          age: number
          sex: 'male' | 'female' | 'other'
          height: number
          weight: number
          ethnicity: string
          region: string
          lifestyle: 'vegan' | 'vegetarian' | 'omnivore' | 'pescatarian' | 'keto' | 'paleo'
          medical_history: string[]
          health_goals: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          age: number
          sex: 'male' | 'female' | 'other'
          height: number
          weight: number
          ethnicity: string
          region: string
          lifestyle: 'vegan' | 'vegetarian' | 'omnivore' | 'pescatarian' | 'keto' | 'paleo'
          medical_history: string[]
          health_goals: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          age?: number
          sex?: 'male' | 'female' | 'other'
          height?: number
          weight?: number
          ethnicity?: string
          region?: string
          lifestyle?: 'vegan' | 'vegetarian' | 'omnivore' | 'pescatarian' | 'keto' | 'paleo'
          medical_history?: string[]
          health_goals?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      meals: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          meal_time: string
          foods: any[]
          total_nutrition: any
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          meal_time: string
          foods: any[]
          total_nutrition: any
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          meal_time?: string
          foods?: any[]
          total_nutrition?: any
          created_at?: string
        }
      }
      biomarkers: {
        Row: {
          id: string
          user_id: string
          date: string
          blood_glucose: number | null
          cholesterol: number | null
          inflammation_markers: number | null
          vitamin_d: number | null
          b12: number | null
          iron: number | null
          omega3: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          blood_glucose?: number | null
          cholesterol?: number | null
          inflammation_markers?: number | null
          vitamin_d?: number | null
          b12?: number | null
          iron?: number | null
          omega3?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          blood_glucose?: number | null
          cholesterol?: number | null
          inflammation_markers?: number | null
          vitamin_d?: number | null
          b12?: number | null
          iron?: number | null
          omega3?: number | null
          created_at?: string
        }
      }
      molecular_balance: {
        Row: {
          id: string
          user_id: string
          date: string
          score: number
          protein_synthesis: number
          cognitive_function: number
          energy_levels: number
          inflammation_status: number
          metabolic_efficiency: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          score: number
          protein_synthesis: number
          cognitive_function: number
          energy_levels: number
          inflammation_status: number
          metabolic_efficiency: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          score?: number
          protein_synthesis?: number
          cognitive_function?: number
          energy_levels?: number
          inflammation_status?: number
          metabolic_efficiency?: number
          created_at?: string
        }
      }
      recommendations: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          category: string
          priority: 'low' | 'medium' | 'high'
          created_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          category: string
          priority: 'low' | 'medium' | 'high'
          created_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          category?: string
          priority?: 'low' | 'medium' | 'high'
          created_at?: string
          expires_at?: string | null
        }
      }
    }
  }
}

