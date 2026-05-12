# iPresent — Smart Attendance System

> Face-recognition powered attendance system with self-enrollment and admin approval workflow.

**Stack:** FastAPI · React · MongoDB Atlas · face_recognition (dlib) · OpenCV

---

## ✨ Features

- 🔐 Admin login (JWT-based authentication)
- 📸 Live webcam face recognition (phone or laptop camera)
- ✅ Auto-mark attendance (once per day, per student)
- 🆕 Enrollment mode — unknown students self-register via UI
- 👤 Admin approval workflow for new enrollments
- 🔁 Automatic model retraining after approval
- 📊 Dashboard with KPIs & live stats
- 📅 Attendance history with date filter + CSV export
- 🔍 Student search by name / ID

---

## 📁 Project Structure

```
smart_attendance/
├── backend/
│ ├── server.py
│ ├── auth.py
│ ├── config.py
│ ├── db.py
│ ├── models.py
│ ├── seed.py
│ ├── routes/
│ │ ├── auth_routes.py
│ │ ├── attendance_routes.py
│ │ ├── enrollment_routes.py
│ │ └── student_routes.py
│ ├── services/
│ │ ├── face_service.py
│ │ └── attendance_service.py
│ ├── Face_Dataset/
│ ├── encodings/
│ └── pending_faces/
│
└── frontend/
    └── src/
        ├── pages/
        │ ├── Login.jsx
        │ ├── Dashboard.jsx
        │ ├── LiveAttendance.jsx
        │ ├── Students.jsx
        │ ├── History.jsx
        │ └── PendingApprovals.jsx
        ├── components/
        │ ├── Sidebar.jsx
        │ ├── KpiCard.jsx
        │ ├── EnrollmentModal.jsx
        │ └── ProtectedRoute.jsx
        ├── context/
        │ └── AuthContext.js
        └── lib/
            └── api.js
```

---

## 🚀 Running Locally

### 1. Prerequisites

- Python 3.10+
- Node.js 18+ (LTS)
- MongoDB Atlas account

---

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create `backend/.env`:

```
MONGO_URL=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/?appName=Cluster0
DB_NAME=attendance_db
CORS_ORIGINS=*
JWT_SECRET=your-random-64-char-secret
JWT_ALGORITHM=HS256
ADMIN_EMAIL=admin@demo.com
ADMIN_PASSWORD=Admin@123
FACE_MATCH_THRESHOLD=60
```

Seed the database:

```bash
python seed.py
```

Start backend:

```bash
uvicorn server:app --reload
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm install @craco/craco
npm start
```

Create `frontend/.env`:

```
REACT_APP_BACKEND_URL=http://localhost:8000
```

Open:

```
http://localhost:3000
```

---

## 🎯 Workflow

1. Login as admin at `/login`
2. Go to **Live Camera**
3. Enable **Enrollment Mode**
4. Start camera
5. Known faces → marked present automatically
6. Unknown faces → self-enroll via modal
7. Admin approves/rejects in **Pending** page
8. Model retrains automatically
9. View history in **History** page and export CSV

---

## 🧠 Face Recognition Logic

- **Detection** → OpenCV Haar Cascade
- **Encoding** → face_recognition library (dlib deep learning)
- **Recognition** → Euclidean distance comparison
- **Threshold** → `FACE_MATCH_THRESHOLD` (default: 60%)
- **Retraining** → automatic after new enrollment approval

> Switched from LBPH to face_recognition library for significantly better accuracy.

---

## 📷 Camera Setup

Supports both:
- **Laptop webcam** — works out of the box
- **Phone camera via DroidCam** — install DroidCam app on phone + DroidCam client on laptop

---

## 🌍 Timezone

All timestamps saved in **IST (UTC+5:30)**.

---

## 🔧 Environment Variables

| Variable | Description | Default |
|---|---|---|
| `MONGO_URL` | MongoDB Atlas SRV connection string | required |
| `DB_NAME` | Database name | `attendance_db` |
| `CORS_ORIGINS` | Allowed origins | `*` |
| `JWT_SECRET` | Secret key for JWT | required |
| `JWT_ALGORITHM` | JWT algorithm | `HS256` |
| `ADMIN_EMAIL` | Admin login email | `admin@demo.com` |
| `ADMIN_PASSWORD` | Admin login password | `Admin@123` |
| `FACE_MATCH_THRESHOLD` | Recognition threshold (0-100) | `60` |

---

## 🛠️ API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/auth/me` | Current user info |
| GET | `/api/students` | Students list |
| POST | `/api/attendance/recognize` | Face recognition |
| GET | `/api/attendance/history` | Attendance history |
| GET | `/api/attendance/stats` | Dashboard stats |

---

## 🐛 Troubleshooting

**face_recognition install fails:**
```bash
pip install cmake
pip install dlib
pip install face_recognition
```

**Wrong faces recognized:**
- Lower `FACE_MATCH_THRESHOLD` in `.env` (try 50)
- Add more training images per person
- Ensure good lighting

**Camera not working:**
- Allow camera permissions in browser
- If using DroidCam, ensure USB debugging is enabled

**Login failed:**
- Make sure backend is running at `http://localhost:8000`
- Check `REACT_APP_BACKEND_URL` in `frontend/.env`
- Run `python seed.py` to create admin user

---

## 📝 Demo Credentials

| Field | Value |
|---|---|
| Email | admin@demo.com |
| Password | Admin@123 |

---

## 👥 Students

- All students are **1st Year**
- Auto-generated emails and phone numbers
- Seeded from `Face_Dataset/` folder

---

Built with ❤️ using FastAPI, React, and face_recognition
