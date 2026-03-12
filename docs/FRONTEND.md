# MoneyBuddy — Frontend

## Tech Stack
- **Framework:** React (Vite)
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **State Management:** Context API / Zustand
- **HTTP Client:** Axios

## Folder Structure
```
frontend/
├── public/
├── src/
│   ├── assets/          # Images, icons, fonts
│   ├── components/      # Reusable UI components (Button, Card, Modal...)
│   ├── pages/           # One file per screen (Dashboard, Login, Budget...)
│   ├── hooks/           # Custom React hooks
│   ├── context/         # Global state (AuthContext, BudgetContext...)
│   ├── services/        # API calls (api.js — talks to backend)
│   ├── utils/           # Helper functions (formatCurrency, formatDate...)
│   └── App.jsx
├── .env                 # VITE_API_URL=http://localhost:5000
└── package.json
```

## Setup
```bash
cd frontend
npm install
npm run dev
```
App runs at: `http://localhost:5173`

## Environment Variables
Create a `.env` file in the `frontend/` folder:
```
VITE_API_URL=http://localhost:5000
```

## Pages to Build
| Page         | Route         | Description                        |
|--------------|---------------|------------------------------------|
| Landing      | `/`           | Home / intro page                  |
| Login        | `/login`      | User login                         |
| Register     | `/register`   | Sign up                            |
| Dashboard    | `/dashboard`  | Overview of income, expenses       |
| Transactions | `/transactions` | Add/view transactions            |
| Budget       | `/budget`     | Set and track budgets per category |
| Profile      | `/profile`    | User settings                      |

## API Integration
All backend calls go through `src/services/api.js`:
```js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

## Git Workflow
1. Always pull latest before starting: `git pull origin main`
2. Create a branch: `git checkout -b frontend/feature-name`
3. Push and open a Pull Request when done

## Coding Conventions
- Component files: PascalCase (`TransactionCard.jsx`)
- Utility files: camelCase (`formatCurrency.js`)
- Use functional components + hooks only
- Keep components small — split if a file exceeds ~100 lines
