# 🚀 Complete Deployment Guide: Full-Stack with Python AI

## 📋 **Updated Architecture**

```
Molecular-Nutrition-AI/
├── backend/                 # Node.js API (→ Render)
├── frontend/               # React App (→ Vercel)
├── ai-integrations/         # AI Integrations Service (→ Render)
├── database/               # Supabase migrations
└── DEPLOYMENT_GUIDE.md     # This guide
```

## 🚀 **Step-by-Step Deployment**

### **📊 Step 1: Supabase Database Setup**

1. **Create Supabase Project**
   - Go to **https://supabase.com**
   - Click **"New Project"**
   - **Name**: `molecular-nutrition-ai`
   - **Database Password**: Create strong password
   - **Region**: Choose closest
   - **Plan**: Free

2. **Run Database Migration**
   - Go to **SQL Editor**
   - Copy contents of `database/migrations/001_initial_schema.sql`
   - Paste and click **"Run"**

3. **Get API Keys**
   - Go to **Settings** → **API**
   - Copy **Project URL**, **anon key**, **service_role key**

---

### **🔧 Step 2: Deploy Node.js Backend to Render**

1. **Create Render Account**
   - Go to **https://render.com**
   - Sign up with GitHub

2. **Deploy Backend Service**
   - Click **"New"** → **"Web Service"**
   - Connect **snehshah74/Molecular-Nutrition-AI**
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

3. **Add Environment Variables**
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   OPENROUTER_API_KEY=your-openrouter-key
   FRONTEND_URL=https://your-app.vercel.app
   PYTHON_AI_URL=https://python-ai-service.onrender.com
   NODE_ENV=production
   ```

4. **Deploy**
   - Click **"Create Web Service"**
   - Note API URL: `https://molecular-nutrition-api.onrender.com`

---

### **🤖 Step 3: Deploy AI Integrations Service to Render**

1. **Create Second Render Service**
   - Click **"New"** → **"Web Service"**
   - Connect same repository
   - **Root Directory**: `ai-integrations`
   - **Build Command**: `pip install -r requirements.txt && python train_models.py`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

2. **Add Environment Variables**
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   FRONTEND_URL=https://your-app.vercel.app
   BACKEND_URL=https://molecular-nutrition-api.onrender.com
   OPENROUTER_API_KEY=your-openrouter-key
   ```

3. **Deploy**
   - Click **"Create Web Service"**
   - Note AI Service URL: `https://ai-integrations.onrender.com`

---

### **🎨 Step 4: Deploy Frontend to Vercel**

1. **Create Vercel Account**
   - Go to **https://vercel.com**
   - Sign up with GitHub

2. **Deploy Frontend**
   - Click **"New Project"**
   - Import **snehshah74/Molecular-Nutrition-AI**
   - **Root Directory**: `frontend`
   - **Framework**: Vite

3. **Add Environment Variables**
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_API_URL=https://molecular-nutrition-api.onrender.com/api
   VITE_AI_INTEGRATIONS_URL=https://ai-integrations.onrender.com
   VITE_SITE_URL=https://your-app.vercel.app
   ```

4. **Deploy**
   - Click **"Deploy"**
   - Note Frontend URL: `https://molecular-nutrition-ai.vercel.app`

---

### **🔐 Step 5: Configure Authentication**

1. **Update Supabase Settings**
   - Go to **Authentication** → **Settings**
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: 
     ```
     https://your-app.vercel.app/auth/callback
     ```
   - **Enable email confirmations**: ✅

2. **Update Backend URLs**
   - Go to Render → Backend Service → Environment
   - Update `FRONTEND_URL` with Vercel URL
   - Update `PYTHON_AI_URL` with Python service URL

---

### **🧪 Step 6: Test Complete System**

1. **Test Frontend**: Visit Vercel URL
2. **Test Backend**: Visit `https://your-api.onrender.com/api/health`
3. **Test AI Integrations**: Visit `https://ai-integrations.onrender.com/health`
4. **Test Authentication**: Sign up with email
5. **Test AI Features**: Add meals and check AI recommendations

---

## 🔗 **Service Integration**

### **Node.js Backend → AI Integrations Service**
```javascript
// In backend/src/services/aiService.ts
const aiIntegrationsResponse = await axios.post(
  `${process.env.AI_INTEGRATIONS_URL}/analyze-nutrition`,
  {
    age: profile.age,
    sex: profile.sex,
    weight: profile.weight,
    height: profile.height,
    activity_level: profile.lifestyle,
    health_goals: profile.health_goals,
    medical_history: profile.medical_history,
    meals: meals
  }
);
```

### **Frontend → Enhanced AI Features**
```typescript
// In frontend/src/services/apiClient.ts
export const analyzeNutritionWithAI = async (data: any) => {
  const response = await fetch(`${API_URL}/ai/analyze-nutrition`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};
```

---

## 📊 **Your Live URLs**

After deployment:
- **Frontend**: `https://molecular-nutrition-ai.vercel.app`
- **Backend**: `https://molecular-nutrition-api.onrender.com`
- **AI Integrations**: `https://ai-integrations.onrender.com`
- **Database**: Managed by Supabase

---

## 🧠 **Enhanced AI Features**

### **Healthcare-Focused Analysis**
- ✅ **Molecular Balance Scoring** (0-100)
- ✅ **Biomarker Predictions** (glucose, cholesterol, BP)
- ✅ **Health Risk Assessment** (diabetes, CVD, hypertension)
- ✅ **Medical Condition Management**
- ✅ **Deficiency Risk Identification**
- ✅ **Personalized Recommendations**

### **Advanced Models**
- ✅ **Random Forest** for nutrition analysis
- ✅ **Gradient Boosting** for risk assessment
- ✅ **Time Series** for biomarker prediction
- ✅ **Rule-based Fallbacks** for reliability

---

## 💰 **Cost Breakdown**

### **Free Tier Coverage**
- **Supabase**: Free (up to 500MB database)
- **Render**: Free (750 hours/month each service)
- **Vercel**: Free (100GB bandwidth/month)
- **Total**: $0/month

### **Scaling Costs**
- **Render**: $7/month per service when scaling
- **Supabase**: $25/month for Pro plan
- **Vercel**: $20/month for Pro plan

---

## 🚨 **Troubleshooting**

### **Common Issues**

**Python AI Service Won't Start:**
- Check Python version (3.11+)
- Verify all dependencies installed
- Check model training completed successfully

**Backend Can't Connect to Python AI:**
- Verify `PYTHON_AI_URL` environment variable
- Check Python service health endpoint
- Ensure CORS is configured

**Frontend AI Features Not Working:**
- Check `VITE_PYTHON_AI_URL` environment variable
- Verify API endpoints are correct
- Check browser console for errors

---

## 🎉 **Success Checklist**

- [ ] Supabase project created and migrated
- [ ] Node.js backend deployed to Render
- [ ] Python AI service deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] All environment variables configured
- [ ] Authentication working
- [ ] AI features responding
- [ ] All services communicating

---

## 🚀 **Next Steps**

1. **Monitor Performance**: Check Render and Vercel dashboards
2. **Add Custom Models**: Train with real healthcare data
3. **Integrate More APIs**: Add lab result APIs
4. **Scale as Needed**: Upgrade plans when user base grows

---

**Your full-stack healthcare AI application is now live!** 🏥🧬

**Total setup time: ~45 minutes**
**Total cost: $0/month (free tier)**