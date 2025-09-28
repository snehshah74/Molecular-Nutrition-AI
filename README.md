# Molecular Nutrition AI

A professional React.js + TypeScript application that provides personalized molecular-level nutrition analysis using AI recommendations.

## 🌟 Features

### Core Functionality
- **User Profile Setup**: Comprehensive health and lifestyle profiling
- **Food Logging**: Real-time meal tracking with molecular nutrition breakdown
- **Nutrient Dashboard**: Interactive visualizations of macronutrients and micronutrients
- **AI Recommendations**: Personalized nutrition insights powered by OpenRouter/GPT-4o
- **Progress Tracking**: Long-term health trends and molecular balance scoring

### Technical Highlights
- **Modern Stack**: React 18 + TypeScript + Vite
- **Beautiful UI**: Tailwind CSS with molecular biology theme
- **Data Visualization**: Recharts for interactive charts and graphs
- **Smooth Animations**: Framer Motion for delightful user experience
- **Form Validation**: React Hook Form with Zod schema validation
- **Dark/Light Mode**: Complete theme support
- **Responsive Design**: Mobile-first approach

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd molecular-nutrition-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   VITE_OPENROUTER_API_KEY=your-openrouter-api-key
   VITE_EDAMAM_APP_ID=your-edamam-app-id
   VITE_EDAMAM_APP_KEY=your-edamam-app-key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 API Configuration

