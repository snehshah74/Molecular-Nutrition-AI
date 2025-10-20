"""
Molecular Health-Specific Training and Model Development
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

class MolecularHealthTrainer:
    """Train molecular health-focused ML models"""
    
    def __init__(self):
        self.nutrition_model = NutritionAnalysisModel()
        self.biomarker_model = BiomarkerPredictionModel()
        self.risk_model = HealthRiskAssessmentModel()
        
        # Molecular health specific parameters
        self.molecular_nutrients = {
            'amino_acids': ['leucine', 'isoleucine', 'valine', 'lysine', 'methionine', 'phenylalanine', 'threonine', 'tryptophan'],
            'fatty_acids': ['omega3', 'omega6', 'omega9', 'saturated', 'monounsaturated', 'polyunsaturated'],
            'vitamins': ['vitamin_a', 'vitamin_b1', 'vitamin_b2', 'vitamin_b3', 'vitamin_b6', 'vitamin_b12', 'vitamin_c', 'vitamin_d', 'vitamin_e', 'vitamin_k'],
            'minerals': ['calcium', 'iron', 'magnesium', 'phosphorus', 'potassium', 'sodium', 'zinc', 'copper', 'manganese', 'selenium'],
            'antioxidants': ['beta_carotene', 'lycopene', 'lutein', 'zeaxanthin', 'quercetin', 'resveratrol', 'curcumin'],
            'phytonutrients': ['flavonoids', 'polyphenols', 'carotenoids', 'glucosinolates', 'saponins']
        }
        
        self.molecular_biomarkers = {
            'inflammatory_markers': ['crp', 'il6', 'tnf_alpha', 'interferon_gamma'],
            'oxidative_stress': ['malondialdehyde', '8_ohdg', 'protein_carbonyls', 'lipid_peroxides'],
            'metabolic_markers': ['glucose', 'insulin', 'hba1c', 'homa_ir', 'adiponectin', 'leptin'],
            'cardiovascular': ['cholesterol', 'hdl', 'ldl', 'triglycerides', 'apob', 'lp_a'],
            'hormonal': ['cortisol', 'testosterone', 'estradiol', 'thyroid_t3', 'thyroid_t4', 'tsh'],
            'nutrient_status': ['vitamin_d', 'b12', 'folate', 'ferritin', 'zinc', 'magnesium']
        }
        
        self.molecular_health_conditions = {
            'metabolic_syndrome': ['insulin_resistance', 'inflammation', 'oxidative_stress'],
            'cardiovascular_disease': ['endothelial_dysfunction', 'inflammation', 'lipid_disorders'],
            'neurodegenerative': ['oxidative_stress', 'inflammation', 'mitochondrial_dysfunction'],
            'autoimmune': ['immune_dysregulation', 'inflammation', 'gut_dysbiosis'],
            'cancer_prevention': ['dna_repair', 'antioxidant_capacity', 'immune_function']
        }
    
    def generate_molecular_health_data(self, n_samples: int = 15000) -> pd.DataFrame:
        """Generate molecular health-specific training data"""
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
            
            # Molecular health factors
            genetic_variants = np.random.choice(['wild_type', 'heterozygous', 'homozygous'], p=[0.6, 0.3, 0.1])
            metabolic_type = np.random.choice(['slow', 'normal', 'fast'])
            inflammatory_tendency = np.random.choice(['low', 'moderate', 'high'])
            
            # Molecular nutrition intake (daily averages)
            molecular_nutrition = self._generate_molecular_nutrition()
            
            # Molecular biomarkers
            molecular_biomarkers = self._generate_molecular_biomarkers(age, sex, bmi, molecular_nutrition)
            
            # Calculate molecular balance score
            molecular_score = self._calculate_molecular_balance_score(
                age, sex, bmi, molecular_nutrition, molecular_biomarkers, 
                genetic_variants, metabolic_type, inflammatory_tendency
            )
            
            # Molecular health conditions
            molecular_conditions = self._assess_molecular_conditions(molecular_biomarkers, molecular_nutrition)
            
            # Combine all data
            record = {
                'age': age,
                'sex': sex,
                'weight': weight,
                'height': height,
                'bmi': bmi,
                'genetic_variants': genetic_variants,
                'metabolic_type': metabolic_type,
                'inflammatory_tendency': inflammatory_tendency,
                'molecular_score': molecular_score,
                **molecular_nutrition,
                **molecular_biomarkers,
                **molecular_conditions
            }
            
            data.append(record)
        
        return pd.DataFrame(data)
    
    def _generate_molecular_nutrition(self) -> Dict:
        """Generate molecular nutrition data"""
        nutrition = {}
        
        # Amino acids (grams per day)
        for aa in self.molecular_nutrients['amino_acids']:
            nutrition[f'{aa}'] = np.random.normal(2.5, 0.8)
        
        # Fatty acids (grams per day)
        for fa in self.molecular_nutrients['fatty_acids']:
            nutrition[f'{fa}'] = np.random.normal(8, 3)
        
        # Vitamins (mg/mcg per day)
        vitamin_doses = {
            'vitamin_a': (800, 200), 'vitamin_b1': (1.2, 0.3), 'vitamin_b2': (1.3, 0.3),
            'vitamin_b3': (16, 4), 'vitamin_b6': (1.3, 0.3), 'vitamin_b12': (2.4, 0.6),
            'vitamin_c': (90, 25), 'vitamin_d': (20, 5), 'vitamin_e': (15, 4), 'vitamin_k': (120, 30)
        }
        
        for vitamin, (mean, std) in vitamin_doses.items():
            nutrition[vitamin] = max(0, np.random.normal(mean, std))
        
        # Minerals (mg per day)
        mineral_doses = {
            'calcium': (1000, 200), 'iron': (15, 4), 'magnesium': (400, 80),
            'phosphorus': (700, 140), 'potassium': (3500, 700), 'sodium': (2000, 500),
            'zinc': (11, 3), 'copper': (0.9, 0.2), 'manganese': (2.3, 0.5), 'selenium': (55, 15)
        }
        
        for mineral, (mean, std) in mineral_doses.items():
            nutrition[mineral] = max(0, np.random.normal(mean, std))
        
        # Antioxidants (mg per day)
        for antioxidant in self.molecular_nutrients['antioxidants']:
            nutrition[antioxidant] = np.random.normal(5, 2)
        
        # Phytonutrients (mg per day)
        for phytonutrient in self.molecular_nutrients['phytonutrients']:
            nutrition[phytonutrient] = np.random.normal(50, 15)
        
        return nutrition
    
    def _generate_molecular_biomarkers(self, age: float, sex: str, bmi: float, nutrition: Dict) -> Dict:
        """Generate molecular biomarker data based on nutrition and demographics"""
        biomarkers = {}
        
        # Inflammatory markers
        inflammation_base = 1.0
        if bmi > 30:
            inflammation_base *= 1.5
        if age > 50:
            inflammation_base *= 1.3
        
        # Omega-3 effect on inflammation
        omega3 = nutrition.get('omega3', 0)
        inflammation_factor = max(0.5, 1.0 - (omega3 / 100))
        
        biomarkers['crp'] = np.random.normal(2.0 * inflammation_base * inflammation_factor, 0.5)
        biomarkers['il6'] = np.random.normal(3.0 * inflammation_base * inflammation_factor, 1.0)
        biomarkers['tnf_alpha'] = np.random.normal(8.0 * inflammation_base * inflammation_factor, 2.0)
        
        # Oxidative stress markers
        antioxidant_capacity = sum([
            nutrition.get('vitamin_c', 0) / 90,
            nutrition.get('vitamin_e', 0) / 15,
            nutrition.get('beta_carotene', 0) / 5,
            nutrition.get('lycopene', 0) / 5
        ]) / 4
        
        oxidative_stress = max(0.3, 1.0 - antioxidant_capacity)
        
        biomarkers['malondialdehyde'] = np.random.normal(2.5 * oxidative_stress, 0.5)
        biomarkers['8_ohdg'] = np.random.normal(5.0 * oxidative_stress, 1.0)
        biomarkers['protein_carbonyls'] = np.random.normal(3.0 * oxidative_stress, 0.8)
        
        # Metabolic markers
        glucose = np.random.normal(90, 15)
        if bmi > 30:
            glucose *= 1.1
        if nutrition.get('carbs', 0) > 300:
            glucose *= 1.05
        
        biomarkers['glucose'] = glucose
        biomarkers['insulin'] = np.random.normal(8.0, 2.0)
        biomarkers['hba1c'] = np.random.normal(5.5, 0.8)
        biomarkers['homa_ir'] = np.random.normal(2.0, 0.8)
        
        # Cardiovascular markers
        cholesterol = np.random.normal(180, 40)
        if nutrition.get('saturated', 0) > 20:
            cholesterol *= 1.1
        
        biomarkers['cholesterol'] = cholesterol
        biomarkers['hdl'] = np.random.normal(50, 15)
        biomarkers['ldl'] = np.random.normal(100, 30)
        biomarkers['triglycerides'] = np.random.normal(120, 40)
        
        # Hormonal markers
        biomarkers['cortisol'] = np.random.normal(15, 5)
        biomarkers['testosterone'] = np.random.normal(500 if sex == 'male' else 50, 100)
        biomarkers['thyroid_t3'] = np.random.normal(120, 20)
        biomarkers['thyroid_t4'] = np.random.normal(8.0, 1.5)
        biomarkers['tsh'] = np.random.normal(2.0, 1.0)
        
        # Nutrient status markers
        biomarkers['vitamin_d'] = np.random.normal(30, 10)
        biomarkers['b12'] = np.random.normal(400, 100)
        biomarkers['folate'] = np.random.normal(10, 3)
        biomarkers['ferritin'] = np.random.normal(100, 30)
        biomarkers['zinc'] = np.random.normal(80, 20)
        biomarkers['magnesium'] = np.random.normal(2.0, 0.5)
        
        return biomarkers
    
    def _calculate_molecular_balance_score(self, age: float, sex: str, bmi: float, 
                                          nutrition: Dict, biomarkers: Dict,
                                          genetic_variants: str, metabolic_type: str,
                                          inflammatory_tendency: str) -> float:
        """Calculate molecular balance score based on comprehensive molecular health factors"""
        score = 50  # Base score
        
        # Age factor (molecular aging)
        if age < 30:
            score += 10
        elif age < 50:
            score += 5
        elif age < 70:
            score -= 5
        else:
            score -= 15
        
        # BMI factor (metabolic health)
        if 18.5 <= bmi <= 24.9:
            score += 15
        elif 25 <= bmi <= 29.9:
            score += 5
        elif 30 <= bmi <= 34.9:
            score -= 10
        else:
            score -= 20
        
        # Genetic variants factor
        if genetic_variants == 'wild_type':
            score += 5
        elif genetic_variants == 'heterozygous':
            score += 2
        else:
            score -= 5
        
        # Metabolic type factor
        if metabolic_type == 'normal':
            score += 10
        elif metabolic_type == 'fast':
            score += 5
        else:
            score -= 5
        
        # Inflammatory tendency factor
        if inflammatory_tendency == 'low':
            score += 15
        elif inflammatory_tendency == 'moderate':
            score += 5
        else:
            score -= 15
        
        # Molecular nutrition factors
        nutrition_score = self._calculate_molecular_nutrition_score(nutrition)
        score += nutrition_score * 0.3
        
        # Molecular biomarker factors
        biomarker_score = self._calculate_molecular_biomarker_score(biomarkers)
        score += biomarker_score * 0.2
        
        # Molecular health condition factors
        condition_score = self._calculate_molecular_condition_score(biomarkers, nutrition)
        score += condition_score * 0.1
        
        return max(0, min(100, score))
    
    def _calculate_molecular_nutrition_score(self, nutrition: Dict) -> float:
        """Calculate molecular nutrition score"""
        score = 0
        
        # Amino acid balance
        essential_aas = ['leucine', 'isoleucine', 'valine', 'lysine', 'methionine', 'phenylalanine', 'threonine', 'tryptophan']
        aa_scores = []
        for aa in essential_aas:
            intake = nutrition.get(aa, 0)
            if 2.0 <= intake <= 3.0:  # Optimal range
                aa_scores.append(100)
            elif 1.5 <= intake <= 3.5:  # Good range
                aa_scores.append(80)
            elif 1.0 <= intake <= 4.0:  # Acceptable range
                aa_scores.append(60)
            else:
                aa_scores.append(40)
        
        score += np.mean(aa_scores) * 0.2
        
        # Fatty acid balance
        omega3 = nutrition.get('omega3', 0)
        omega6 = nutrition.get('omega6', 0)
        if omega3 > 0 and omega6 > 0:
            ratio = omega6 / omega3
            if 2 <= ratio <= 4:  # Optimal ratio
                score += 100 * 0.15
            elif 1 <= ratio <= 6:  # Good ratio
                score += 80 * 0.15
            else:
                score += 60 * 0.15
        
        # Antioxidant capacity
        antioxidants = ['vitamin_c', 'vitamin_e', 'beta_carotene', 'lycopene', 'quercetin']
        antioxidant_score = 0
        for antioxidant in antioxidants:
            intake = nutrition.get(antioxidant, 0)
            if intake > 0:
                antioxidant_score += min(100, intake * 10)  # Scale to 0-100
        
        score += (antioxidant_score / len(antioxidants)) * 0.15
        
        # Micronutrient adequacy
        vitamins = ['vitamin_d', 'vitamin_b12', 'folate']
        minerals = ['magnesium', 'zinc', 'selenium']
        
        micronutrient_score = 0
        for nutrient in vitamins + minerals:
            intake = nutrition.get(nutrient, 0)
            if intake > 0:
                micronutrient_score += min(100, intake * 5)  # Scale to 0-100
        
        score += (micronutrient_score / (len(vitamins) + len(minerals))) * 0.2
        
        # Phytonutrient diversity
        phytonutrients = ['flavonoids', 'polyphenols', 'carotenoids']
        phytonutrient_score = 0
        for phytonutrient in phytonutrients:
            intake = nutrition.get(phytonutrient, 0)
            if intake > 0:
                phytonutrient_score += min(100, intake * 2)  # Scale to 0-100
        
        score += (phytonutrient_score / len(phytonutrients)) * 0.15
        
        return score
    
    def _calculate_molecular_biomarker_score(self, biomarkers: Dict) -> float:
        """Calculate molecular biomarker score"""
        score = 0
        
        # Inflammatory markers (lower is better)
        crp = biomarkers.get('crp', 2.0)
        if crp < 1.0:
            score += 100
        elif crp < 2.0:
            score += 80
        elif crp < 3.0:
            score += 60
        else:
            score += 40
        
        # Oxidative stress markers (lower is better)
        mda = biomarkers.get('malondialdehyde', 2.5)
        if mda < 1.5:
            score += 100
        elif mda < 2.5:
            score += 80
        elif mda < 3.5:
            score += 60
        else:
            score += 40
        
        # Metabolic markers
        glucose = biomarkers.get('glucose', 90)
        if glucose < 90:
            score += 100
        elif glucose < 100:
            score += 80
        elif glucose < 110:
            score += 60
        else:
            score += 40
        
        # Cardiovascular markers
        cholesterol = biomarkers.get('cholesterol', 180)
        if cholesterol < 200:
            score += 100
        elif cholesterol < 240:
            score += 80
        elif cholesterol < 280:
            score += 60
        else:
            score += 40
        
        return score / 4  # Average of 4 categories
    
    def _calculate_molecular_condition_score(self, biomarkers: Dict, nutrition: Dict) -> float:
        """Calculate molecular health condition score"""
        score = 0
        
        # Metabolic syndrome risk
        glucose = biomarkers.get('glucose', 90)
        cholesterol = biomarkers.get('cholesterol', 180)
        triglycerides = biomarkers.get('triglycerides', 120)
        
        metabolic_risk = 0
        if glucose > 100:
            metabolic_risk += 1
        if cholesterol > 200:
            metabolic_risk += 1
        if triglycerides > 150:
            metabolic_risk += 1
        
        if metabolic_risk == 0:
            score += 100
        elif metabolic_risk == 1:
            score += 80
        elif metabolic_risk == 2:
            score += 60
        else:
            score += 40
        
        # Cardiovascular risk
        hdl = biomarkers.get('hdl', 50)
        ldl = biomarkers.get('ldl', 100)
        
        cv_risk = 0
        if hdl < 40:
            cv_risk += 1
        if ldl > 160:
            cv_risk += 1
        
        if cv_risk == 0:
            score += 100
        elif cv_risk == 1:
            score += 80
        else:
            score += 60
        
        return score / 2  # Average of 2 categories
    
    def _assess_molecular_conditions(self, biomarkers: Dict, nutrition: Dict) -> Dict:
        """Assess molecular health conditions"""
        conditions = {}
        
        # Metabolic syndrome
        glucose = biomarkers.get('glucose', 90)
        cholesterol = biomarkers.get('cholesterol', 180)
        triglycerides = biomarkers.get('triglycerides', 120)
        hdl = biomarkers.get('hdl', 50)
        
        metabolic_syndrome = 0
        if glucose > 100:
            metabolic_syndrome += 1
        if cholesterol > 200:
            metabolic_syndrome += 1
        if triglycerides > 150:
            metabolic_syndrome += 1
        if hdl < 40:
            metabolic_syndrome += 1
        
        conditions['metabolic_syndrome_risk'] = metabolic_syndrome
        
        # Cardiovascular disease risk
        crp = biomarkers.get('crp', 2.0)
        ldl = biomarkers.get('ldl', 100)
        
        cv_risk = 0
        if crp > 3.0:
            cv_risk += 1
        if ldl > 160:
            cv_risk += 1
        
        conditions['cardiovascular_risk'] = cv_risk
        
        # Oxidative stress
        mda = biomarkers.get('malondialdehyde', 2.5)
        oxidative_stress = 1 if mda > 3.0 else 0
        conditions['oxidative_stress'] = oxidative_stress
        
        # Inflammation
        il6 = biomarkers.get('il6', 3.0)
        inflammation = 1 if il6 > 5.0 else 0
        conditions['inflammation'] = inflammation
        
        return conditions
    
    def prepare_molecular_training_data(self, df: pd.DataFrame) -> Tuple[np.ndarray, Dict]:
        """Prepare molecular health training data"""
        
        # Features for molecular nutrition analysis
        molecular_features = []
        
        # Demographics
        molecular_features.extend(['age', 'sex', 'weight', 'height', 'bmi'])
        
        # Molecular nutrition features
        molecular_features.extend(list(self.molecular_nutrients['amino_acids']))
        molecular_features.extend(list(self.molecular_nutrients['fatty_acids']))
        molecular_features.extend(list(self.molecular_nutrients['vitamins']))
        molecular_features.extend(list(self.molecular_nutrients['minerals']))
        molecular_features.extend(list(self.molecular_nutrients['antioxidants']))
        molecular_features.extend(list(self.molecular_nutrients['phytonutrients']))
        
        # Molecular biomarker features
        molecular_features.extend(list(self.molecular_biomarkers['inflammatory_markers']))
        molecular_features.extend(list(self.molecular_biomarkers['oxidative_stress']))
        molecular_features.extend(list(self.molecular_biomarkers['metabolic_markers']))
        molecular_features.extend(list(self.molecular_biomarkers['cardiovascular']))
        molecular_features.extend(list(self.molecular_biomarkers['hormonal']))
        molecular_features.extend(list(self.molecular_biomarkers['nutrient_status']))
        
        # Target for molecular nutrition model
        molecular_target = df['molecular_score'].values
        
        # Features for molecular biomarker prediction
        biomarker_features = molecular_features.copy()
        
        # Targets for molecular biomarker models
        biomarker_targets = {}
        for category, markers in self.molecular_biomarkers.items():
            for marker in markers:
                if marker in df.columns:
                    # Predict future values with molecular health trends
                    current_values = df[marker].values
                    future_values = current_values * (1 + np.random.normal(0, 0.05, len(current_values)))
                    biomarker_targets[marker] = future_values
        
        # Features for molecular health risk assessment
        risk_features = molecular_features.copy()
        
        # Targets for molecular risk models
        risk_targets = {
            'metabolic_syndrome': (df['metabolic_syndrome_risk'] > 2).astype(int).values,
            'cardiovascular_disease': (df['cardiovascular_risk'] > 1).astype(int).values,
            'oxidative_stress': df['oxidative_stress'].values,
            'inflammation': df['inflammation'].values
        }
        
        return (df[molecular_features].values, molecular_target), (df[biomarker_features].values, biomarker_targets), (df[risk_features].values, risk_targets)
    
    def train_molecular_models(self, n_samples: int = 15000):
        """Train molecular health-specific models"""
        logger.info("Generating molecular health training data...")
        df = self.generate_molecular_health_data(n_samples)
        
        logger.info("Preparing molecular training data...")
        (molecular_X, molecular_y), (biomarker_X, biomarker_y), (risk_X, risk_y) = self.prepare_molecular_training_data(df)
        
        # Create models directory
        os.makedirs("models", exist_ok=True)
        
        # Train molecular nutrition analysis model
        logger.info("Training molecular nutrition analysis model...")
        self.nutrition_model.train(molecular_X, molecular_y)
        self.nutrition_model.save_model("models/molecular_nutrition_model.pkl")
        
        # Train molecular biomarker prediction models
        logger.info("Training molecular biomarker prediction models...")
        self.biomarker_model.train(biomarker_X, biomarker_y)
        self.biomarker_model.save_model("models/molecular_biomarker_model.pkl")
        
        # Train molecular health risk assessment models
        logger.info("Training molecular health risk assessment models...")
        self.risk_model.train(risk_X, risk_y)
        self.risk_model.save_model("models/molecular_health_risk_model.pkl")
        
        logger.info("All molecular health models trained successfully!")
        
        # Print model performance
        self._evaluate_molecular_models(molecular_X, molecular_y, biomarker_X, biomarker_y, risk_X, risk_y)
        
        # Save training data for analysis
        df.to_csv("models/molecular_health_training_data.csv", index=False)
        logger.info("Training data saved to models/molecular_health_training_data.csv")
    
    def _evaluate_molecular_models(self, molecular_X, molecular_y, biomarker_X, biomarker_y, risk_X, risk_y):
        """Evaluate molecular health model performance"""
        logger.info("Evaluating molecular health model performance...")
        
        # Evaluate molecular nutrition model
        molecular_pred = self.nutrition_model.molecular_balance_model.predict(molecular_X)
        molecular_mse = mean_squared_error(molecular_y, molecular_pred)
        logger.info(f"Molecular nutrition model MSE: {molecular_mse:.2f}")
        
        # Evaluate molecular biomarker models
        for biomarker, model in self.biomarker_model.biomarker_models.items():
            if model is not None:
                pred = model.predict(biomarker_X)
                mse = mean_squared_error(biomarker_y[biomarker], pred)
                logger.info(f"Molecular {biomarker} model MSE: {mse:.2f}")
        
        # Evaluate molecular risk models
        for risk_category, model in self.risk_model.risk_models.items():
            if model is not None:
                pred = model.predict(risk_X)
                accuracy = accuracy_score(risk_y[risk_category], pred)
                logger.info(f"Molecular {risk_category} risk model accuracy: {accuracy:.2f}")

def main():
    """Main training function for molecular health models"""
    trainer = MolecularHealthTrainer()
    trainer.train_molecular_models(n_samples=15000)

if __name__ == "__main__":
    main()
