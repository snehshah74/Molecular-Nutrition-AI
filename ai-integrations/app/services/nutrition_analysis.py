"""
Healthcare-focused nutrition analysis service
"""

import numpy as np
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)

class NutritionAnalysisService:
    """Advanced nutrition analysis with healthcare insights"""
    
    def __init__(self):
        self.nutrient_requirements = {
            'protein': {'male': 56, 'female': 46},  # grams per day
            'carbs': {'male': 300, 'female': 250},  # grams per day
            'fat': {'male': 70, 'female': 60},      # grams per day
            'fiber': {'male': 38, 'female': 25},   # grams per day
            'vitamin_c': {'male': 90, 'female': 75}, # mg per day
            'vitamin_d': {'male': 20, 'female': 20}, # mcg per day
            'calcium': {'male': 1000, 'female': 1000}, # mg per day
            'iron': {'male': 8, 'female': 18},      # mg per day
        }
        
        self.health_conditions = {
            'diabetes': {
                'nutrients': ['carbs', 'fiber', 'vitamin_d'],
                'biomarkers': ['glucose', 'hba1c'],
                'recommendations': [
                    'Focus on low glycemic index foods',
                    'Increase fiber intake',
                    'Monitor blood glucose regularly',
                    'Consider vitamin D supplementation'
                ]
            },
            'hypertension': {
                'nutrients': ['sodium', 'potassium', 'magnesium'],
                'biomarkers': ['blood_pressure_systolic', 'blood_pressure_diastolic'],
                'recommendations': [
                    'Reduce sodium intake to <2g per day',
                    'Increase potassium-rich foods',
                    'Consider DASH diet',
                    'Regular blood pressure monitoring'
                ]
            },
            'cardiovascular': {
                'nutrients': ['fat', 'fiber', 'omega3'],
                'biomarkers': ['cholesterol', 'hdl', 'ldl', 'triglycerides'],
                'recommendations': [
                    'Reduce saturated fat intake',
                    'Increase omega-3 fatty acids',
                    'Focus on soluble fiber',
                    'Regular lipid panel monitoring'
                ]
            }
        }
    
    def calculate_molecular_balance_score(self, user_profile: Dict, meals: List[Dict]) -> float:
        """Calculate molecular balance score based on nutrition and health factors"""
        try:
            # Calculate daily nutrition totals
            daily_nutrition = self._calculate_daily_nutrition(meals)
            
            # Get user requirements
            sex = user_profile.get('sex', 'male')
            age = user_profile.get('age', 30)
            weight = user_profile.get('weight', 70)
            height = user_profile.get('height', 170)
            
            # Calculate BMI
            bmi = weight / (height / 100) ** 2
            
            # Base score
            score = 50
            
            # Macronutrient balance (40% of score)
            macro_score = self._calculate_macro_balance(daily_nutrition, sex)
            score += macro_score * 0.4
            
            # Micronutrient adequacy (30% of score)
            micro_score = self._calculate_micro_adequacy(daily_nutrition, sex, age)
            score += micro_score * 0.3
            
            # Health factor adjustments (20% of score)
            health_score = self._calculate_health_factors(user_profile, daily_nutrition)
            score += health_score * 0.2
            
            # Lifestyle factors (10% of score)
            lifestyle_score = self._calculate_lifestyle_score(user_profile)
            score += lifestyle_score * 0.1
            
            return max(0, min(100, score))
            
        except Exception as e:
            logger.error(f"Error calculating molecular balance score: {e}")
            return 50  # Default score
    
    def _calculate_daily_nutrition(self, meals: List[Dict]) -> Dict:
        """Calculate total daily nutrition from meals"""
        totals = {
            'protein': 0, 'carbs': 0, 'fat': 0, 'fiber': 0,
            'vitamin_c': 0, 'vitamin_d': 0, 'calcium': 0, 'iron': 0,
            'sodium': 0, 'sugar': 0, 'calories': 0
        }
        
        for meal in meals:
            nutrition = meal.get('total_nutrition', {})
            for nutrient, value in nutrition.items():
                if nutrient in totals:
                    totals[nutrient] += float(value) if value else 0
        
        return totals
    
    def _calculate_macro_balance(self, nutrition: Dict, sex: str) -> float:
        """Calculate macronutrient balance score"""
        protein = nutrition.get('protein', 0)
        carbs = nutrition.get('carbs', 0)
        fat = nutrition.get('fat', 0)
        
        # Calculate ratios
        total_calories = protein * 4 + carbs * 4 + fat * 9
        if total_calories == 0:
            return 0
        
        protein_ratio = (protein * 4) / total_calories
        carb_ratio = (carbs * 4) / total_calories
        fat_ratio = (fat * 9) / total_calories
        
        score = 0
        
        # Protein ratio (optimal: 0.2-0.3)
        if 0.2 <= protein_ratio <= 0.3:
            score += 30
        elif 0.15 <= protein_ratio <= 0.35:
            score += 20
        elif 0.1 <= protein_ratio <= 0.4:
            score += 10
        
        # Carb ratio (optimal: 0.4-0.6)
        if 0.4 <= carb_ratio <= 0.6:
            score += 30
        elif 0.3 <= carb_ratio <= 0.7:
            score += 20
        elif 0.2 <= carb_ratio <= 0.8:
            score += 10
        
        # Fat ratio (optimal: 0.2-0.3)
        if 0.2 <= fat_ratio <= 0.3:
            score += 30
        elif 0.15 <= fat_ratio <= 0.35:
            score += 20
        elif 0.1 <= fat_ratio <= 0.4:
            score += 10
        
        return score
    
    def _calculate_micro_adequacy(self, nutrition: Dict, sex: str, age: int) -> float:
        """Calculate micronutrient adequacy score"""
        score = 0
        requirements = self.nutrient_requirements
        
        micronutrients = ['fiber', 'vitamin_c', 'vitamin_d', 'calcium', 'iron']
        
        for nutrient in micronutrients:
            current = nutrition.get(nutrient, 0)
            required = requirements[nutrient][sex]
            
            # Age adjustments
            if age > 50 and nutrient == 'vitamin_d':
                required *= 1.5
            if age > 50 and nutrient == 'calcium':
                required *= 1.2
            
            adequacy = min(1.0, current / required) if required > 0 else 0
            score += adequacy * 20  # 20 points per micronutrient
        
        return score
    
    def _calculate_health_factors(self, user_profile: Dict, nutrition: Dict) -> float:
        """Calculate health factor adjustments"""
        score = 0
        
        # Medical history adjustments
        medical_history = user_profile.get('medical_history', [])
        
        if 'diabetes' in medical_history:
            # Check diabetes-friendly nutrition
            carbs = nutrition.get('carbs', 0)
            fiber = nutrition.get('fiber', 0)
            if carbs < 200 and fiber > 25:
                score += 10
            else:
                score -= 10
        
        if 'hypertension' in medical_history:
            # Check sodium intake
            sodium = nutrition.get('sodium', 0)
            if sodium < 2000:
                score += 10
            else:
                score -= 15
        
        if 'heart_disease' in medical_history:
            # Check fat quality
            fat = nutrition.get('fat', 0)
            if fat < 80:
                score += 10
            else:
                score -= 10
        
        return score
    
    def _calculate_lifestyle_score(self, user_profile: Dict) -> float:
        """Calculate lifestyle factor score"""
        score = 0
        
        activity_level = user_profile.get('activity_level', 'sedentary')
        activity_scores = {
            'sedentary': 0,
            'light': 10,
            'moderate': 20,
            'active': 30,
            'very_active': 40
        }
        
        score += activity_scores.get(activity_level, 0)
        
        # Health goals bonus
        health_goals = user_profile.get('health_goals', [])
        if 'general_health' in health_goals:
            score += 5
        if 'weight_loss' in health_goals:
            score += 5
        if 'muscle_gain' in health_goals:
            score += 5
        
        return score
    
    def analyze_macronutrients(self, meals: List[Dict]) -> Dict:
        """Analyze macronutrient distribution and quality"""
        daily_nutrition = self._calculate_daily_nutrition(meals)
        
        protein = daily_nutrition.get('protein', 0)
        carbs = daily_nutrition.get('carbs', 0)
        fat = daily_nutrition.get('fat', 0)
        calories = daily_nutrition.get('calories', 0)
        
        total_calories = protein * 4 + carbs * 4 + fat * 9
        
        return {
            'total_calories': total_calories,
            'protein': {
                'grams': protein,
                'calories': protein * 4,
                'percentage': (protein * 4 / total_calories * 100) if total_calories > 0 else 0,
                'quality': 'excellent' if protein >= 80 else 'good' if protein >= 60 else 'needs_improvement'
            },
            'carbs': {
                'grams': carbs,
                'calories': carbs * 4,
                'percentage': (carbs * 4 / total_calories * 100) if total_calories > 0 else 0,
                'quality': 'excellent' if 200 <= carbs <= 300 else 'good' if 150 <= carbs <= 350 else 'needs_improvement'
            },
            'fat': {
                'grams': fat,
                'calories': fat * 9,
                'percentage': (fat * 9 / total_calories * 100) if total_calories > 0 else 0,
                'quality': 'excellent' if 60 <= fat <= 80 else 'good' if 40 <= fat <= 100 else 'needs_improvement'
            },
            'balance_score': self._calculate_macro_balance(daily_nutrition, 'male')  # Default to male
        }
    
    def analyze_micronutrients(self, meals: List[Dict]) -> Dict:
        """Analyze micronutrient intake and bioavailability"""
        daily_nutrition = self._calculate_daily_nutrition(meals)
        
        micronutrients = ['fiber', 'vitamin_c', 'vitamin_d', 'calcium', 'iron', 'sodium']
        analysis = {}
        
        for nutrient in micronutrients:
            current = daily_nutrition.get(nutrient, 0)
            
            # Get requirements (simplified)
            requirements = {
                'fiber': 30,
                'vitamin_c': 90,
                'vitamin_d': 20,
                'calcium': 1000,
                'iron': 15,
                'sodium': 2000
            }
            
            required = requirements[nutrient]
            adequacy = (current / required * 100) if required > 0 else 0
            
            analysis[nutrient] = {
                'current_intake': current,
                'recommended_intake': required,
                'adequacy_percentage': adequacy,
                'status': 'adequate' if adequacy >= 80 else 'deficient' if adequacy < 50 else 'suboptimal',
                'priority': 'high' if adequacy < 50 else 'medium' if adequacy < 80 else 'low'
            }
        
        return analysis
    
    def identify_deficiency_risks(self, user_profile: Dict, meals: List[Dict]) -> List[Dict]:
        """Identify potential nutrient deficiencies"""
        daily_nutrition = self._calculate_daily_nutrition(meals)
        sex = user_profile.get('sex', 'male')
        age = user_profile.get('age', 30)
        medical_history = user_profile.get('medical_history', [])
        
        deficiencies = []
        
        # Check each micronutrient
        micronutrients = ['vitamin_d', 'iron', 'calcium', 'vitamin_c', 'fiber']
        
        for nutrient in micronutrients:
            current = daily_nutrition.get(nutrient, 0)
            required = self.nutrient_requirements[nutrient][sex]
            
            # Age adjustments
            if age > 50 and nutrient == 'vitamin_d':
                required *= 1.5
            if age > 50 and nutrient == 'calcium':
                required *= 1.2
            
            if current < required * 0.8:  # Less than 80% of requirement
                risk_level = 'high' if current < required * 0.5 else 'medium'
                
                deficiency = {
                    'nutrient': nutrient.replace('_', ' ').title(),
                    'risk_level': risk_level,
                    'current_intake': current,
                    'recommended_intake': required,
                    'deficiency_percentage': ((required - current) / required * 100) if required > 0 else 0,
                    'symptoms': self._get_deficiency_symptoms(nutrient),
                    'food_sources': self._get_food_sources(nutrient),
                    'supplement_recommendation': self._get_supplement_recommendation(nutrient, current, required)
                }
                
                deficiencies.append(deficiency)
        
        return deficiencies
    
    def _get_deficiency_symptoms(self, nutrient: str) -> List[str]:
        """Get deficiency symptoms for a nutrient"""
        symptoms = {
            'vitamin_d': ['Bone pain', 'Muscle weakness', 'Depression', 'Fatigue'],
            'iron': ['Fatigue', 'Weakness', 'Pale skin', 'Shortness of breath'],
            'calcium': ['Bone fractures', 'Muscle cramps', 'Numbness', 'Brittle nails'],
            'vitamin_c': ['Fatigue', 'Muscle weakness', 'Joint pain', 'Slow wound healing'],
            'fiber': ['Constipation', 'Digestive issues', 'High cholesterol', 'Blood sugar spikes']
        }
        return symptoms.get(nutrient, [])
    
    def _get_food_sources(self, nutrient: str) -> List[str]:
        """Get food sources for a nutrient"""
        sources = {
            'vitamin_d': ['Fatty fish', 'Fortified milk', 'Eggs', 'Mushrooms'],
            'iron': ['Red meat', 'Spinach', 'Lentils', 'Quinoa'],
            'calcium': ['Dairy products', 'Leafy greens', 'Almonds', 'Sardines'],
            'vitamin_c': ['Citrus fruits', 'Bell peppers', 'Strawberries', 'Broccoli'],
            'fiber': ['Whole grains', 'Legumes', 'Vegetables', 'Fruits']
        }
        return sources.get(nutrient, [])
    
    def _get_supplement_recommendation(self, nutrient: str, current: float, required: float) -> str:
        """Get supplement recommendation"""
        deficiency = required - current
        
        if deficiency > required * 0.5:  # More than 50% deficient
            return f"Consider supplementing with {nutrient.replace('_', ' ')} - deficiency of {deficiency:.1f} units"
        elif deficiency > required * 0.2:  # More than 20% deficient
            return f"Monitor {nutrient.replace('_', ' ')} intake - slight deficiency of {deficiency:.1f} units"
        else:
            return f"Continue current {nutrient.replace('_', ' ')} intake - adequate levels"
    
    def generate_nutrition_recommendations(self, user_profile: Dict, meals: List[Dict], molecular_score: float) -> List[Dict]:
        """Generate personalized nutrition recommendations"""
        recommendations = []
        daily_nutrition = self._calculate_daily_nutrition(meals)
        medical_history = user_profile.get('medical_history', [])
        health_goals = user_profile.get('health_goals', [])
        
        # General recommendations based on molecular score
        if molecular_score < 60:
            recommendations.append({
                'title': 'Improve Overall Nutrition Balance',
                'description': 'Your molecular balance score indicates room for improvement in nutrition quality.',
                'category': 'diet',
                'priority': 'high',
                'actions': [
                    'Increase variety of whole foods',
                    'Focus on nutrient-dense meals',
                    'Reduce processed food intake'
                ]
            })
        
        # Medical condition-specific recommendations
        for condition in medical_history:
            if condition in self.health_conditions:
                condition_info = self.health_conditions[condition]
                recommendations.append({
                    'title': f'Manage {condition.title()}',
                    'description': f'Specific nutrition strategies for {condition} management.',
                    'category': 'medical',
                    'priority': 'high',
                    'actions': condition_info['recommendations']
                })
        
        # Goal-specific recommendations
        for goal in health_goals:
            if goal == 'weight_loss':
                recommendations.append({
                    'title': 'Support Weight Loss Goals',
                    'description': 'Nutrition strategies to support healthy weight loss.',
                    'category': 'diet',
                    'priority': 'medium',
                    'actions': [
                        'Increase protein intake to 25-30% of calories',
                        'Focus on high-fiber foods for satiety',
                        'Monitor portion sizes',
                        'Stay hydrated with water'
                    ]
                })
            elif goal == 'muscle_gain':
                recommendations.append({
                    'title': 'Support Muscle Building',
                    'description': 'Nutrition strategies to support muscle growth.',
                    'category': 'diet',
                    'priority': 'medium',
                    'actions': [
                        'Increase protein intake to 1.6-2.2g per kg body weight',
                        'Time protein intake around workouts',
                        'Ensure adequate calorie surplus',
                        'Focus on complete protein sources'
                    ]
                })
        
        # Micronutrient-specific recommendations
        micro_analysis = self.analyze_micronutrients(meals)
        for nutrient, analysis in micro_analysis.items():
            if analysis['status'] == 'deficient':
                recommendations.append({
                    'title': f'Address {nutrient.replace("_", " ").title()} Deficiency',
                    'description': f'Your {nutrient} intake is {analysis["adequacy_percentage"]:.1f}% of recommended levels.',
                    'category': 'supplements',
                    'priority': 'high',
                    'actions': [
                        f'Increase {nutrient}-rich foods',
                        f'Consider {nutrient} supplementation',
                        'Monitor levels with healthcare provider'
                    ]
                })
        
        return recommendations
    
    def generate_health_insights(self, user_profile: Dict, meals: List[Dict], molecular_score: float) -> List[str]:
        """Generate health insights based on nutrition analysis"""
        insights = []
        daily_nutrition = self._calculate_daily_nutrition(meals)
        medical_history = user_profile.get('medical_history', [])
        
        # Molecular score insights
        if molecular_score >= 80:
            insights.append("Excellent molecular balance! Your nutrition is supporting optimal health.")
        elif molecular_score >= 60:
            insights.append("Good molecular balance with room for improvement in specific areas.")
        else:
            insights.append("Your molecular balance indicates significant opportunities for nutrition optimization.")
        
        # Macronutrient insights
        protein = daily_nutrition.get('protein', 0)
        carbs = daily_nutrition.get('carbs', 0)
        fat = daily_nutrition.get('fat', 0)
        
        if protein >= 80:
            insights.append("Adequate protein intake supports muscle maintenance and immune function.")
        elif protein < 60:
            insights.append("Low protein intake may impact muscle mass and recovery.")
        
        if carbs > 300:
            insights.append("High carbohydrate intake may affect blood sugar stability.")
        elif carbs < 150:
            insights.append("Low carbohydrate intake may impact energy levels and exercise performance.")
        
        # Medical condition insights
        if 'diabetes' in medical_history:
            fiber = daily_nutrition.get('fiber', 0)
            if fiber >= 25:
                insights.append("Good fiber intake supports blood sugar management.")
            else:
                insights.append("Increasing fiber intake can help with blood sugar control.")
        
        if 'hypertension' in medical_history:
            sodium = daily_nutrition.get('sodium', 0)
            if sodium <= 2000:
                insights.append("Low sodium intake supports blood pressure management.")
            else:
                insights.append("Reducing sodium intake can help lower blood pressure.")
        
        return insights