### OpenRouter API (Required for AI Recommendations)
1. Sign up at [OpenRouter](https://openrouter.ai/)
2. Get your API key from the dashboard
3. Add it to your `.env` file as `VITE_OPENROUTER_API_KEY`

### Edamam Nutrition API (Optional)
1. Sign up at [Edamam](https://developer.edamam.com/)
2. Create a new application
3. Add your App ID and App Key to `.env`

*Note: The app includes mock nutrition data for development without API keys.*

## 🔄 Application Workflow

### Complete User Journey

#### 1. **Initial Setup & Profile Creation**
```
User visits app → Profile Setup Form → Complete Profile → Dashboard Access
```

**Profile Setup Process:**
- **Step 1**: Basic Information (Age, Sex, Ethnicity, Region)
- **Step 2**: Health & Lifestyle (Lifestyle preferences, Medical history)
- **Step 3**: Health Goals (Select from: weight_loss, muscle_gain, mental_clarity, etc.)
- **Step 4**: Complete Setup → Redirect to Dashboard

**Data Stored:**
- User profile in localStorage
- Sample nutrition data generated automatically
- AI recommendations initialized

#### 2. **Dashboard Navigation**
```
Header Navigation → Dashboard/Food Log/AI Insights/Progress
```

**Navigation Options:**
- **Dashboard**: Nutrient overview with charts and molecular balance score
- **Food Log**: Add meals and track daily intake
- **AI Insights**: View personalized nutrition recommendations
- **Progress**: Track long-term health trends

**Profile Management:**
- **Header Profile Dropdown**: Access profile, edit details, logout
- **Edit Profile**: Modify age, sex, lifestyle preferences
- **Logout**: Clear all data and return to profile setup

#### 3. **Food Logging Workflow**
```
Add Meal → Select Food Items → Enter Quantities → Save Meal → Update Dashboard
```

**Food Logging Process:**
1. **Click "Add Meal"** button
2. **Enter meal details** (name, description, time)
3. **Add food items** with quantities
4. **Save meal** → Automatically updates nutrition calculations
5. **View updated dashboard** with new nutrition data

**Nutrition Calculations:**
- Macronutrients: Protein, Carbs, Fat, Fiber, Calories
- Micronutrients: Vitamins, Minerals, Amino acids
- Molecular balance score updated in real-time

#### 4. **AI Recommendations Workflow**
```
Analyze Nutrition Data → Identify Deficiencies → Generate Recommendations → Display Insights
```

**AI Analysis Process:**
1. **Analyze current nutrition data** from logged meals
2. **Compare against user targets** based on profile
3. **Identify deficiencies** and imbalances
4. **Generate personalized recommendations** using GPT-4o
5. **Display actionable insights** with food suggestions

**Recommendation Types:**
- **Food Suggestions**: Specific foods to add to diet
- **Lifestyle Tips**: General nutrition advice
- **Deficiency Alerts**: Nutrients that need attention
- **Goal-Specific Advice**: Targeted recommendations for health goals

#### 5. **Progress Tracking Workflow**
```
Collect Daily Data → Calculate Trends → Generate Insights → Display Progress
```

**Progress Analysis:**
- **Daily nutrition tracking** over time
- **Molecular balance score** trends
- **Deficiency patterns** identification
- **Goal achievement** monitoring

### 🔧 Technical Workflow

#### **Data Flow Architecture**
```
User Input → Local Storage → State Management → UI Updates → AI Processing
```

#### **State Management Flow**
1. **useAppState Hook**: Central state management
2. **LocalStorageService**: Data persistence
3. **Component Updates**: Reactive UI changes
4. **API Integration**: AI recommendations and nutrition data

#### **API Integration Workflow**
```
User Action → API Call → Data Processing → State Update → UI Render
```

**API Calls:**
- **OpenRouter API**: AI recommendation generation
- **Edamam API**: Nutrition data lookup (with mock fallback)
- **Local Storage**: Profile and meal data persistence

### 🎯 User Interaction Patterns

#### **Dashboard Interaction**
1. **View Overview**: See molecular balance score and key metrics
2. **Switch Tabs**: Navigate between Overview, Macronutrients, Micronutrients
3. **Interact with Charts**: Hover for details, click for more info
4. **Access Profile**: Click profile dropdown in header

#### **Food Logging Interaction**
1. **Add New Meal**: Click "Add Meal" button
2. **Fill Meal Details**: Enter name, description, time
3. **Add Food Items**: Search and add foods with quantities
4. **Save and View**: Save meal and see updated nutrition data

#### **AI Insights Interaction**
1. **View Recommendations**: See personalized nutrition advice
2. **Filter by Type**: Filter recommendations by category
3. **Mark as Read**: Track which recommendations you've seen
4. **Generate New**: Click "Generate Recommendations" for fresh insights

#### **Profile Management Interaction**
1. **Access Profile**: Click profile dropdown in header
2. **View Information**: See current profile details
3. **Edit Details**: Click edit button to modify information
4. **Save Changes**: Save updates or cancel changes
5. **Logout**: Clear all data and return to setup

### 📊 Data Visualization Workflow

#### **Chart Generation Process**
```
Nutrition Data → Chart Configuration → Recharts Rendering → Interactive Display
```

**Chart Types:**
- **Pie Charts**: Macronutrient distribution
- **Bar Charts**: Micronutrient levels vs targets
- **Line Charts**: Progress trends over time
- **Progress Bars**: Daily target achievement

#### **Real-time Updates**
1. **User adds meal** → Nutrition data updates
2. **Charts recalculate** → Visual representations update
3. **AI reanalyzes** → New recommendations generated
4. **Dashboard refreshes** → All components show latest data

### 🔄 Error Handling Workflow

#### **Error Scenarios & Recovery**
1. **API Failures**: Fallback to mock data
2. **Profile Missing**: Redirect to profile setup
3. **Data Corruption**: Clear localStorage and restart
4. **Network Issues**: Show offline mode with cached data

#### **Debug Tools Available**
- **Debug Panel**: Red bug icon in bottom right
- **Clear Daily Intake**: Force recreation of sample data
- **Clear Profile**: Reset user profile
- **Clear All Data**: Complete application reset

### 🚀 Performance Optimization Workflow

#### **Loading States**
1. **Initial Load**: Show loading skeletons
2. **Data Fetching**: Display progress indicators
3. **AI Processing**: Show "Generating recommendations..." message
4. **Chart Rendering**: Smooth animations during updates

#### **Caching Strategy**
- **Local Storage**: Profile and meal data cached
- **Session Storage**: Temporary UI state
- **Memory Cache**: Recent API responses
- **Lazy Loading**: Components loaded on demand

### 📱 Responsive Design Workflow

#### **Device Adaptation**
1. **Desktop**: Full sidebar navigation, large charts
2. **Tablet**: Collapsible sidebar, medium charts
3. **Mobile**: Header navigation, compact charts, touch-friendly

#### **Breakpoint Management**
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### 🔐 Security Workflow

#### **Data Protection**
1. **Local Storage Only**: No server-side data storage
2. **API Key Security**: Environment variables only
3. **Input Validation**: Zod schema validation
4. **XSS Protection**: Sanitized user inputs

#### **Privacy Compliance**
- **GDPR Compliant**: Local data storage only
- **No Tracking**: No analytics or user tracking
- **Data Control**: Users can clear all data anytime
- **Transparent**: Open source, auditable code

## 🏗️ Project Structure

```
src/
├── components/
│   ├── layout/          # Header, Sidebar, Footer
│   ├── profiles/        # UserProfileSetup
│   ├── logging/         # FoodLogger, MealHistory
│   ├── dashboard/       # NutrientDashboard, Charts
│   ├── ai/             # AIRecommendations
│   └── progress/       # ProgressInsights, Trends
├── services/
│   ├── api.ts          # OpenRouter & Nutrition APIs
│   └── calculations.ts # Nutrient calculations
├── types/              # TypeScript interfaces
├── hooks/              # Custom React hooks
├── contexts/           # Theme context
└── lib/                # Utility functions
```

## 🎨 Design System

### Color Palette
- **Primary**: Blues (#3B82F6, #0EA5E9)
- **Secondary**: Greens (#22C55E, #10B981)
- **Warning**: Yellows (#EAB308, #F59E0B)
- **Danger**: Reds (#EF4444, #DC2626)

### Molecular Theme Elements
- DNA helix icons and animations
- Chemical structure backgrounds
- Gradient overlays with health colors
- Smooth molecular floating animations

## 🔬 Molecular Nutrition Features

### Macronutrient Analysis
- Protein, Carbohydrates, Fat distribution
- Calorie breakdown with visual pie charts
- Progress bars showing daily targets vs actual

### Micronutrient Tracking
- Vitamin and mineral heatmaps
- Amino acids and fatty acids breakdown
- Color-coded deficiency alerts

### AI-Powered Insights
- Personalized food suggestions
- Deficiency detection and recommendations
- Context-aware advice considering:
  - Dietary preferences (vegan/vegetarian/etc.)
  - Allergies and medical restrictions
  - Cultural food availability
  - Health goals

## 📊 Data Visualization

### Charts and Graphs
- **Pie Charts**: Macronutrient distribution
- **Bar Charts**: Micronutrient levels vs targets
- **Line Charts**: Progress trends over time
- **Area Charts**: Molecular balance score evolution

### Interactive Elements
- Hover tooltips with detailed information
- Clickable nutrient cards
- Animated progress bars
- Real-time status updates

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Husky for git hooks (optional)

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

## 🔒 Privacy & Security

- All data stored locally in browser
- No personal information sent to external servers
- API keys are environment variables only
- GDPR compliant data handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenRouter](https://openrouter.ai/) for AI API access
- [Edamam](https://developer.edamam.com/) for nutrition data
- [Recharts](https://recharts.org/) for data visualization
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📞 Support

For support, email support@molecularnutrition.ai or create an issue in the repository.

---

**Built with ❤️ for better health through molecular nutrition**
