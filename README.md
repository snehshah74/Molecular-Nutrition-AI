# 🧬 Molecular Nutrition AI

A full-stack nutrition tracking application with AI-powered recommendations, built with React, Node.js, and Supabase.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Supabase account
- OpenRouter API key (for AI features)

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
cd Molecular-Nutrition-AI-2.0
npm run install:all
```

2. **Set up Supabase**
   - Create project at [supabase.com](https://supabase.com)
   - Run database migration from `database/migrations/001_initial_schema.sql`
   - Get API keys from Settings → API

3. **Configure environment**

**Backend** (`backend/.env`):
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENROUTER_API_KEY=your-openrouter-key
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`frontend/.env`):
   ```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:3001/api
```

4. **Start development servers**
   ```bash
   npm run dev
   ```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## 🏗️ Architecture

```
├── backend/          # Node.js + Express API
├── frontend/         # React + Vite SPA
├── database/         # Supabase migrations
└── docker-compose.yml # Production deployment
```

## 🔐 Authentication

- Email confirmation required
- Google OAuth integration
- Phone authentication (SMS)
- Secure JWT tokens

## 🚢 Production Deployment

### Recommended: Platform Deployment
- **Backend**: Deploy `backend/` folder to [Render.com](https://render.com)
- **Frontend**: Deploy `frontend/` folder to [Vercel.com](https://vercel.com)
- **Database**: [Supabase](https://supabase.com) (managed)

### Quick Deploy
1. Push code to GitHub
2. Connect GitHub to Render (backend)
3. Connect GitHub to Vercel (frontend)
4. Set up Supabase database
5. Add environment variables
6. Deploy!

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

## 📊 Features

- User profiles and health tracking
- Meal logging with nutrition analysis
- AI-powered recommendations
- Biomarker tracking
- Progress analytics
- Responsive design

## 🛠️ Tech Stack

**Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion, Recharts
**Backend**: Node.js, Express, TypeScript, Supabase
**Database**: PostgreSQL (via Supabase)
**AI**: OpenRouter (GPT-4o)
**Deployment**: Render, Vercel, Supabase

## 📄 License

MIT License - see LICENSE file for details.

---

**Built for better health through molecular nutrition** 🧬