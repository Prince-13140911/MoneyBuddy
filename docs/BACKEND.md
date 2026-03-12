# FinPilot — Backend

> REST API + AI integration for the FinPilot personal finance advisor.

## Tech Stack
| Tool | Purpose |
|------|---------|
| Node.js + Express.js | Server & REST API |
| MongoDB + Mongoose | Database & ODM |
| JWT | Authentication tokens |
| bcrypt | Password hashing |
| OpenAI SDK | AI financial advisor |
| dotenv | Environment variables |
| cors | Allow frontend requests |
| express-validator | Input validation |

## Folder Structure
```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.js         # register, login
│   │   ├── transactionController.js  # CRUD for expenses/income
│   │   ├── budgetController.js       # CRUD for budgets
│   │   ├── goalController.js         # CRUD for savings goals
│   │   └── aiController.js           # AI chat, spending analysis
│   ├── models/
│   │   ├── User.js
│   │   ├── Transaction.js
│   │   ├── Budget.js
│   │   └── Goal.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── transactionRoutes.js
│   │   ├── budgetRoutes.js
│   │   ├── goalRoutes.js
│   │   └── aiRoutes.js
│   ├── middleware/
│   │   ├── protect.js                # JWT auth guard
│   │   └── errorHandler.js           # Global error handler
│   ├── utils/
│   │   └── buildSpendingSummary.js   # Helper: format data for AI prompt
│   └── app.js                        # Express setup, mount routes
├── .env
├── .gitignore
├── server.js                         # Entry point
└── package.json
```

## Setup
```bash
cd backend
npm install
npm run dev
```
Server runs at: `http://localhost:5000`

## Environment Variables
Create `backend/.env` — **never commit this file**:
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/finpilot
JWT_SECRET=your_long_random_secret_here
OPENAI_API_KEY=sk-...
CLIENT_URL=http://localhost:5173
```
> **Never commit `.env` to GitHub.** It's already in `.gitignore`.

---

## Database Models

### User
| Field     | Type   | Notes                   |
|-----------|--------|-------------------------|
| name      | String | required                |
| email     | String | required, unique        |
| password  | String | hashed with bcrypt      |
| createdAt | Date   | auto                    |

### Transaction
| Field    | Type     | Notes                                               |
|----------|----------|-----------------------------------------------------|
| user     | ObjectId | ref: User                                           |
| title    | String   | e.g. "Lunch at Subway"                              |
| amount   | Number   | positive number                                     |
| type     | String   | `income` or `expense`                               |
| category | String   | `Food` \| `Transport` \| `Entertainment` \| `Shopping` \| `Bills` \| `Other` |
| date     | Date     | transaction date                                    |

### Budget
| Field    | Type     | Notes                              |
|----------|----------|------------------------------------|
| user     | ObjectId | ref: User                          |
| month    | String   | e.g. `"2026-03"`                   |
| income   | Number   | monthly income                     |
| limits   | Map      | `{ Food: 300, Transport: 100, ... }` |

### Goal
| Field        | Type     | Notes                      |
|--------------|----------|----------------------------|
| user         | ObjectId | ref: User                  |
| name         | String   | e.g. "Emergency Fund"      |
| targetAmount | Number   | goal target                |
| savedAmount  | Number   | current saved amount       |
| targetDate   | Date     | deadline                   |

---

## API Endpoints

> All routes except `/api/auth/*` require header:
> `Authorization: Bearer <token>`

### Auth — `/api/auth`
| Method | Endpoint    | Body                          | Response            |
|--------|-------------|-------------------------------|---------------------|
| POST   | `/register` | `{ name, email, password }`   | `{ token, user }`   |
| POST   | `/login`    | `{ email, password }`         | `{ token, user }`   |

### Transactions — `/api/transactions`
| Method | Endpoint   | Body / Query                              | Description             |
|--------|------------|-------------------------------------------|-------------------------|
| GET    | `/`        | query: `?month=2026-03&category=Food`     | Get user's transactions |
| POST   | `/`        | `{ title, amount, type, category, date }` | Add transaction         |
| PUT    | `/:id`     | any transaction fields                    | Update transaction      |
| DELETE | `/:id`     | —                                         | Delete transaction      |
| GET    | `/summary` | query: `?month=2026-03`                   | Totals by category      |

### Budgets — `/api/budgets`
| Method | Endpoint | Body                              | Description             |
|--------|----------|-----------------------------------|-------------------------|
| GET    | `/`      | query: `?month=2026-03`           | Get budget for month    |
| POST   | `/`      | `{ month, income, limits: {} }`   | Create or update budget |

### Goals — `/api/goals`
| Method | Endpoint | Body                                              | Description   |
|--------|----------|---------------------------------------------------|---------------|
| GET    | `/`      | —                                                 | Get all goals |
| POST   | `/`      | `{ name, targetAmount, savedAmount, targetDate }` | Create goal   |
| PUT    | `/:id`   | `{ savedAmount }` (or any field)                  | Update goal   |
| DELETE | `/:id`   | —                                                 | Delete goal   |

### AI Advisor — `/api/ai`
| Method | Endpoint    | Body / Query            | Description                     |
|--------|-------------|-------------------------|---------------------------------|
| POST   | `/chat`     | `{ message }`           | Send message, get AI response   |
| GET    | `/insights` | query: `?month=2026-03` | Auto-generate spending insights |

---

## Auth Middleware (`middleware/protect.js`)
```js
const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};
```
Usage: `router.get('/', protect, getTransactions)`

---

## AI Integration (`controllers/aiController.js`)
The AI controller:
1. Fetches the user's recent transactions from DB
2. Builds a spending summary string via `buildSpendingSummary.js`
3. Sends it as system context + the user's message to OpenAI
4. Returns the AI response to the frontend

```js
export const chat = async (req, res) => {
  const { message } = req.body;
  const transactions = await Transaction.find({ user: req.user._id });
  const summary = buildSpendingSummary(transactions);

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: `You are FinPilot, an AI financial advisor. User spending: ${summary}` },
      { role: 'user', content: message },
    ],
  });

  res.json({ success: true, data: completion.choices[0].message.content });
};
```

---

## Response Format
Always return consistent JSON:
```js
// Success
res.json({ success: true, data: <payload> })

// Error
res.status(4xx).json({ success: false, message: '<reason>' })
```

---

## Git Workflow
```bash
git pull origin main
git checkout -b backend/feature-name
# build the feature
git add .
git commit -m "backend: describe what you built"
git push origin backend/feature-name
# open Pull Request on GitHub
```

## Coding Conventions
- One controller per resource — keep route files thin
- Validate all inputs with `express-validator` before processing
- Never expose passwords or JWT secrets in responses
- All async handlers wrapped in try/catch or use `express-async-errors`
