# ParkScreen 🧠

> A secure, web-based machine learning system for early-stage Parkinson's Disease detection using keystroke dynamics analysis.

![Status](https://img.shields.io/badge/Status-MVP%20Complete-brightgreen)
![Python](https://img.shields.io/badge/Python-3.13-blue)
![Node](https://img.shields.io/badge/Node-v22.16.0-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Team](#team)
- [Disclaimer](#disclaimer)

---

## Overview

Parkinson's Disease (PD) is a progressive neurodegenerative disorder that affects motor functions such as movement coordination, speed, and rhythm. Early detection is critical for timely clinical intervention — yet traditional diagnostic methods rely on expensive equipment and subjective clinical observation.

**ParkScreen** addresses this by analyzing a user's typing patterns in real time. When a user types a sentence, the system captures precise keystroke timing data — including hold time, flight time, and latency — and feeds these features into a trained machine learning model to screen for early indicators of Parkinson's Disease.

The system is designed as a **non-invasive, cost-effective, and accessible screening aid** — not a replacement for professional medical diagnosis.

---

## Problem Statement

Conventional Parkinson's diagnostic approaches are time-consuming, subjective, and often inaccessible in resource-constrained environments. Keystroke dynamics have been recognized as an effective non-invasive indicator of motor dysfunction. However, most existing solutions lack:

- Secure digital implementation
- Scalable web-based deployment
- Integration with explainable ML models
- Real-time result visualization and longitudinal tracking

ParkScreen solves all of these by combining a React frontend, FastAPI backend, PostgreSQL database, and a trained scikit-learn classifier into a single secure web platform.

---

## Features

**Core**
- User registration and login with JWT authentication stored in HttpOnly cookies
- Typing test that captures real-time keystroke dynamics
- ML-powered prediction (Control / Parkinson) with probability score
- Secure session storage in PostgreSQL

**Health Tracking**
- Screening history per user
- Probability trend visualization over time
- Repeated screening support

**Research Features**
- Monthly follow-up feedback form (medical check-in)
- Dataset growth for future model retraining

**UX**
- Typing pattern analysis breakdown (hold variability, latency irregularity, hand asymmetry)
- Progress indicator during typing test
- Medical disclaimer on all result screens

---

## System Architecture

```
React Frontend (Vite)
│
│  POST /auth/register       POST /auth/login
│  GET  /auth/me             POST /auth/logout
│  POST /session/predict     GET  /session/history
│
▼
FastAPI Backend
│
├── auth/               JWT creation, password hashing, cookie management
├── keystroke/          Raw event validation, session storage
├── features/           Feature extraction from keystroke events
├── ml/                 Model loading and prediction
├── feedback/           Monthly medical follow-up
└── database/           SQLAlchemy ORM, PostgreSQL models
│
▼
PostgreSQL Database
│
├── users               id, email, password_hash, created_at
├── typing_sessions     id, user_id, probability, prediction, created_at
├── session_features    mean_hold, mean_latency, mean_flight, asymmetry values
└── feedback            session_id, diagnosis_result, medical_check_done
```

**Keystroke Feature Pipeline**

```
User types in TypingBox
        ↓
useKeystroke hook records keydown / keyup timestamps
        ↓
Computes per-event:  hold | latency | flight | hand (L/R)
        ↓
POST /session/predict  {events: [...]}
        ↓
Backend validates (min 100 events, both hands)
        ↓
Feature extraction: mean, std, per-hand averages, asymmetry
        ↓
ML model prediction → probability + label
        ↓
Saved to DB  →  Result returned to frontend
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router v6, CSS Modules |
| Backend | FastAPI, Python 3.13, Uvicorn |
| Database | PostgreSQL, SQLAlchemy ORM, Alembic |
| Auth | JWT (python-jose), bcrypt (passlib), HttpOnly Cookies |
| ML | scikit-learn, joblib, numpy |
| Dev Tools | pgAdmin 4, VS Code, Git |

---

## Project Structure

```
parkscreen-minor/
│
├── venv/                              # Python virtual environment (not committed)
│
└── Parkscreen/
    ├── backend/
    │   └── app/
    │       ├── main.py                # FastAPI app entry point + CORS
    │       ├── auth/                  # JWT, hashing, login/register/logout routes
    │       ├── keystroke/             # Event capture schema, session router
    │       ├── features/              # Feature extractor from raw events
    │       ├── ml/                    # Model loader and predictor
    │       ├── feedback/              # Monthly follow-up endpoints
    │       ├── database/              # ORM models + DB connection
    │       └── shared/                # Config (pydantic-settings), exceptions
    │
    ├── frontend/
    │   └── src/
    │       ├── pages/                 # LoginPage, RegisterPage, TypingTestPage,
    │       │                          # ResultPage, DashboardPage, HistoryPage
    │       ├── components/            # Navbar, TypingBox, ResultCard, TrendChart
    │       ├── hooks/                 # useKeystroke — keystroke capture logic
    │       ├── services/              # api.js — all fetch calls to FastAPI
    │       └── Context/               # AuthContext — cookie-based auth state
    │
    ├── notebooks/                     # Jupyter notebooks for model training
    ├── models/                        # Trained .pkl model files
    ├── .env.example                   # Environment variable template
    ├── requirements.txt               # Python dependencies
    └── README.md
```

---

## API Reference

### Auth

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/auth/register` | Create new user account | No |
| POST | `/auth/login` | Login and set HttpOnly cookie | No |
| GET | `/auth/me` | Get current logged-in user | Yes |
| POST | `/auth/logout` | Clear auth cookie | Yes |

### Session

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/session/predict` | Submit keystroke events, get prediction | Yes |
| GET | `/session/history` | Fetch all past sessions for user | Yes |

### Feedback

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/feedback` | Submit monthly medical follow-up | Yes |
| GET | `/feedback/{user_id}` | Get feedback history | Yes |

**Sample request — `POST /session/predict`**
```json
{
  "events": [
    { "hold": 120.5, "latency": 45.2, "flight": 160.3, "hand": "L" },
    { "hold": 110.2, "latency": 50.1, "flight": 155.8, "hand": "R" }
  ]
}
```

**Sample response**
```json
{
  "session_id": 1,
  "probability": 0.23,
  "prediction": "Control",
  "features": {
    "hold_time_variability": "Low",
    "latency_irregularity": "Moderate",
    "hand_asymmetry": "Low"
  }
}
```

---

## Getting Started

### Prerequisites

- Python 3.13+
- Node.js v22+
- PostgreSQL (pgAdmin 4 recommended)
- Git

---

### 1. Clone the repository

```bash
mkdir parkscreen-minor
cd parkscreen-minor
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux
git clone https://github.com/harshraj0049/Parkscreen.git
cd Parkscreen
```

---

### 2. Backend setup

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in the `Parkscreen/` root:

```env
SECRET_KEY=your_super_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/parkscreen_db
```

Create the database in pgAdmin:
- Right click Databases → Create → Database → name it `parkscreen_db`

Run the backend:

```bash
uvicorn app.main:app --reload
```

Backend runs at: `http://127.0.0.1:8000`
Swagger docs at: `http://127.0.0.1:8000/docs`

---

### 3. Frontend setup

Open a new terminal:

```bash
cd Parkscreen/frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

### 4. Environment variables reference

| Variable | Description |
|---|---|
| `SECRET_KEY` | JWT signing secret — use a long random string |
| `ALGORITHM` | JWT algorithm — use `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry in minutes |
| `DATABASE_URL` | PostgreSQL connection string |

---

## Team

This project was built as a Minor Project at **KIIT University**.

| Name | Role |
|---|---|
| Harsh Soni | ML Model Development |
| Harsh Raj | User Authentication & Database Connection (BE-1) |
| Sarthak Garg | ML Model Integration & Feature Generation (BE-2) |
| Harsh Keshri | Frontend — Login & Register Pages (React) |
| Somesh Panigrahi | Frontend — Dashboard, Typing Test UI & Keystroke Hook |
| Marupalli Venkatesh | Frontend — History & Analytics Page |

---

## Disclaimer

> ⚠️ **Medical Disclaimer**
>
> ParkScreen is developed strictly for **educational and research purposes** as part of an academic minor project. It is **not a certified medical device** and does **not constitute a medical diagnosis**.
>
> The predictions made by this system are based on keystroke timing patterns and a machine learning model trained on limited data. Results should **not** be used as a substitute for professional neurological evaluation.
>
> If you have concerns about Parkinson's Disease or any neurological condition, please consult a qualified medical professional.

---

*Built with ❤️ at KIIT University*
