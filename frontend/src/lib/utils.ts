import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date utilities
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function formatTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

export function getDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

// Nutrition utilities
export function calculateNutrientStatus(current: number, target: number): 'excellent' | 'good' | 'warning' | 'poor' | 'critical' {
  const percentage = (current / target) * 100
  
  if (percentage >= 100) return 'excellent'
  if (percentage >= 80) return 'good'
  if (percentage >= 60) return 'warning'
  if (percentage >= 40) return 'poor'
  return 'critical'
}

export function getNutrientStatusColor(status: string): string {
  switch (status) {
    case 'excellent':
      return 'text-green-600 dark:text-green-400'
    case 'good':
      return 'text-blue-600 dark:text-blue-400'
    case 'warning':
      return 'text-yellow-600 dark:text-yellow-400'
    case 'poor':
      return 'text-orange-600 dark:text-orange-400'
    case 'critical':
      return 'text-red-600 dark:text-red-400'
    default:
      return 'text-gray-600 dark:text-gray-400'
  }
}

export function getNutrientStatusBgColor(status: string): string {
  switch (status) {
    case 'excellent':
      return 'bg-green-100 dark:bg-green-900'
    case 'good':
      return 'bg-blue-100 dark:bg-blue-900'
    case 'warning':
      return 'bg-yellow-100 dark:bg-yellow-900'
    case 'poor':
      return 'bg-orange-100 dark:bg-orange-900'
    case 'critical':
      return 'bg-red-100 dark:bg-red-900'
    default:
      return 'bg-gray-100 dark:bg-gray-900'
  }
}

// Molecular Balance Score calculation
export function calculateMolecularBalanceScore(nutrients: Array<{ current: number; target: number }>): number {
  if (nutrients.length === 0) return 0
  
  const scores = nutrients.map(nutrient => {
    const ratio = nutrient.current / nutrient.target
    // Score based on how close to target (100% = 100 points, 80%+ = good score)
    if (ratio >= 1.0) return 100
    if (ratio >= 0.8) return 80 + (ratio - 0.8) * 100 // 80-100 points
    if (ratio >= 0.6) return 60 + (ratio - 0.6) * 100 // 60-80 points
    if (ratio >= 0.4) return 40 + (ratio - 0.4) * 100 // 40-60 points
    return Math.max(0, ratio * 100) // 0-40 points
  })
  
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
}

// Food parsing utilities
export function parseFoodDescription(description: string): { quantity: number; unit: string; food: string } {
  const match = description.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)\s+(.+)$/)
  if (match) {
    return {
      quantity: parseFloat(match[1]),
      unit: match[2],
      food: match[3].trim()
    }
  }
  
  // Fallback for simple descriptions
  return {
    quantity: 1,
    unit: 'serving',
    food: description
  }
}

// Validation utilities
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateAge(age: number): boolean {
  return age >= 1 && age <= 120
}

// Local storage utilities
export function saveToLocalStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Failed to load from localStorage:', error)
    return defaultValue
  }
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Generate unique IDs
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// Format numbers
export function formatNumber(num: number, decimals: number = 1): string {
  return num.toFixed(decimals)
}

export function formatPercentage(num: number, decimals: number = 0): string {
  return `${formatNumber(num, decimals)}%`
}

// Color utilities for charts
export function getChartColor(index: number): string {
  const colors = [
    '#3B82F6', // blue
    '#10B981', // emerald
    '#F59E0B', // amber
    '#EF4444', // red
    '#8B5CF6', // violet
    '#06B6D4', // cyan
    '#84CC16', // lime
    '#F97316', // orange
  ]
  return colors[index % colors.length]
}

// Responsive breakpoint utilities
export function isMobile(): boolean {
  return window.innerWidth < 768
}

export function isTablet(): boolean {
  return window.innerWidth >= 768 && window.innerWidth < 1024
}

export function isDesktop(): boolean {
  return window.innerWidth >= 1024
}
