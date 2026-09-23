# MediBook - Doctor Appointment Management System
## Quick Start Guide

---

## Prerequisites
- Node.js 18+ installed
- SQLite (included, no setup needed)
- Git (optional)

---

## Step 1: Backend Configuration
A `.env` file has been created in your `backend/` directory with `PORT=5001` to avoid port conflicts.

## Step 2: Install Dependencies & Run
The application is unified. You only need to run the backend to serve both the API and the Frontend.

1. Open a terminal in the `backend` folder:
   ```powershell
   cd backend
   npm install
   ```
2. Start the server:
   ```powershell
   npm start
   ```
   **Access the app at: http://localhost:5001**

---

## Troubleshooting "Address Already in Use"
If you see `EADDRINUSE: 5000`, it means another app is using port 5000. We have changed the port to **5001** in your `.env` file to avoid this.

---

## Demo Accounts (Automatically seeded in database.sqlite)

| Role | Email | Password |
|------|-------|----------|
| 👤 Patient | john.doe@email.com | password123 |
| 🩺 Cardiologist | sarah.kumar@hospital.com | password123 |

---

## API Base URL: http://localhost:5001/api
