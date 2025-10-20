"""
Healthcare-focused nutrition analysis models
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_squared_error, accuracy_score, classification_report
import joblib
from typing import Dict, List, Tuple, Optional
import logging

logger = logging.getLogger(__name__)

class NutritionAnalysisModel:
    """Advanced nutrition analysis with healthcare insights"""
    
    def __init__(self):
        self.molecular_balance_model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.deficiency_risk_model = GradientBoostingClassifier(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.feature_importance = {}
        
    def prepare_features(self, data: pd.DataFrame) -> np.ndarray:
        """Prepare features for nutrition analysis"""
        features = data.copy()
        
        # Encode categorical variables
        categorical_cols = ['sex', 'activity_level', 'health_goals', 'medical_history']
        for col in categorical_cols:
            if col in features.columns:
                if col not in self.label_encoders:
                    self.label_encoders[col] = LabelEncoder()
                    features[col] = self.label_encoders[col].fit_transform(features[col].astype(str))
                else:
                    features[col] = self.label_encoders[col].transform(features[col].astype(str))
        
        # Calculate derived features
        features['bmi'] = features['weight'] / (features['height'] / 100) ** 2
        features['age_group'] = pd.cut(features['age'], bins=[0, 30, 50, 70, 100], labels=[0, 1, 2, 3])
        
        # Nutrition features
        nutrition_cols = ['protein', 'carbs', 'fat', 'fiber', 'vitamin_c', 'vitamin_d', 'calcium', 'iron']
        for col in nutrition_cols:
            if col not in features.columns:
                features[col] = 0
        
        # Calculate nutrition ratios
        features['protein_ratio'] = features['protein'] / (features['protein'] + features['carbs'] + features['fat'])
        features['carb_ratio'] = features['carbs'] / (features['protein'] + features['carbs'] + features['fat'])
        features['fat_ratio'] = features['fat'] / (features['protein'] + features['carbs'] + features['fat'])
        
        return features.values
    
    def calculate_molecular_balance_score(self, features: np.ndarray) -> float:
        """Calculate molecular balance score based on nutrition and health factors"""
        if self.molecular_balance_model is None:
            return self._rule_based_molecular_score(features)
        
        score = self.molecular_balance_model.predict([features])[0]
        return max(0, min(100, score))  # Clamp between 0-100
    
    def _rule_based_molecular_score(self, features: np.ndarray) -> float:
        """Fallback rule-based molecular balance score"""
        # Basic scoring based on nutrition ratios and health factors
        base_score = 50
        
        # Protein ratio bonus (optimal: 0.2-0.3)
        protein_ratio = features[0] if len(features) > 0 else 0.25
        if 0.2 <= protein_ratio <= 0.3:
            base_score += 15
        elif 0.15 <= protein_ratio <= 0.35:
            base_score += 10
        
        # Carb ratio bonus (optimal: 0.4-0.6)
        carb_ratio = features[1] if len(features) > 1 else 0.5
        if 0.4 <= carb_ratio <= 0.6:
            base_score += 15
        elif 0.3 <= carb_ratio <= 0.7:
            base_score += 10
        
        # Fat ratio bonus (optimal: 0.2-0.3)
        fat_ratio = features[2] if len(features) > 2 else 0.25
        if 0.2 <= fat_ratio <= 0.3:
            base_score += 15
        elif 0.15 <= fat_ratio <= 0.35:
            base_score += 10
        
        return min(100, base_score)
    
    def identify_deficiency_risks(self, features: np.ndarray) -> List[Dict]:
        """Identify potential nutrient deficiencies"""
        deficiencies = []
        
        # Vitamin D deficiency risk
        vitamin_d = features[5] if len(features) > 5 else 0
        if vitamin_d < 15:  # IU per day
            deficiencies.append({
                "nutrient": "Vitamin D",
                "risk_level": "high",
                "current_intake": vitamin_d,
                "recommended_intake": 20,
                "symptoms": ["Bone pain", "Muscle weakness", "Depression"],
                "food_sources": ["Fatty fish", "Fortified milk", "Eggs"]
            })
        
        # Iron deficiency risk
        iron = features[7] if len(features) > 7 else 0
        if iron < 8:  # mg per day
            deficiencies.append({
                "nutrient": "Iron",
                "risk_level": "high",
                "current_intake": iron,
                "recommended_intake": 18,
                "symptoms": ["Fatigue", "Weakness", "Pale skin"],
                "food_sources": ["Red meat", "Spinach", "Lentils"]
            })
        
        # Calcium deficiency risk
        calcium = features[6] if len(features) > 6 else 0
        if calcium < 800:  # mg per day
            deficiencies.append({
                "nutrient": "Calcium",
                "risk_level": "medium",
                "current_intake": calcium,
                "recommended_intake": 1000,
                "symptoms": ["Bone fractures", "Muscle cramps", "Numbness"],
                "food_sources": ["Dairy", "Leafy greens", "Almonds"]
            })
        
        return deficiencies
    
    def train(self, X: np.ndarray, y: np.ndarray):
        """Train the nutrition analysis model"""
        try:
            # Scale features
            X_scaled = self.scaler.fit_transform(X)
            
            # Train molecular balance model
            self.molecular_balance_model.fit(X_scaled, y)
            
            # Calculate feature importance
            self.feature_importance = dict(zip(
                range(len(X_scaled[0])), 
                self.molecular_balance_model.feature_importances_
            ))
            
            logger.info("Nutrition analysis model trained successfully")
            
        except Exception as e:
            logger.error(f"Error training nutrition model: {e}")
            raise
    
    def save_model(self, filepath: str):
        """Save the trained model"""
        model_data = {
            'molecular_balance_model': self.molecular_balance_model,
            'scaler': self.scaler,
            'label_encoders': self.label_encoders,
            'feature_importance': self.feature_importance
        }
        joblib.dump(model_data, filepath)
        logger.info(f"Model saved to {filepath}")
    
    def load_model(self, filepath: str):
        """Load a trained model"""
        model_data = joblib.load(filepath)
        self.molecular_balance_model = model_data['molecular_balance_model']
        self.scaler = model_data['scaler']
        self.label_encoders = model_data['label_encoders']
        self.feature_importance = model_data['feature_importance']
        logger.info(f"Model loaded from {filepath}")


class BiomarkerPredictionModel:
    """Predict future biomarker values based on nutrition and lifestyle"""
    
    def __init__(self):
        self.biomarker_models = {}
        self.scaler = StandardScaler()
        self.biomarker_ranges = {
            'glucose': (70, 100),  # mg/dL
            'cholesterol': (0, 200),  # mg/dL
            'blood_pressure_systolic': (90, 120),  # mmHg
            'blood_pressure_diastolic': (60, 80),  # mmHg
            'hba1c': (4, 6),  # %
            'triglycerides': (0, 150),  # mg/dL
            'hdl': (40, 60),  # mg/dL
            'ldl': (0, 100),  # mg/dL
        }
    
    def prepare_features(self, user_profile: Dict, nutrition_data: Dict, 
                        current_biomarkers: Dict) -> np.ndarray:
        """Prepare features for biomarker prediction"""
        features = []
        
        # Demographics
        features.extend([
            user_profile.get('age', 30),
            user_profile.get('weight', 70),
            user_profile.get('height', 170),
            1 if user_profile.get('sex') == 'male' else 0
        ])
        
        # Nutrition features
        nutrition_features = [
            nutrition_data.get('protein', 0),
            nutrition_data.get('carbs', 0),
            nutrition_data.get('fat', 0),
            nutrition_data.get('fiber', 0),
            nutrition_data.get('sodium', 0),
            nutrition_data.get('sugar', 0)
        ]
        features.extend(nutrition_features)
        
        # Current biomarkers
        biomarker_features = [
            current_biomarkers.get('glucose', 90),
            current_biomarkers.get('cholesterol', 180),
            current_biomarkers.get('blood_pressure_systolic', 110),
            current_biomarkers.get('blood_pressure_diastolic', 70),
            current_biomarkers.get('hba1c', 5.5),
            current_biomarkers.get('triglycerides', 100),
            current_biomarkers.get('hdl', 50),
            current_biomarkers.get('ldl', 100)
        ]
        features.extend(biomarker_features)
        
        return np.array(features)
    
    def predict_biomarkers(self, features: np.ndarray, time_horizon_days: int = 30) -> Dict:
        """Predict biomarker values for given time horizon"""
        predictions = {}
        
        # Scale features
        features_scaled = self.scaler.transform([features])
        
        # Predict each biomarker
        for biomarker, model in self.biomarker_models.items():
            if model is not None:
                pred = model.predict(features_scaled)[0]
                # Adjust prediction based on time horizon
                time_factor = 1 + (time_horizon_days / 365) * 0.1  # 10% change per year
                predictions[biomarker] = pred * time_factor
            else:
                # Fallback to rule-based prediction
                predictions[biomarker] = self._rule_based_prediction(biomarker, features)
        
        return predictions
    
    def _rule_based_prediction(self, biomarker: str, features: np.ndarray) -> float:
        """Fallback rule-based biomarker prediction"""
        current_value = features[8] if len(features) > 8 else 90  # Default glucose
        
        if biomarker == 'glucose':
            # Predict based on carb intake and current glucose
            carb_intake = features[5] if len(features) > 5 else 0
            if carb_intake > 200:  # High carb intake
                return current_value * 1.1
            elif carb_intake < 100:  # Low carb intake
                return current_value * 0.95
            else:
                return current_value
        
        elif biomarker == 'cholesterol':
            # Predict based on fat intake
            fat_intake = features[7] if len(features) > 7 else 0
            if fat_intake > 80:  # High fat intake
                return current_value * 1.05
            else:
                return current_value
        
        return current_value
    
    def calculate_risk_factors(self, predictions: Dict) -> List[str]:
        """Calculate risk factors based on predicted biomarkers"""
        risk_factors = []
        
        # Glucose risk
        if predictions.get('glucose', 90) > 100:
            risk_factors.append("Prediabetes risk - elevated glucose levels")
        
        # Cholesterol risk
        if predictions.get('cholesterol', 180) > 200:
            risk_factors.append("High cholesterol risk - cardiovascular disease")
        
        # Blood pressure risk
        if predictions.get('blood_pressure_systolic', 110) > 130:
            risk_factors.append("Hypertension risk - high blood pressure")
        
        return risk_factors
    
    def train(self, X: np.ndarray, y: Dict[str, np.ndarray]):
        """Train biomarker prediction models"""
        try:
            # Scale features
            X_scaled = self.scaler.fit_transform(X)
            
            # Train individual biomarker models
            for biomarker, target_values in y.items():
                if len(target_values) > 0:
                    model = RandomForestRegressor(n_estimators=50, random_state=42)
                    model.fit(X_scaled, target_values)
                    self.biomarker_models[biomarker] = model
                    logger.info(f"Trained model for {biomarker}")
            
            logger.info("Biomarker prediction models trained successfully")
            
        except Exception as e:
            logger.error(f"Error training biomarker models: {e}")
            raise
    
    def save_model(self, filepath: str):
        """Save the trained models"""
        model_data = {
            'biomarker_models': self.biomarker_models,
            'scaler': self.scaler,
            'biomarker_ranges': self.biomarker_ranges
        }
        joblib.dump(model_data, filepath)
        logger.info(f"Biomarker models saved to {filepath}")
    
    def load_model(self, filepath: str):
        """Load trained models"""
        model_data = joblib.load(filepath)
        self.biomarker_models = model_data['biomarker_models']
        self.scaler = model_data['scaler']
        self.biomarker_ranges = model_data['biomarker_ranges']
        logger.info(f"Biomarker models loaded from {filepath}")


class HealthRiskAssessmentModel:
    """Comprehensive health risk assessment"""
    
    def __init__(self):
        self.risk_models = {}
        self.risk_categories = [
            'diabetes', 'cardiovascular', 'hypertension', 'obesity', 
            'osteoporosis', 'cancer', 'metabolic_syndrome'
        ]
        self.scaler = StandardScaler()
    
    def calculate_risk_scores(self, demographics: Dict, nutrition_history: List[Dict], 
                            biomarker_history: List[Dict]) -> Dict:
        """Calculate risk scores for various health conditions"""
        risk_scores = {}
        
        # Prepare features
        features = self._prepare_risk_features(demographics, nutrition_history, biomarker_history)
        
        # Calculate risk for each category
        for category in self.risk_categories:
            if category in self.risk_models and self.risk_models[category] is not None:
                risk_score = self.risk_models[category].predict_proba([features])[0][1]
                risk_scores[category] = float(risk_score)
            else:
                # Fallback to rule-based risk assessment
                risk_scores[category] = self._rule_based_risk_assessment(category, features)
        
        return risk_scores
    
    def _prepare_risk_features(self, demographics: Dict, nutrition_history: List[Dict], 
                              biomarker_history: List[Dict]) -> np.ndarray:
        """Prepare features for risk assessment"""
        features = []
        
        # Demographics
        features.extend([
            demographics.get('age', 30),
            demographics.get('weight', 70),
            demographics.get('height', 170),
            1 if demographics.get('sex') == 'male' else 0,
            demographics.get('bmi', 22)
        ])
        
        # Family history (binary features)
        family_history = demographics.get('family_history', [])
        features.extend([
            1 if 'diabetes' in family_history else 0,
            1 if 'heart_disease' in family_history else 0,
            1 if 'cancer' in family_history else 0,
            1 if 'hypertension' in family_history else 0
        ])
        
        # Average nutrition over time
        if nutrition_history:
            avg_nutrition = self._calculate_average_nutrition(nutrition_history)
            features.extend([
                avg_nutrition.get('protein', 0),
                avg_nutrition.get('carbs', 0),
                avg_nutrition.get('fat', 0),
                avg_nutrition.get('fiber', 0),
                avg_nutrition.get('sodium', 0)
            ])
        else:
            features.extend([0, 0, 0, 0, 0])
        
        # Average biomarkers over time
        if biomarker_history:
            avg_biomarkers = self._calculate_average_biomarkers(biomarker_history)
            features.extend([
                avg_biomarkers.get('glucose', 90),
                avg_biomarkers.get('cholesterol', 180),
                avg_biomarkers.get('blood_pressure_systolic', 110),
                avg_biomarkers.get('blood_pressure_diastolic', 70)
            ])
        else:
            features.extend([90, 180, 110, 70])
        
        return np.array(features)
    
    def _calculate_average_nutrition(self, nutrition_history: List[Dict]) -> Dict:
        """Calculate average nutrition over time"""
        if not nutrition_history:
            return {}
        
        totals = {}
        count = len(nutrition_history)
        
        for entry in nutrition_history:
            for nutrient, value in entry.items():
                if isinstance(value, (int, float)):
                    totals[nutrient] = totals.get(nutrient, 0) + value
        
        return {nutrient: total / count for nutrient, total in totals.items()}
    
    def _calculate_average_biomarkers(self, biomarker_history: List[Dict]) -> Dict:
        """Calculate average biomarkers over time"""
        if not biomarker_history:
            return {}
        
        totals = {}
        count = len(biomarker_history)
        
        for entry in biomarker_history:
            for biomarker, value in entry.items():
                if isinstance(value, (int, float)):
                    totals[biomarker] = totals.get(biomarker, 0) + value
        
        return {biomarker: total / count for biomarker, total in totals.items()}
    
    def _rule_based_risk_assessment(self, category: str, features: np.ndarray) -> float:
        """Fallback rule-based risk assessment"""
        age = features[0]
        bmi = features[4]
        family_diabetes = features[5]
        family_heart = features[6]
        glucose = features[14] if len(features) > 14 else 90
        cholesterol = features[15] if len(features) > 15 else 180
        
        risk_score = 0.1  # Base risk
        
        # Age factor
        if age > 50:
            risk_score += 0.2
        elif age > 40:
            risk_score += 0.1
        
        # BMI factor
        if bmi > 30:
            risk_score += 0.3
        elif bmi > 25:
            risk_score += 0.2
        
        # Family history
        if category == 'diabetes' and family_diabetes:
            risk_score += 0.3
        elif category == 'cardiovascular' and family_heart:
            risk_score += 0.3
        
        # Biomarker factors
        if category == 'diabetes' and glucose > 100:
            risk_score += 0.2
        elif category == 'cardiovascular' and cholesterol > 200:
            risk_score += 0.2
        
        return min(1.0, risk_score)
    
    def train(self, X: np.ndarray, y: Dict[str, np.ndarray]):
        """Train health risk assessment models"""
        try:
            # Scale features
            X_scaled = self.scaler.fit_transform(X)
            
            # Train models for each risk category
            for category, target_values in y.items():
                if len(target_values) > 0:
                    model = GradientBoostingClassifier(n_estimators=100, random_state=42)
                    model.fit(X_scaled, target_values)
                    self.risk_models[category] = model
                    logger.info(f"Trained risk model for {category}")
            
            logger.info("Health risk assessment models trained successfully")
            
        except Exception as e:
            logger.error(f"Error training risk models: {e}")
            raise
    
    def save_model(self, filepath: str):
        """Save the trained models"""
        model_data = {
            'risk_models': self.risk_models,
            'scaler': self.scaler,
            'risk_categories': self.risk_categories
        }
        joblib.dump(model_data, filepath)
        logger.info(f"Risk assessment models saved to {filepath}")
    
    def load_model(self, filepath: str):
        """Load trained models"""
        model_data = joblib.load(filepath)
        self.risk_models = model_data['risk_models']
        self.scaler = model_data['scaler']
        self.risk_categories = model_data['risk_categories']
        logger.info(f"Risk assessment models loaded from {filepath}")
