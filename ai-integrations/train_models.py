"""
Healthcare data training and model development
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, accuracy_score
import joblib
import os
from typing import Dict, List, Tuple
import logging

from app.models.healthcare_models import (
    NutritionAnalysisModel, 
    BiomarkerPredictionModel, 
    HealthRiskAssessmentModel
)

logger = logging.getLogger(__name__)

class HealthcareDataTrainer:
    """Train healthcare-focused ML models"""
    
    def __init__(self):
        self.nutrition_model = NutritionAnalysisModel()
        self.biomarker_model = BiomarkerPredictionModel()
        self.risk_model = HealthRiskAssessmentModel()
        
    def generate_synthetic_healthcare_data(self, n_samples: int = 10000) -> pd.DataFrame:
        """Generate synthetic healthcare data for training"""
        np.random.seed(42)
        
        data = []
        
        for i in range(n_samples):
            # Demographics
            age = np.random.normal(45, 15)
            age = max(18, min(80, age))
            
            sex = np.random.choice(['male', 'female'])
            weight = np.random.normal(70, 15) if sex == 'male' else np.random.normal(60, 12)
            height = np.random.normal(175, 10) if sex == 'male' else np.random.normal(165, 8)
            bmi = weight / (height / 100) ** 2
            
            # Activity level
            activity_level = np.random.choice(['sedentary', 'light', 'moderate', 'active', 'very_active'])
            
            # Health goals
            health_goals = np.random.choice([
                ['weight_loss'], ['muscle_gain'], ['general_health'], 
                ['diabetes_management'], ['heart_health'], ['energy']
            ])
            
            # Medical history
            medical_history = np.random.choice([
                [], ['diabetes'], ['hypertension'], ['heart_disease'], 
                ['diabetes', 'hypertension'], ['obesity']
            ])
            
            # Nutrition data (daily averages)
            protein = np.random.normal(80, 20)
            carbs = np.random.normal(200, 50)
            fat = np.random.normal(70, 20)
            fiber = np.random.normal(25, 8)
            vitamin_c = np.random.normal(100, 30)
            vitamin_d = np.random.normal(20, 10)
            calcium = np.random.normal(1000, 300)
            iron = np.random.normal(15, 5)
            sodium = np.random.normal(2000, 500)
            sugar = np.random.normal(50, 20)
            
            # Biomarkers
            glucose = np.random.normal(90, 15)
            cholesterol = np.random.normal(180, 40)
            blood_pressure_systolic = np.random.normal(120, 15)
            blood_pressure_diastolic = np.random.normal(80, 10)
            hba1c = np.random.normal(5.5, 0.8)
            triglycerides = np.random.normal(120, 40)
            hdl = np.random.normal(50, 15)
            ldl = np.random.normal(100, 30)
            
            # Calculate molecular balance score (target variable)
            molecular_score = self._calculate_synthetic_molecular_score(
                protein, carbs, fat, fiber, vitamin_c, vitamin_d, calcium, iron,
                glucose, cholesterol, blood_pressure_systolic, age, bmi
            )
            
            # Family history
            family_history = np.random.choice([
                [], ['diabetes'], ['heart_disease'], ['cancer'], 
                ['diabetes', 'heart_disease']
            ])
            
            data.append({
                'age': age,
                'sex': sex,
                'weight': weight,
                'height': height,
                'bmi': bmi,
                'activity_level': activity_level,
                'health_goals': health_goals,
                'medical_history': medical_history,
                'protein': protein,
                'carbs': carbs,
                'fat': fat,
                'fiber': fiber,
                'vitamin_c': vitamin_c,
                'vitamin_d': vitamin_d,
                'calcium': calcium,
                'iron': iron,
                'sodium': sodium,
                'sugar': sugar,
                'glucose': glucose,
                'cholesterol': cholesterol,
                'blood_pressure_systolic': blood_pressure_systolic,
                'blood_pressure_diastolic': blood_pressure_diastolic,
                'hba1c': hba1c,
                'triglycerides': triglycerides,
                'hdl': hdl,
                'ldl': ldl,
                'molecular_score': molecular_score,
                'family_history': family_history
            })
        
        return pd.DataFrame(data)
    
    def _calculate_synthetic_molecular_score(self, protein, carbs, fat, fiber, 
                                           vitamin_c, vitamin_d, calcium, iron,
                                           glucose, cholesterol, bp_systolic, 
                                           age, bmi) -> float:
        """Calculate synthetic molecular balance score"""
        score = 50  # Base score
        
        # Protein ratio (optimal: 0.2-0.3)
        total_calories = protein * 4 + carbs * 4 + fat * 9
        protein_ratio = (protein * 4) / total_calories if total_calories > 0 else 0.25
        if 0.2 <= protein_ratio <= 0.3:
            score += 15
        elif 0.15 <= protein_ratio <= 0.35:
            score += 10
        
        # Carb ratio (optimal: 0.4-0.6)
        carb_ratio = (carbs * 4) / total_calories if total_calories > 0 else 0.5
        if 0.4 <= carb_ratio <= 0.6:
            score += 15
        elif 0.3 <= carb_ratio <= 0.7:
            score += 10
        
        # Fat ratio (optimal: 0.2-0.3)
        fat_ratio = (fat * 9) / total_calories if total_calories > 0 else 0.25
        if 0.2 <= fat_ratio <= 0.3:
            score += 15
        elif 0.15 <= fat_ratio <= 0.35:
            score += 10
        
        # Micronutrient bonuses
        if vitamin_c >= 90:
            score += 5
        if vitamin_d >= 15:
            score += 5
        if calcium >= 800:
            score += 5
        if iron >= 12:
            score += 5
        
        # Biomarker penalties
        if glucose > 100:
            score -= 10
        if cholesterol > 200:
            score -= 10
        if bp_systolic > 130:
            score -= 10
        
        # Age penalty
        if age > 60:
            score -= 5
        elif age > 50:
            score -= 3
        
        # BMI penalty
        if bmi > 30:
            score -= 15
        elif bmi > 25:
            score -= 10
        elif bmi < 18.5:
            score -= 5
        
        return max(0, min(100, score))
    
    def prepare_training_data(self, df: pd.DataFrame) -> Tuple[np.ndarray, Dict]:
        """Prepare training data for different models"""
        
        # Features for nutrition analysis
        nutrition_features = df[[
            'age', 'sex', 'weight', 'height', 'activity_level',
            'protein', 'carbs', 'fat', 'fiber', 'vitamin_c', 
            'vitamin_d', 'calcium', 'iron'
        ]].copy()
        
        # Target for nutrition model
        nutrition_target = df['molecular_score'].values
        
        # Features for biomarker prediction
        biomarker_features = df[[
            'age', 'weight', 'height', 'sex', 'protein', 'carbs', 'fat', 
            'fiber', 'sodium', 'sugar', 'glucose', 'cholesterol',
            'blood_pressure_systolic', 'blood_pressure_diastolic',
            'hba1c', 'triglycerides', 'hdl', 'ldl'
        ]].copy()
        
        # Targets for biomarker models (future values)
        biomarker_targets = {
            'glucose': df['glucose'].values * (1 + np.random.normal(0, 0.1, len(df))),
            'cholesterol': df['cholesterol'].values * (1 + np.random.normal(0, 0.1, len(df))),
            'blood_pressure_systolic': df['blood_pressure_systolic'].values * (1 + np.random.normal(0, 0.05, len(df))),
            'blood_pressure_diastolic': df['blood_pressure_diastolic'].values * (1 + np.random.normal(0, 0.05, len(df))),
            'hba1c': df['hba1c'].values * (1 + np.random.normal(0, 0.1, len(df))),
            'triglycerides': df['triglycerides'].values * (1 + np.random.normal(0, 0.1, len(df))),
            'hdl': df['hdl'].values * (1 + np.random.normal(0, 0.1, len(df))),
            'ldl': df['ldl'].values * (1 + np.random.normal(0, 0.1, len(df)))
        }
        
        # Features for health risk assessment
        risk_features = df[[
            'age', 'weight', 'height', 'sex', 'bmi', 'family_history',
            'protein', 'carbs', 'fat', 'fiber', 'sodium',
            'glucose', 'cholesterol', 'blood_pressure_systolic', 'blood_pressure_diastolic'
        ]].copy()
        
        # Targets for risk models (binary classification)
        risk_targets = {
            'diabetes': (df['glucose'] > 100).astype(int).values,
            'cardiovascular': (df['cholesterol'] > 200).astype(int).values,
            'hypertension': (df['blood_pressure_systolic'] > 130).astype(int).values,
            'obesity': (df['bmi'] > 30).astype(int).values,
            'metabolic_syndrome': ((df['glucose'] > 100) & (df['cholesterol'] > 200) & (df['bmi'] > 25)).astype(int).values
        }
        
        return (nutrition_features.values, nutrition_target), (biomarker_features.values, biomarker_targets), (risk_features.values, risk_targets)
    
    def train_all_models(self, n_samples: int = 10000):
        """Train all healthcare models"""
        logger.info("Generating synthetic healthcare data...")
        df = self.generate_synthetic_healthcare_data(n_samples)
        
        logger.info("Preparing training data...")
        (nutrition_X, nutrition_y), (biomarker_X, biomarker_y), (risk_X, risk_y) = self.prepare_training_data(df)
        
        # Create models directory
        os.makedirs("models", exist_ok=True)
        
        # Train nutrition analysis model
        logger.info("Training nutrition analysis model...")
        self.nutrition_model.train(nutrition_X, nutrition_y)
        self.nutrition_model.save_model("models/nutrition_model.pkl")
        
        # Train biomarker prediction models
        logger.info("Training biomarker prediction models...")
        self.biomarker_model.train(biomarker_X, biomarker_y)
        self.biomarker_model.save_model("models/biomarker_model.pkl")
        
        # Train health risk assessment models
        logger.info("Training health risk assessment models...")
        self.risk_model.train(risk_X, risk_y)
        self.risk_model.save_model("models/health_risk_model.pkl")
        
        logger.info("All models trained successfully!")
        
        # Print model performance
        self._evaluate_models(nutrition_X, nutrition_y, biomarker_X, biomarker_y, risk_X, risk_y)
    
    def _evaluate_models(self, nutrition_X, nutrition_y, biomarker_X, biomarker_y, risk_X, risk_y):
        """Evaluate model performance"""
        logger.info("Evaluating model performance...")
        
        # Evaluate nutrition model
        nutrition_pred = self.nutrition_model.molecular_balance_model.predict(nutrition_X)
        nutrition_mse = mean_squared_error(nutrition_y, nutrition_pred)
        logger.info(f"Nutrition model MSE: {nutrition_mse:.2f}")
        
        # Evaluate biomarker models
        for biomarker, model in self.biomarker_model.biomarker_models.items():
            if model is not None:
                pred = model.predict(biomarker_X)
                mse = mean_squared_error(biomarker_y[biomarker], pred)
                logger.info(f"{biomarker} model MSE: {mse:.2f}")
        
        # Evaluate risk models
        for risk_category, model in self.risk_model.risk_models.items():
            if model is not None:
                pred = model.predict(risk_X)
                accuracy = accuracy_score(risk_y[risk_category], pred)
                logger.info(f"{risk_category} model accuracy: {accuracy:.2f}")

def main():
    """Main training function"""
    trainer = HealthcareDataTrainer()
    trainer.train_all_models(n_samples=10000)

if __name__ == "__main__":
    main()
