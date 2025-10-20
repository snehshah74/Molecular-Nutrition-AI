import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Enable email confirmation and PKCE flow
    flowType: 'pkce'
  }
})

// Database types
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
      genetic_data: {
        Row: {
          id: string
          user_id: string
          genetic_variants: Record<string, any>
          metabolism_genes: Record<string, any>
          nutrient_absorption: Record<string, any>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          genetic_variants: Record<string, any>
          metabolism_genes: Record<string, any>
          nutrient_absorption: Record<string, any>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          genetic_variants?: Record<string, any>
          metabolism_genes?: Record<string, any>
          nutrient_absorption?: Record<string, any>
          created_at?: string
          updated_at?: string
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
    }
  }
}
