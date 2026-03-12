# MoneyBuddy — Backend

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt

## Folder Structure
```
backend/
├── src/
│   ├── controllers/     # Logic for each route (authController, transactionController...)
│   ├── models/          # Mongoose schemas (User, Transaction, Budget...)
│   ├── routes/          # Route definitions (authRoutes, transactionRoutes...)
│   ├── middleware/       # Auth middleware (protect.js), error handler
│   ├── utils/           # Helper functions
│   └── app.js           # Express app setup
├── .env                 # Secrets (never commit this!)
├── server.js            # Entry point
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
Create a `.env` file in the `backend/` folder:
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/moneybuddy
JWT_SECRET=your_super_secret_key
```
> **Never commit `.env` to GitHub.** It's already in `.gitignore`.

## Database Models

### User
| Field     | Type   | Notes              |
|-----------|--------|--------------------|
| name      | String | required           |
| email     | String | required, unique   |
| password  | String | hashed with bcrypt |
| createdAt | Date   | auto               |

### Transaction
| Field       | Type     | Notes                        |
|-------------|----------|------------------------------|
| user        | ObjectId | ref: User                    |
| title       | String   | e.g. "Groceries"             |
| amount      | Number   | positive number              |
| type        | String   | `income` or `expense`        |
| category    | String   | e.g. "Food", "Rent"          |
| date        | Date     | transaction date             |

### Budget
| Field    | Type     | Notes             |
|----------|----------|-------------------|
| user     | ObjectId | ref: User         |
| category | String   | e.g. "Food"       |
| limit    | Number   | monthly limit     |
| month    | String   | e.g. "2026-03"    |

## API Endpoints

### Auth
| Method | Endpoint             | Description        |
|--------|----------------------|--------------------|
| POST   | `/api/auth/register` | Register new user  |
| POST   | `/api/auth/login`    | Login, returns JWT |

### Transactions
| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| GET    | `/api/transactions`         | Get all (logged-in user) |
| POST   | `/api/transactions`         | Add new transaction      |
| PUT    | `/api/transactions/:id`     | Update transaction       |
| DELETE | `/api/transactions/:id`     | Delete transaction       |

### Budgets
| Method | Endpoint            | Description         |
|--------|---------------------|---------------------|
| GET    | `/api/budgets`      | Get all budgets     |
| POST   | `/api/budgets`      | Create/update budget|

## Auth Middleware
Protect private routes using `middleware/protect.js`:
```js
const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized' });
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id).select('-password');
  next();
};
```
Use it on routes: `router.get('/', protect, getTransactions)`

## Git Workflow
1. Always pull latest before starting: `git pull origin main`
2. Create a branch: `git checkout -b backend/feature-name`
3. Push and open a Pull Request when done

## Coding Conventions
- One controller per resource (transactionController.js)
- Always return consistent JSON: `{ success: true, data: ... }` or `{ success: false, message: ... }`
- Never put logic in route files — keep routes thin, controllers fat
