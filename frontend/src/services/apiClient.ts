import axios from 'axios'
import { supabase } from '../lib/supabase'

const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3001/api'

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
apiClient.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  
  return config
})

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, try to refresh
      const { data: { session }, error: refreshError } = await supabase.auth.refreshSession()
      
      if (!refreshError && session) {
        // Retry the request with new token
        error.config.headers.Authorization = `Bearer ${session.access_token}`
        return axios.request(error.config)
      }
      
      // If refresh fails, redirect to login
      await supabase.auth.signOut()
    }
    
    return Promise.reject(error)
  }
)

// Profile API
export const profileAPI = {
  get: () => apiClient.get('/profile'),
  upsert: (data: any) => apiClient.post('/profile', data),
  update: (data: any) => apiClient.put('/profile', data),
  delete: () => apiClient.delete('/profile'),
}

// Meals API
export const mealsAPI = {
  getAll: (params?: { startDate?: string; endDate?: string }) => 
    apiClient.get('/meals', { params }),
  getById: (id: string) => apiClient.get(`/meals/${id}`),
  create: (data: any) => apiClient.post('/meals', data),
  update: (id: string, data: any) => apiClient.put(`/meals/${id}`, data),
  delete: (id: string) => apiClient.delete(`/meals/${id}`),
  getDailySummary: (date?: string) => 
    apiClient.get('/meals/summary/daily', { params: { date } }),
}

// Recommendations API
export const recommendationsAPI = {
  getAll: () => apiClient.get('/recommendations'),
  generate: () => apiClient.post('/recommendations/generate'),
  markAsRead: (id: string) => apiClient.put(`/recommendations/${id}/read`),
  delete: (id: string) => apiClient.delete(`/recommendations/${id}`),
}

// Biomarkers API
export const biomarkersAPI = {
  getAll: () => apiClient.get('/biomarkers'),
  getByDate: (date: string) => apiClient.get(`/biomarkers/${date}`),
  upsert: (data: any) => apiClient.post('/biomarkers', data),
  delete: (id: string) => apiClient.delete(`/biomarkers/${id}`),
}

// Nutrition API
export const nutritionAPI = {
  searchFood: (query: string) => apiClient.get('/nutrition/search', { params: { query } }),
  getFoodNutrition: (foodId: string) => apiClient.get(`/nutrition/food/${foodId}`),
  calculateNutrition: (foods: any[]) => apiClient.post('/nutrition/calculate', { foods }),
}

export default apiClient

