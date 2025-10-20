# AI Integrations Service
# Advanced healthcare-focused AI models for nutrition analysis and health predictions

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import joblib
import logging
from datetime import datetime, timedelta
import os

# Import service implementations
from app.services.nutrition_analysis import NutritionAnalysisService
from app.models.healthcare_models import BiomarkerPredictionModel, HealthRiskAssessmentModel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AI Integrations Service",
    description="Healthcare-focused AI models for nutrition analysis and health predictions",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for models
nutrition_model = None
biomarker_model = None
health_risk_model = None
scaler = StandardScaler()

class NutritionAnalysisRequest(BaseModel):
    age: int
    sex: str
    weight: float
    height: float
    activity_level: str
    health_goals: List[str]
    medical_history: List[str]
    meals: List[Dict]
    biomarkers: Optional[Dict] = None

class BiomarkerPredictionRequest(BaseModel):
    user_profile: Dict
    nutrition_data: Dict
    current_biomarkers: Dict
    time_horizon_days: int = 30

class HealthRiskAssessmentRequest(BaseModel):
    demographics: Dict
    nutrition_history: List[Dict]
    biomarker_history: List[Dict]
    family_history: List[str]

class NutritionAnalysisResponse(BaseModel):
    molecular_balance_score: float
    macronutrient_analysis: Dict
    micronutrient_analysis: Dict
    deficiency_risks: List[Dict]
    recommendations: List[Dict]
    health_insights: List[str]

class BiomarkerPredictionResponse(BaseModel):
    predicted_values: Dict
    confidence_scores: Dict
    risk_factors: List[str]
    recommendations: List[str]

class HealthRiskResponse(BaseModel):
    risk_scores: Dict
    risk_factors: List[str]
    prevention_recommendations: List[str]
    monitoring_schedule: Dict

@app.on_event("startup")
async def load_models():
    """Load pre-trained models on startup"""
    global nutrition_model, biomarker_model, health_risk_model
    
    try:
        # Load models (will be created during training)
        if os.path.exists("models/nutrition_model.pkl"):
            nutrition_model = joblib.load("models/nutrition_model.pkl")
            logger.info("Nutrition model loaded successfully")
        
        if os.path.exists("models/biomarker_model.pkl"):
            biomarker_model = joblib.load("models/biomarker_model.pkl")
            logger.info("Biomarker model loaded successfully")
            
        if os.path.exists("models/health_risk_model.pkl"):
            health_risk_model = joblib.load("models/health_risk_model.pkl")
            logger.info("Health risk model loaded successfully")
            
    except Exception as e:
        logger.error(f"Error loading models: {e}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "models_loaded": {
            "nutrition": nutrition_model is not None,
            "biomarker": biomarker_model is not None,
            "health_risk": health_risk_model is not None
        }
    }

@app.post("/analyze-nutrition", response_model=NutritionAnalysisResponse)
async def analyze_nutrition(request: NutritionAnalysisRequest):
    """
    Advanced nutrition analysis with healthcare insights
    """
    try:
        # Calculate molecular balance score
        molecular_score = calculate_molecular_balance_score(request)
        
        # Analyze macronutrients
        macro_analysis = analyze_macronutrients(request.meals)
        
        # Analyze micronutrients
        micro_analysis = analyze_micronutrients(request.meals)
        
        # Identify deficiency risks
        deficiency_risks = identify_deficiency_risks(request)
        
        # Generate recommendations
        recommendations = generate_nutrition_recommendations(request, molecular_score)
        
        # Generate health insights
        health_insights = generate_health_insights(request, molecular_score)
        
        return NutritionAnalysisResponse(
            molecular_balance_score=molecular_score,
            macronutrient_analysis=macro_analysis,
            micronutrient_analysis=micro_analysis,
            deficiency_risks=deficiency_risks,
            recommendations=recommendations,
            health_insights=health_insights
        )
        
    except Exception as e:
        logger.error(f"Nutrition analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict-biomarkers", response_model=BiomarkerPredictionResponse)
async def predict_biomarkers(request: BiomarkerPredictionRequest):
    """
    Predict future biomarker values based on nutrition and lifestyle
    """
    try:
        # Prepare features for prediction
        features = prepare_biomarker_features(request)
        
        # Make predictions
        predicted_values = {}
        confidence_scores = {}
        
        if biomarker_model:
            # Use trained model
            predictions = biomarker_model.predict([features])
            predicted_values = format_biomarker_predictions(predictions[0])
            confidence_scores = calculate_confidence_scores(features)
        else:
            # Use rule-based predictions
            predicted_values = rule_based_biomarker_prediction(request)
            confidence_scores = {"overall": 0.7}
        
        # Identify risk factors
        risk_factors = identify_biomarker_risk_factors(request, predicted_values)
        
        # Generate recommendations
        recommendations = generate_biomarker_recommendations(request, predicted_values)
        
        return BiomarkerPredictionResponse(
            predicted_values=predicted_values,
            confidence_scores=confidence_scores,
            risk_factors=risk_factors,
            recommendations=recommendations
        )
        
    except Exception as e:
        logger.error(f"Biomarker prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/assess-health-risk", response_model=HealthRiskResponse)
