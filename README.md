# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js) using **TypeScript** throughout.

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication with bcrypt password hashing
- Role-Based Access Control (Admin & Sales User)
- Protected routes with auth middleware

### Leads Management (CRUD)
- Create, Read, Update, Delete leads
- Lead fields: Name, Email, Status (New/Contacted/Qualified/Lost), Source (Website/Instagram/Referral)
- View single lead details

### Advanced Filtering & Search
- Filter by Status and Source
- Search by Name or Email (debounced, 300ms)
- Sort by Latest / Oldest
- Multiple filters work together

### Pagination
- Backend pagination with 10 records per page
- Pagination metadata (page, limit, total, totalPages)

### Additional Features
- **CSV Export** — Export filtered leads as CSV file
- **Dark Mode** — Toggle with localStorage persistence
- **Docker Setup** — Full Docker Compose configuration
- **Responsive Design** — Mobile-first, works on all devices

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, TypeScript, TailwindCSS, Vite |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT + bcrypt |
| Styling | TailwindCSS v4 |
| Containerization | Docker + Docker Compose |

---

## 📁 Project Structure

```
Smart Leads Dashboard/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/            # Axios client & API services
│   │   ├── components/     # Reusable UI & lead components
│   │   ├── contexts/       # Auth & Theme contexts
│   │   ├── hooks/          # Custom hooks (useDebounce)
│   │   ├── pages/          # Page components
│   │   ├── types/          # TypeScript interfaces
│   │   └── utils/          # Helper functions
│   ├── Dockerfile
│   └── nginx.conf
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/         # DB connection & env config
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, RBAC, validation, errors
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routes
│   │   ├── services/       # Business logic layer
│   │   ├── types/          # TypeScript types & enums
│   │   ├── utils/          # ApiError, ApiResponse, asyncHandler
│   │   └── validators/     # Express-validator chains
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Setup

```bash
git clone <repo-url>
cd smart-leads-dashboard
```

### 2. Backend Setup

```bash
cd server
cp ../.env.example .env    # Edit with your MongoDB URI & JWT secret
npm install
npm run seed               # Seed test data
npm run dev                # Starts on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev                # Starts on http://localhost:5173
```

### 4. Docker Setup (Alternative)

```bash
docker-compose up --build
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
```

---

## 🔑 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@smartleads.com | admin123 |
| Sales | sales@smartleads.com | sales123 |

---

## 📡 API Documentation

### Base URL: `http://localhost:5000/api`

### Auth Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/me` | Get current user | Yes |

### Lead Endpoints
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/leads` | List leads (paginated, filtered) | Yes | Any |
| GET | `/leads/:id` | Get single lead | Yes | Any |
| POST | `/leads` | Create lead | Yes | Any |
| PUT | `/leads/:id` | Update lead | Yes | Any |
| DELETE | `/leads/:id` | Delete lead | Yes | Admin only |
| GET | `/leads/export/csv` | Export leads as CSV | Yes | Any |

### Query Parameters (GET /leads)
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |
| status | string | Filter: New, Contacted, Qualified, Lost |
| source | string | Filter: Website, Instagram, Referral |
| search | string | Search name or email |
| sortBy | string | latest (default) or oldest |

### Response Format
```json
{
  "success": true,
  "message": "Leads retrieved successfully",
  "data": { "leads": [...] },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 20,
    "totalPages": 2,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## 🔒 Environment Variables

See `.env.example` for all required variables:

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/smart-leads |
| JWT_SECRET | JWT signing secret | — |
| JWT_EXPIRES_IN | Token expiry | 7d |
| CLIENT_URL | Frontend URL (CORS) | http://localhost:5173 |
