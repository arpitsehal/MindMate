# MindMate 🧠

[![Node.js CI](https://img.shields.io/badge/Node.js-Express-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/Frontend-React-blue)](https://react.dev/)
[![SQLite](https://img.shields.io/badge/Database-SQLite-lightgrey)](https://sqlite.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A modern mental wellness tracker and user authentication system built with React, Node.js/Express, and SQLite.

---

## ✨ Features

- User registration & login
- Secure password hashing (bcrypt)
- JWT-based authentication
- SQLite for persistent storage
- Track mood history and user streaks
- Modern UI with Tailwind CSS
- Form validation & error handling
- "Remember me" functionality

---

## 🗂️ Project Structure

```
mindmate/
├── src/                # React frontend
│   ├── pages/          # Login, Register, etc.
│   ├── services/       # API client
│   └── ...
├── server/             # Node.js backend
│   ├── database.js     # DB setup & helpers
│   ├── auth.js         # Auth logic
│   ├── routes/         # API routes
│   └── server.js       # Express server
├── public/             # Static assets
├── package.json        # Frontend dependencies
└── setup.bat           # Windows setup script
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- npm

### Backend Setup

```bash
cd mindmate/server
npm install
npm start
# or for development
npm run dev
```
Backend runs at `http://localhost:5000`

### Frontend Setup

```bash
cd mindmate
npm install
npm start
```
Frontend runs at `http://localhost:3000`

---

## 🔑 API Endpoints

**Authentication**
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login
- `GET /api/auth/profile` — Get profile (protected)

**Mood Tracking**
- `POST /api/mood` — Add mood entry
- `GET /api/mood/history` — Get mood history

**Health**
- `GET /api/health` — Server health check

---

## 🗄️ Database Schema

**users**
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  level INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  last_activity_date TEXT,
  completed_tasks TEXT DEFAULT "[]",
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**mood_history**
```sql
CREATE TABLE mood_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  mood INTEGER NOT NULL,
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);
```

---

## 🔒 Security

- Passwords hashed with bcrypt
- JWT for session management
- CORS configured for API
- Input validation & sanitization

---

## ⚙️ Environment Variables

Create a `.env` in `mindmate/server/`:
```
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=production
```

---

## 🛠️ Development

- Backend: Express.js, SQLite
- Frontend: React, Tailwind CSS
- API: Axios

---

## 🧩 Troubleshooting

- Ensure both servers are running
- Check CORS errors in browser console
- Verify DB file permissions
- Clear browser storage if auth issues

---

## 📄 License

This project is licensed under the MIT License.
