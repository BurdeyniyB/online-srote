# Online Store — Full-Stack E-Commerce Platform

A full-stack e-commerce application built with React, Node.js/Express, PostgreSQL, and Stripe payments.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Running Locally (Manual)](#running-locally-manual)
- [Running with Docker](#running-with-docker)
- [Database Migrations](#database-migrations)
- [Project Structure](#project-structure)
- [API Overview](#api-overview)
- [Admin Access](#admin-access)

---

## Project Overview

An online store with product catalog, shopping cart, user authentication, checkout with Stripe payment, and an admin panel for managing products and orders.

**Key features:**
- Browse and filter products by category, brand, price, rating, stock status, and sales
- Shopping basket with quantity management
- JWT-based user authentication (registration / login)
- Checkout with Stripe credit card payment
- Order management with status tracking (confirmed / in transit / completed)
- Admin panel for adding/editing products and viewing orders
- Product image support (single or multiple images per device)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, MobX, React Router 7, Bootstrap 5, Axios |
| Backend | Node.js, Express 4 |
| Database | PostgreSQL + Sequelize ORM |
| Auth | JSON Web Tokens (JWT) + bcrypt |
| Payments | Stripe |
| DevOps | Docker, Docker Compose |

---

## Prerequisites

- **Node.js** v18+ and npm
- **PostgreSQL** 14+ (or use Docker — see below)
- **Stripe account** for payment keys (free test account is sufficient)

---

## Environment Variables

### Client — `client/.env`

Copy `client/.env.example` to `client/.env` and fill in the values:

```env
# URL of the backend API (no trailing slash)
REACT_APP_API_URL=http://localhost:3000

# Stripe public key — get it from https://dashboard.stripe.com/test/apikeys
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_...
```

> `REACT_APP_*` variables are embedded at build time by Create React App.

### Server — `server/.env`

Copy `server/.env.example` to `server/.env` and fill in the values:

```env
# PostgreSQL connection details
DB_HOST=localhost
DB_PORT=5432
DB_USER=db_user
DB_PASSWORD=db_password
DB_NAME=db_name

# Server port
PORT=3000

# JWT secret — any random string, keep it private
SECRET_KEY=your_secret_key_here

# Stripe secret key — get it from https://dashboard.stripe.com/test/apikeys
STRIPE_SECRET_KEY=sk_test_...
```

> **Where to get Stripe keys:**
> 1. Create a free account at [stripe.com](https://stripe.com)
> 2. Go to **Developers → API keys**
> 3. Copy **Publishable key** → `REACT_APP_STRIPE_PUBLIC_KEY`
> 4. Copy **Secret key** → `STRIPE_SECRET_KEY`
> 5. Use test-mode keys (prefixed `pk_test_` / `sk_test_`) during development

---

## Running Locally (Manual)

### 1. Install dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Set up environment files

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
# Edit both files with your actual values
```

### 3. Create PostgreSQL database

```bash
psql -U postgres -c "CREATE DATABASE db_name;"
```

### 4. Run database migrations

```bash
cd server
npm run build
# This runs: npx sequelize-cli db:migrate
```

### 5. Start the server

```bash
cd server
npm run dev        # development mode with nodemon (auto-restart)
# or
npm start          # production mode
```

Server runs at `http://localhost:3000` (or the PORT you set in `.env`)

### 6. Start the client

```bash
cd client
npm start
```

Client dev server runs at `http://localhost:3000` by default.

> **Port conflict:** if client and server share the same port, set a different `PORT` in `server/.env` (e.g. `PORT=8080`) and update `REACT_APP_API_URL` in `client/.env` accordingly.

---

## Running with Docker

### 1. Set up server environment file

```bash
cp server/.env.example server/.env
```

Fill in `server/.env` using these values to match `docker-compose.yml`:

```env
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=root
DB_NAME=online_store
PORT=8081
SECRET_KEY=your_secret_key_here
STRIPE_SECRET_KEY=sk_test_...
```

### 2. Build and start all containers

```bash
docker-compose up --build
```

This starts three containers:

| Container | Port | Description |
|---|---|---|
| `online_store_db` | 5432 | PostgreSQL database |
| `online_store_server` | 8081 | Express API server |
| `online_store_client` | 3000 | React frontend |

### 3. Stop containers

```bash
docker-compose down          # stop and remove containers
docker-compose down -v       # also delete database volume (all data lost)
```

---

## Database Migrations

Migrations are managed with Sequelize CLI.

```bash
cd server

# Run all pending migrations
npx sequelize-cli db:migrate

# Undo the last migration
npx sequelize-cli db:migrate:undo

# Undo all migrations
npx sequelize-cli db:migrate:undo:all
```

Migration files are in `server/migrations/`.

---

## Project Structure

```
online-srote/
├── client/                         # React frontend
│   ├── public/
│   └── src/
│       ├── components/             # Reusable UI components
│       │   ├── payment/            # Stripe payment form components
│       │   └── models/             # Modal dialogs (add device, type, brand)
│       ├── pages/                  # Route-level page components
│       │   ├── Index.js            # Home page
│       │   ├── Store.js            # Product listing with filters
│       │   ├── DevicePage.js       # Single product detail
│       │   ├── Basket.js           # Shopping cart
│       │   ├── Checkout.js         # Order checkout + Stripe
│       │   ├── Auth.js             # Login / Register
│       │   └── Admin.js            # Admin dashboard
│       ├── http/                   # Axios API clients
│       │   ├── index.js            # Axios instances ($host, $authHost)
│       │   ├── userAPI.js          # Auth API calls
│       │   ├── deviceAPI.js        # Device API calls
│       │   └── paymentAPI.js       # Payment API calls
│       ├── store/                  # MobX stores
│       │   ├── UserStore.js
│       │   ├── DeviceStore.js
│       │   ├── BasketStore.js
│       │   └── OrderStore.js
│       ├── routes/                 # Route path constants
│       └── utils/                  # Helper utilities
│
├── server/                         # Express backend
│   ├── index.js                    # App entry point
│   ├── db.js                       # Sequelize DB connection
│   ├── models/
│   │   └── models.js               # Sequelize model definitions
│   ├── routes/                     # Express route handlers
│   │   ├── index.js                # Route aggregator (/api prefix)
│   │   ├── userRouter.js
│   │   ├── deviceRouter.js
│   │   ├── typeRouter.js
│   │   ├── brandRouter.js
│   │   ├── ratingRouter.js
│   │   ├── basketRouter.js
│   │   ├── orderRoutes.js
│   │   └── paymentRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT token validation
│   │   ├── checkRoleMiddleware.js  # Role-based access (ADMIN)
│   │   └── ErrorHandlingMiddleware.js
│   ├── error/
│   │   └── ApiError.js             # Custom API error class
│   ├── config/
│   │   └── config.js               # Sequelize CLI config
│   └── migrations/                 # Database migration files
│
├── database/                       # DB backup/seed files
├── docker-compose.yml
└── README.md
```

---

## API Overview

All routes are prefixed with `/api`.

### Auth — `/api/user`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/registration` | — | Register a new user |
| POST | `/login` | — | Login, returns JWT |
| GET | `/auth` | JWT | Verify token, returns user info |

### Devices — `/api/device`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | — | List devices (filter by type, brand, price, page) |
| GET | `/:id` | — | Get single device with specs |
| POST | `/` | ADMIN | Create device |
| PUT | `/:id` | ADMIN | Update device |
| DELETE | `/:id` | ADMIN | Delete device |

### Catalog — `/api/device/type`, `/api/device/brand`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/type` | — | List all types |
| POST | `/type` | ADMIN | Create type |
| GET | `/brand` | — | List all brands |
| POST | `/brand` | ADMIN | Create brand |

### Basket — `/api/basket`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | JWT | Get user's basket |
| POST | `/` | JWT | Add device to basket |
| PUT | `/:id` | JWT | Update quantity |
| DELETE | `/:id` | JWT | Remove item from basket |

### Orders — `/api/order`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | JWT | Create order from basket |
| GET | `/` | JWT | Get user's orders |
| PUT | `/:id` | ADMIN | Update order status |

### Payments — `/api/payment`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/create-intent` | JWT | Create Stripe PaymentIntent, returns client_secret |

---

## Admin Access

To make a user an admin, manually update the `role` column in the `Users` table:

```sql
UPDATE "Users" SET role = 'ADMIN' WHERE email = 'your@email.com';
```

The admin panel is available at `/admin` and is hidden from regular users in the navigation.
