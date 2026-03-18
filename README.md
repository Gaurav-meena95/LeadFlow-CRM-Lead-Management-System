# LeadFlow CRM

A full-stack Lead Management System built with the MERN stack. Designed for real estate teams to manage leads, track visits, and monitor the sales pipeline with role-based access control.

**Live Frontend**: https://lead-flow-crm-lead-management-syste.vercel.app  
**Live Backend**: https://leadflow-crm-lead-management-system.onrender.com

---

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Axios, Lucide React
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt

---

## Project Structure

```
Crm/
├── Backend/
│   ├── index.js                  # Entry point
│   ├── config/db.js              # MongoDB connection
│   ├── middleware/authMiddleware.js
│   ├── modules/
│   │   ├── auth/                 # User auth (signup, login, JWT)
│   │   ├── leads/                # Lead management
│   │   └── visits/               # Visit scheduling
│   └── utils/
│       ├── roundRobin.js         # Auto agent assignment
│       └── utils.js
└── Frontend/
    ├── src/
    │   ├── pages/                # Dashboard, Leads, Pipeline, Visits, Agents, Settings
    │   ├── components/           # Sidebar, Navbar, DataTable, LeadDrawer, etc.
    │   └── services/api.js       # Axios instance with JWT interceptors
    └── index.html
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

```bash
cd Backend
npm install
```

Create `Backend/.env`:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
sec_key=your_jwt_secret
```

```bash
npm run dev
```

### Frontend Setup

```bash
cd Frontend
npm install
```

Create `Frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## Test Credentials

These users are auto-seeded on first backend start.

| Role    | Email              | Password     |
|---------|--------------------|--------------|
| Admin   | admin@crm.com      | Admin@123    |
| Manager | manager@crm.com    | Manager@123  |
| Agent   | agent@crm.com      | Agent@123    |

---

## Role-Based Access

| Feature              | Admin | Manager | Agent |
|----------------------|-------|---------|-------|
| View all leads       | yes   | yes     | own only |
| Add lead             | yes   | yes     | no    |
| Assign agent         | yes   | yes     | no    |
| Change lead status   | yes   | yes     | yes   |
| Schedule visit       | yes   | yes     | yes   |
| Complete/cancel visit| yes   | yes     | yes   |
| View pipeline        | yes   | yes     | yes   |
| Agents page          | yes   | no      | no    |
| Add user             | yes   | no      | no    |

---

## API Endpoints

### Auth — `/api/auth`

| Method | Endpoint       | Auth     | Description              |
|--------|----------------|----------|--------------------------|
| POST   | `/signup`      | public   | Create new user          |
| POST   | `/login`       | public   | Login, returns JWT       |
| POST   | `/refresh`     | public   | Refresh access token     |
| GET    | `/me`          | required | Get current user profile |
| PATCH  | `/me`          | required | Update profile/password  |
| GET    | `/users`       | manager+ | List all users           |

### Leads — `/api/leads`

| Method | Endpoint       | Auth     | Description                        |
|--------|----------------|----------|------------------------------------|
| POST   | `/public`      | public   | Submit lead from public form       |
| POST   | `/`            | manager+ | Create lead (manual, with agent)   |
| GET    | `/`            | required | Get leads (filtered by role)       |
| PATCH  | `/:id`         | required | Update lead status / assign agent  |

### Visits — `/api/visits`

| Method | Endpoint       | Auth     | Description              |
|--------|----------------|----------|--------------------------|
| POST   | `/`            | required | Schedule a visit         |
| GET    | `/`            | required | Get visits (with filter) |
| PATCH  | `/:id`         | required | Update visit status      |

### Dashboard — `/api/dashboard`

| Method | Endpoint       | Auth     | Description                        |
|--------|----------------|----------|------------------------------------|
| GET    | `/`            | required | Stats + today's visits             |

---

## Key Features

**Lead Management**
- Public lead capture form at `/lead` (no login required)
- Leads auto-assigned to agents via round-robin
- Manual assignment by admin/manager
- Lead sources: website, facebook, whatsapp, referral

**Pipeline View**
- Kanban board with 6 stages: new → contacted → visit_scheduled → visit_done → booked → lost
- Drag-free status change via dropdown on each card
- Click any card to open full lead details drawer

**Visit Tracking**
- Schedule visits linked to leads and agents
- Mark as completed, booked, or cancelled
- Visit history visible in lead drawer

**Dashboard**
- Live stats: total leads, new, contacted, visit scheduled, booked, lost
- Today's scheduled visits with lead and agent info

**Auth**
- JWT access token (1h) + refresh token (7d)
- Auto token renewal via Axios interceptors
- Tokens stored in localStorage

---

## Password Rules

- Minimum 8 characters
- Must contain at least one special character: `! @ # $ % ^ & *`

---

## Public Lead Form

Accessible at `/lead` without login. Submits to `POST /api/leads/public`. Agent is auto-assigned via round-robin.
