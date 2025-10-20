# 🚀 Deployment Guide: Render + Vercel + Supabase

## 📋 **Step-by-Step Deployment**

### **1. Supabase Database Setup**

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose organization, enter project name
   - Set database password (save this!)
   - Choose region closest to you
   - Click "Create new project"

2. **Run Database Migration**
   - Go to **SQL Editor** in Supabase dashboard
   - Click "New Query"
   - Copy entire contents of `database/migrations/001_initial_schema.sql`
   - Paste and click "Run"
   - Verify tables created in **Table Editor**

3. **Get API Keys**
   - Go to **Settings** → **API**
   - Copy **Project URL** and **anon public key**
   - Copy **service_role key** (keep this secret!)

---

### **2. Backend Deployment (Render.com)**

1. **Prepare Repository**
   ```bash
   # Push your code to GitHub
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy on Render**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` folder

3. **Configure Render Service**
   - **Name**: `molecular-nutrition-api`
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Node Version**: `18`

4. **Add Environment Variables**
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   OPENROUTER_API_KEY=your-openrouter-key
   FRONTEND_URL=https://your-app.vercel.app
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete
   - Note your API URL (e.g., `https://molecular-nutrition-api.onrender.com`)

---

### **3. Frontend Deployment (Vercel.com)**

1. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Select the `frontend` folder

2. **Configure Vercel Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Add Environment Variables**
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_API_URL=https://your-render-api.onrender.com/api
   VITE_SITE_URL=https://your-app.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Note your frontend URL (e.g., `https://molecular-nutrition-ai.vercel.app`)

---

### **4. Update Backend with Frontend URL**

1. **Update Render Environment**
   - Go back to Render dashboard
   - Go to your backend service
   - Click "Environment"
   - Update `FRONTEND_URL` with your Vercel URL
   - Click "Save Changes"
   - Service will restart automatically

---

### **5. Configure Supabase Authentication**

1. **Set Redirect URLs**
   - Go to Supabase → **Authentication** → **Settings**
   - Add to **Redirect URLs**:
     ```
     https://your-app.vercel.app/auth/callback
     ```

2. **Enable Email Confirmation**
   - In **Authentication** → **Settings**
   - Enable "Enable email confirmations"

3. **Set up Google OAuth (Optional)**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth 2.0 credentials
   - Add redirect URI: `https://your-project.supabase.co/auth/v1/callback`
   - Enable Google provider in Supabase
   - Add Client ID and Secret

---

### **6. Test Your Deployment**

1. **Test Frontend**: Visit your Vercel URL
2. **Test Backend**: Visit `https://your-api.onrender.com/api/health`
3. **Test Authentication**: Try signing up with email
4. **Test Database**: Check if data saves correctly

---

## 🔧 **Troubleshooting**

### **Common Issues:**

**Backend won't start:**
- Check environment variables are set correctly
- Verify Supabase URL and keys
- Check Render logs for errors

**Frontend build fails:**
- Check environment variables in Vercel
- Verify API URL is correct
- Check Vercel build logs

**Authentication not working:**
- Verify redirect URLs in Supabase
- Check CORS settings
- Ensure email confirmation is enabled

**Database connection issues:**
- Verify Supabase project is active
- Check API keys are correct
- Run migration SQL script

---

## 📊 **Your Live URLs**

After deployment, you'll have:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-api.onrender.com`
- **Database**: Managed by Supabase

---

## 🎉 **Success!**

Your Molecular Nutrition AI app is now live and ready for users!

**Next Steps:**
- Set up custom domain (optional)
- Configure Google OAuth (optional)
- Add monitoring and analytics
- Set up automated backups
