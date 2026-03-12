# FinPilot — Frontend

> AI-powered personal finance advisor for students and young professionals.

## Tech Stack
| Tool | Purpose |
|------|---------|
| React 18 + Vite | Framework & bundler |
| Tailwind CSS | Styling |
| Framer Motion | Animations & transitions |
| React Router v6 | Page routing |
| Recharts | Charts (line, bar, pie, area) |
| Zustand | Global state management |
| Axios | HTTP client (talks to backend) |
| Lucide React | Icons |
| React Hot Toast | Notifications / alerts |

## Install
```bash
cd frontend
npm install
npm run dev
```
Runs at: `http://localhost:5173`

## Environment Variables
Create `frontend/.env`:
```
VITE_API_URL=http://localhost:5000
VITE_AI_ENABLED=true
```

---

## Design System

### Color Palette
```js
// tailwind.config.js — extend these
colors: {
  background:  '#020617',   // page background
  surface:     '#0F172A',   // card / panel background
  primary:     '#6366F1',   // indigo — buttons, highlights
  secondary:   '#14B8A6',   // teal — secondary accents
  success:     '#22C55E',   // green — savings, positive
  textPrimary: '#F1F5F9',   // headings
  textMuted:   '#94A3B8',   // labels, placeholders
}
```

### Reusable CSS patterns
```css
/* Glassmorphism card */
.glass-card {
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 16px;
}

/* Gradient accent text */
.gradient-text {
  background: linear-gradient(135deg, #6366F1, #14B8A6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Gradient button */
.btn-primary {
  background: linear-gradient(135deg, #6366F1, #14B8A6);
  transition: opacity 0.2s ease;
}
.btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
```

---

## Folder Structure
```
frontend/
├── public/
│   └── logo.svg
├── src/
│   ├── assets/                # Static images, illustrations
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx        # Dark sidebar with nav links
│   │   │   ├── TopBar.jsx         # Top header with user avatar
│   │   │   └── AppLayout.jsx      # Wrapper: Sidebar + TopBar + <Outlet/>
│   │   ├── ui/
│   │   │   ├── GlassCard.jsx      # Reusable glassmorphism card
│   │   │   ├── StatCard.jsx       # Animated metric card (balance, spending)
│   │   │   ├── ProgressBar.jsx    # Animated progress bar
│   │   │   ├── Badge.jsx          # Category / status badge
│   │   │   └── Button.jsx         # Primary / ghost button variants
│   │   ├── charts/
│   │   │   ├── SpendingAreaChart.jsx   # Weekly spending trend
│   │   │   ├── CategoryPieChart.jsx    # Expense by category (donut)
│   │   │   └── BudgetBarChart.jsx      # Budget vs actual bar chart
│   │   └── ai/
│   │       ├── AIChatWidget.jsx        # Floating AI chat bubble
│   │       └── AIInsightCard.jsx       # Inline AI suggestion card
│   ├── pages/
│   │   ├── Landing.jsx            # Public landing page
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx          # Main finance dashboard
│   │   ├── AIAdvisor.jsx          # Full AI chat page
│   │   ├── ExpenseTracker.jsx     # Add & view expenses
│   │   ├── BudgetPlanner.jsx      # Set & track budgets
│   │   └── SavingsGoals.jsx       # Goals & progress
│   ├── store/
│   │   ├── useAuthStore.js        # Zustand: user / token
│   │   ├── useExpenseStore.js     # Zustand: transactions
│   │   └── useBudgetStore.js      # Zustand: budgets & goals
│   ├── services/
│   │   ├── api.js                 # Axios instance with auth interceptor
│   │   ├── authService.js
│   │   ├── expenseService.js
│   │   ├── budgetService.js
│   │   └── aiService.js           # Calls /api/ai/chat
│   ├── utils/
│   │   ├── formatCurrency.js      # formatCurrency(1200) → "$1,200"
│   │   └── formatDate.js
│   ├── App.jsx
│   └── main.jsx
├── .env
└── package.json
```

---

## Pages & What to Build

### 1. Landing Page (`/`)
- **Hero:** headline "Your AI Financial Co-Pilot", subheadline, two CTA buttons
- **Animated preview:** mock dashboard screenshot with CSS animations
- **Feature highlights:** 3–4 icon+text cards (AI Advice, Expense Tracking, Budget Planner, Goals)
- **How it works:** numbered steps section
- **Testimonials:** 2–3 quote cards
- **Footer**

### 2. Dashboard (`/dashboard`) — requires login
Stat cards at top:
- Total Balance, Monthly Spending, Savings Rate, Budget Used

Below:
- `SpendingAreaChart` — last 7 days spending trend
- `CategoryPieChart` — spending breakdown by category
- Recent Transactions list (last 5)
- `AIInsightCard` — one AI tip based on spending

### 3. AI Financial Advisor (`/ai-advisor`)
- Full-page chat interface (like ChatGPT UI)
- User types question → backend calls AI → streams response
- Suggested questions shown as clickable chips:
  - "Can I afford this purchase?"
  - "How much should I save this month?"
  - "Where am I overspending?"
- Chat history stored in local state

### 4. Expense Tracker (`/expenses`)
- Form: title, amount, category (Food / Transport / Entertainment / Shopping / Bills / Other), date
- Expense list with delete option
- `CategoryPieChart` showing current month breakdown
- Filter by category / date range

### 5. Budget Planner (`/budget`)
- Input: monthly income
- Per-category budget inputs (Food, Transport, Entertainment, Shopping)
- `BudgetBarChart` — budget limit vs actual spending per category
- Progress bars per category (green → yellow → red as limit approaches)
- Toast alert when any category exceeds 90% of budget

### 6. Savings Goals (`/savings`)
- Add goal: name, target amount, target date
- Progress bar per goal (current saved / target)
- "Add funds" button to update progress
- `AIInsightCard` with tips to reach goals faster

---

## API Integration
`src/services/api.js` — shared Axios instance:
```js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

---

## Git Workflow
```bash
git pull origin main
git checkout -b frontend/page-name
# build the feature
git add .
git commit -m "frontend: describe what you built"
git push origin frontend/page-name
# open Pull Request on GitHub
```

## Coding Conventions
- Component files: PascalCase (`StatCard.jsx`)
- Store / service files: camelCase (`useExpenseStore.js`)
- Functional components + hooks only — no class components
- Keep components under ~120 lines; extract sub-components when larger
- All colors/spacing via Tailwind classes — no inline style unless dynamic
- Animate with Framer Motion `motion.div` — avoid CSS keyframes for interactive elements
