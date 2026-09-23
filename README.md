# 🏥 MediBook – Doctor Appointment Management System

MediBook is a full-stack web application for managing doctor appointments. It provides separate dashboards for **patients** and **doctors**, with features like appointment booking, schedule management, token-based queuing, and patient medical records.

---

## 🛠 Tech Stack

| Layer        | Technology                                                                 |
|-------------|----------------------------------------------------------------------------|
| **Frontend** | React 18, React Router v6, Axios, date-fns, React DatePicker              |
| **Backend**  | Node.js (v22.5+), Express.js, JWT Authentication, bcrypt.js                |
| **Database** | SQLite (built-in `node:sqlite` module — no external DB setup required)     |
| **Mobile**   | Capacitor (optional Android wrapper)                                       |
| **Deployment** | Vercel-ready (`vercel.json` included)                                   |

---

## ✨ Main Features

### Patient Features
- 🔐 User registration & login (JWT-based authentication)
- 🔍 Search & filter doctors by specialization, availability, and rating
- 📅 Book, view, and cancel appointments
- 📋 View appointment history with status tracking
- 👤 Manage personal profile and medical details
- 🎟 Token-based queue position tracking

### Doctor Features
- 📊 Doctor dashboard with appointment overview
- 🗓 Schedule manager (configure weekly availability & time shifts)
- ✅ Accept, complete, or cancel appointments
- 📝 Add doctor notes and prescriptions to appointments
- 👨‍⚕️ Manage professional profile (specialization, qualifications, fees)

### System Features
- 🛡 Rate limiting for API protection
- 🔑 Role-based access control (patient / doctor)
- 📊 Automatic database seeding with demo data
- 🩺 Health check endpoint (`/api/health`)

---

## 📁 Project Structure

```
medibook-appoinment-master/
├── backend/
│   ├── config/
│   │   ├── db.js                # SQLite database connection & wrapper
│   │   └── schema.sql           # Database schema (tables definition)
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js              # Login / Register endpoints
│   │   ├── appointments.js      # CRUD for appointments
│   │   ├── doctors.js           # Doctor search & profile endpoints
│   │   └── patients.js          # Patient profile endpoints
│   ├── server.js                # Express app entry point
│   ├── seed.js                  # Database seeder with demo data
│   ├── .env.example             # Environment variable template
│   ├── package.json             # Backend dependencies
│   └── package-lock.json        # Backend dependency lock file
│
├── frontend/
│   ├── public/
│   │   └── index.html           # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/            # Login, Register pages
│   │   │   ├── Doctor/          # Doctor Dashboard, Profile, Schedule Manager
│   │   │   ├── Patient/         # Patient Dashboard, Profile, Doctor Search, History
│   │   │   ├── Navbar.js        # Navigation bar
│   │   │   └── Navbar.css
│   │   ├── contexts/
│   │   │   └── AuthContext.js   # React auth context provider
│   │   ├── services/
│   │   │   └── api.js           # Axios API client
│   │   ├── App.js               # Main app with routing
│   │   ├── App.css
│   │   ├── index.js             # React entry point
│   │   └── index.css            # Global styles
│   ├── capacitor.config.ts      # Capacitor mobile config
│   ├── package.json             # Frontend dependencies
│   └── package-lock.json        # Frontend dependency lock file
│
├── .github/workflows/
│   └── android_build.yml        # GitHub Actions CI for Android APK
│
├── .gitignore                   # Git ignore rules
├── package.json                 # Root package.json (build & start scripts)
├── vercel.json                  # Vercel deployment configuration
├── start_app.bat                # Windows one-click launcher
└── QUICK_START.md               # Quick start guide
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js v22.5+** (required for built-in `node:sqlite` support)
- **npm** (comes with Node.js)
- **Git** (optional, for cloning)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/medibook-appointment.git
cd medibook-appointment
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `backend/.env` and set your values:

```env
PORT=5001
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d
```

> ⚠️ **Important:** Never commit `.env` to version control. Change `JWT_SECRET` to a strong, unique value in production.

### 4. Seed the Database (Optional)

```bash
cd backend
node seed.js
```

This creates a `database.sqlite` file and populates it with demo accounts.

### 5. Install Frontend Dependencies & Build

```bash
cd frontend
npm install --legacy-peer-deps
npm run build
```

### 6. Start the Application

```bash
cd backend
npm start
```

Open your browser at: **http://localhost:5001**

> The backend serves both the API and the frontend static build from a single port.

---

## 🧑‍💻 Development Mode

To run the frontend dev server with hot-reloading (separate from backend):

**Terminal 1 – Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 – Frontend:**
```bash
cd frontend
npm start
```

- Frontend dev server: `http://localhost:3000`
- Backend API: `http://localhost:5001/api`

---

## 🔐 Required Environment Variables

| Variable      | Description                              | Example                                   |
|--------------|------------------------------------------|--------------------------------------------|
| `PORT`       | Server port                              | `5001`                                     |
| `NODE_ENV`   | Environment (`development`/`production`) | `development`                              |
| `JWT_SECRET` | Secret key for JWT token signing         | `your_super_secret_jwt_key` (change this!) |
| `JWT_EXPIRE` | JWT token expiry duration                | `30d`                                      |

> 🔒 **Do NOT** commit real secrets. Use `.env.example` as a template.

---

## 🧪 Demo Accounts

After running `node seed.js`:

| Role         | Email                      | Password      |
|-------------|----------------------------|---------------|
| 👤 Patient   | john.doe@email.com         | password123   |
| 🩺 Doctor    | sarah.kumar@hospital.com   | password123   |

---

## 📡 API Endpoints

| Method | Endpoint               | Description              |
|--------|------------------------|--------------------------|
| POST   | `/api/auth/register`   | Register new user        |
| POST   | `/api/auth/login`      | Login                    |
| GET    | `/api/doctors`         | List/search doctors      |
| GET    | `/api/appointments`    | Get user appointments    |
| POST   | `/api/appointments`    | Book an appointment      |
| GET    | `/api/patients/profile`| Get patient profile      |
| GET    | `/api/health`          | Server health check      |

---

## 📦 Deployment

The project includes a `vercel.json` for easy deployment to Vercel. You can also deploy to any Node.js hosting platform.

---

## 📄 License

This project is for educational and portfolio purposes.
