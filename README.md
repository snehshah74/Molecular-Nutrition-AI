# 🧬 Molecular Nutrition AI

Production-ready healthcare-focused nutrition tracking application with AI-powered molecular health analysis.

## 🚀 Quick Deploy

### **One-Click Deployment**
This repository includes a `render.yaml` blueprint for automatic deployment to Render.com:

1. **Connect to Render:** Go to [render.com](https://render.com) and connect this GitHub repository
2. **Deploy Blueprint:** Render will automatically detect the `render.yaml` and deploy both services
3. **Configure Environment Variables:** Add your Supabase and API keys in the Render dashboard
4. **Deploy Frontend:** Deploy the `frontend/` folder to Vercel

## 🏗️ Architecture

```
Molecular-Nutrition-AI/
├── backend/                 # Node.js API (→ Render)
├── frontend/               # React App (→ Vercel)  
├── ai-integrations/         # Python AI Service (→ Render)
└── render.yaml             # Render Blueprint
```

## 🧠 AI Features

### **Molecular Health Analysis**
- **46 molecular nutrients** tracked across 6 categories
- **32 molecular biomarkers** predicted using ML models
- **5 molecular health conditions** assessed
- **Advanced AI models** trained on molecular health data

### **Healthcare-Grade Models**
- **Nutrition Analysis:** Molecular balance scoring, deficiency risk identification
- **Biomarker Prediction:** Future health trends, risk factor analysis
- **Health Risk Assessment:** Comprehensive risk scoring, prevention recommendations

## 🔧 Environment Variables

### **Backend Service**
```
NODE_ENV=production
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENROUTER_API_KEY=your-openrouter-key
FRONTEND_URL=https://your-app.vercel.app
AI_INTEGRATIONS_URL=https://ai-integrations.onrender.com
JWT_SECRET=your-jwt-secret
```

### **AI Integrations Service**
```
PYTHON_VERSION=3.11
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
FRONTEND_URL=https://your-app.vercel.app
BACKEND_URL=https://molecular-nutrition-api.onrender.com
OPENROUTER_API_KEY=your-openrouter-key
```

### **Frontend Service**
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=https://molecular-nutrition-api.onrender.com/api
VITE_AI_INTEGRATIONS_URL=https://ai-integrations.onrender.com
VITE_SITE_URL=https://your-app.vercel.app
```

## 🚀 Deployment Steps

1. **Supabase Setup:** Create project and run database migrations
2. **Render Deployment:** Connect GitHub repo and deploy blueprint
3. **Vercel Deployment:** Deploy frontend folder
4. **Environment Configuration:** Add all required environment variables
5. **Test Production:** Verify all services are communicating

## 📊 Production URLs

After deployment, you'll have:
- **Frontend:** `https://your-app.vercel.app`
- **Backend:** `https://molecular-nutrition-api.onrender.com`
- **AI Service:** `https://ai-integrations.onrender.com`
- **Database:** Supabase (PostgreSQL + Auth)

---

**Production-ready molecular health AI platform** 🏥🧬