async def assess_health_risk(request: HealthRiskAssessmentRequest):
    """
    Comprehensive health risk assessment
    """
    try:
        # Calculate risk scores for various conditions
        risk_scores = calculate_health_risk_scores(request)
        
        # Identify risk factors
        risk_factors = identify_health_risk_factors(request)
        
        # Generate prevention recommendations
        prevention_recommendations = generate_prevention_recommendations(request, risk_scores)
        
        # Create monitoring schedule
        monitoring_schedule = create_monitoring_schedule(request, risk_scores)
        
        return HealthRiskResponse(
            risk_scores=risk_scores,
            risk_factors=risk_factors,
            prevention_recommendations=prevention_recommendations,
            monitoring_schedule=monitoring_schedule
        )
        
    except Exception as e:
        logger.error(f"Health risk assessment error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/train-models")
async def train_models():
    """
    Train ML models with healthcare data
    """
    try:
        # Load training data
        training_data = load_training_data()
        
        # Train nutrition model
        train_nutrition_model(training_data)
        
        # Train biomarker model
        train_biomarker_model(training_data)
        
        # Train health risk model
        train_health_risk_model(training_data)
        
        return {"message": "Models trained successfully", "timestamp": datetime.now().isoformat()}
        
    except Exception as e:
        logger.error(f"Model training error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Initialize services
nutrition_service = NutritionAnalysisService()
biomarker_model = BiomarkerPredictionModel()
risk_model = HealthRiskAssessmentModel()

# Helper functions using imported services
def calculate_molecular_balance_score(request: NutritionAnalysisRequest) -> float:
    """Calculate molecular balance score based on nutrition and health factors"""
    user_profile = {
        'age': request.age,
        'sex': request.sex,
        'weight': request.weight,
        'height': request.height,
        'activity_level': request.activity_level,
        'health_goals': request.health_goals,
        'medical_history': request.medical_history
    }
    return nutrition_service.calculate_molecular_balance_score(user_profile, request.meals)

def analyze_macronutrients(meals: List[Dict]) -> Dict:
    """Analyze macronutrient distribution and quality"""
    return nutrition_service.analyze_macronutrients(meals)

def analyze_micronutrients(meals: List[Dict]) -> Dict:
    """Analyze micronutrient intake and bioavailability"""
    return nutrition_service.analyze_micronutrients(meals)

def identify_deficiency_risks(request: NutritionAnalysisRequest) -> List[Dict]:
    """Identify potential nutrient deficiencies"""
    user_profile = {
        'age': request.age,
        'sex': request.sex,
        'weight': request.weight,
        'height': request.height,
        'activity_level': request.activity_level,
        'health_goals': request.health_goals,
        'medical_history': request.medical_history
    }
    return nutrition_service.identify_deficiency_risks(user_profile, request.meals)

def generate_nutrition_recommendations(request: NutritionAnalysisRequest, score: float) -> List[Dict]:
    """Generate personalized nutrition recommendations"""
    user_profile = {
        'age': request.age,
        'sex': request.sex,
        'weight': request.weight,
        'height': request.height,
        'activity_level': request.activity_level,
        'health_goals': request.health_goals,
        'medical_history': request.medical_history
    }
    return nutrition_service.generate_nutrition_recommendations(user_profile, request.meals, score)

def generate_health_insights(request: NutritionAnalysisRequest, score: float) -> List[str]:
    """Generate health insights based on nutrition analysis"""
    user_profile = {
        'age': request.age,
        'sex': request.sex,
        'weight': request.weight,
        'height': request.height,
        'activity_level': request.activity_level,
        'health_goals': request.health_goals,
        'medical_history': request.medical_history
    }
    return nutrition_service.generate_health_insights(user_profile, request.meals, score)

def prepare_biomarker_features(request: BiomarkerPredictionRequest) -> List[float]:
    """Prepare features for biomarker prediction"""
    return biomarker_model.prepare_features(
        request.user_profile, 
        request.nutrition_data, 
        request.current_biomarkers
    )

def format_biomarker_predictions(predictions: np.ndarray) -> Dict:
    """Format biomarker predictions"""
    biomarker_names = ['glucose', 'cholesterol', 'blood_pressure_systolic', 'blood_pressure_diastolic', 
                      'hba1c', 'triglycerides', 'hdl', 'ldl']
    return dict(zip(biomarker_names, predictions))

def calculate_confidence_scores(features: List[float]) -> Dict:
    """Calculate confidence scores for predictions"""
    # Simple confidence calculation based on feature completeness
    completeness = sum(1 for f in features if f > 0) / len(features)
    return {'overall': completeness}

def rule_based_biomarker_prediction(request: BiomarkerPredictionRequest) -> Dict:
    """Fallback rule-based biomarker predictions"""
    current = request.current_biomarkers
    predictions = {}
    
    for biomarker, value in current.items():
        if biomarker == 'glucose':
            predictions[biomarker] = value * 1.02  # Slight increase
        elif biomarker == 'cholesterol':
            predictions[biomarker] = value * 1.01  # Minimal increase
        else:
            predictions[biomarker] = value * 1.005  # Very slight increase
    
    return predictions

def identify_biomarker_risk_factors(request: BiomarkerPredictionRequest, predictions: Dict) -> List[str]:
    """Identify risk factors for biomarker predictions"""
    return biomarker_model.calculate_risk_factors(predictions)

def generate_biomarker_recommendations(request: BiomarkerPredictionRequest, predictions: Dict) -> List[str]:
    """Generate recommendations based on biomarker predictions"""
    recommendations = []
    
    if predictions.get('glucose', 90) > 100:
        recommendations.append("Consider reducing carbohydrate intake to manage glucose levels")
    
    if predictions.get('cholesterol', 180) > 200:
        recommendations.append("Focus on heart-healthy fats and increase fiber intake")
    
    if predictions.get('blood_pressure_systolic', 110) > 130:
        recommendations.append("Reduce sodium intake and increase potassium-rich foods")
    
    return recommendations

def calculate_health_risk_scores(request: HealthRiskAssessmentRequest) -> Dict:
    """Calculate health risk scores for various conditions"""
    return risk_model.calculate_risk_scores(
        request.demographics,
        request.nutrition_history,
        request.biomarker_history
    )

def identify_health_risk_factors(request: HealthRiskAssessmentRequest) -> List[str]:
    """Identify health risk factors"""
    risk_factors = []
    
    age = request.demographics.get('age', 30)
    bmi = request.demographics.get('bmi', 22)
    family_history = request.demographics.get('family_history', [])
    
    if age > 50:
        risk_factors.append("Age-related health risks")
    
    if bmi > 30:
        risk_factors.append("Obesity-related health risks")
    
    if 'diabetes' in family_history:
        risk_factors.append("Family history of diabetes")
    
    if 'heart_disease' in family_history:
        risk_factors.append("Family history of heart disease")
    
    return risk_factors

def generate_prevention_recommendations(request: HealthRiskAssessmentRequest, risk_scores: Dict) -> List[str]:
    """Generate prevention recommendations"""
    recommendations = []
    
    for condition, score in risk_scores.items():
        if score > 0.7:
            recommendations.append(f"High risk for {condition.replace('_', ' ')} - consult healthcare provider")
        elif score > 0.4:
            recommendations.append(f"Moderate risk for {condition.replace('_', ' ')} - consider lifestyle changes")
    
    return recommendations

def create_monitoring_schedule(request: HealthRiskAssessmentRequest, risk_scores: Dict) -> Dict:
    """Create monitoring schedule based on risk levels"""
    schedule = {}
    
    for condition, score in risk_scores.items():
        if score > 0.7:
            schedule[condition] = "Monthly monitoring recommended"
        elif score > 0.4:
            schedule[condition] = "Quarterly monitoring recommended"
        else:
            schedule[condition] = "Annual monitoring sufficient"
    
    return schedule

def load_training_data() -> pd.DataFrame:
    """Load training data for model training"""
    # Generate synthetic molecular health data
    from train_molecular_models import MolecularHealthTrainer
    trainer = MolecularHealthTrainer()
    return trainer.generate_molecular_health_data(n_samples=10000)

def train_nutrition_model(data: pd.DataFrame):
    """Train nutrition analysis model"""
    from train_molecular_models import MolecularHealthTrainer
    trainer = MolecularHealthTrainer()
    trainer.train_molecular_models(n_samples=10000)

def train_biomarker_model(data: pd.DataFrame):
    """Train biomarker prediction model"""
    # Already handled in train_nutrition_model
    pass

def train_health_risk_model(data: pd.DataFrame):
    """Train health risk assessment model"""
    # Already handled in train_nutrition_model
    pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
