Smart Attendance System

Face-recognition powered attendance system with self-enrollment and admin approval.

Stack: FastAPI · React · MongoDB · OpenCV (LBPH)

---

Features

- 🔐 Admin login (JWT-based)
- 📸 Live webcam face recognition
- ✅ Auto-mark attendance (once per day, per student)
- 🆕 Enrollment mode — unknown students self-register via UI
- 👤 Admin approval workflow for new enrollments
- 🔁 Automatic model retraining after approval
- 📊 Dashboard with KPIs & live stats
- 📅 Attendance history with date filter + CSV export

---

📁 Project Structure

smart-attendance-system/
├── backend/
│   ├── server.py
│   ├── auth.py
│   ├── config.py
│   ├── db.py
│   ├── models.py
│   ├── seed.py
│   ├── routes/
│   ├── services/
│   ├── dataset/
│   ├── encodings/
│   └── pending_faces/
│
└── frontend/
    └── src/
        ├── pages/
        ├── components/
        ├── context/
        └── lib/

---

🚀 Running Locally

1. Prerequisites

- Python 3.10+
- Node.js 18+
- Yarn
- MongoDB running at:

mongodb://localhost:27017

---

2. Backend Setup

cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

uvicorn server:app --host 0.0.0.0 --port 8001 --reload

---

3. Frontend Setup

cd frontend
yarn install
yarn start

Open:

http://localhost:3000

---

🎯 Workflow

1. Login as admin
2. Enable Enrollment Mode
3. Start camera
4. Known faces → marked present
5. Unknown faces → self-enroll
6. Admin approves/rejects
7. Model retrains automatically
8. View history and export CSV

---

🧠 Face Recognition Logic

- Detection → Haar Cascade
- Training → LBPH model
- Recognition → "predict()"
- Retraining → after new enrollment approval

---

🔧 Environment Variables ("backend/.env")

MONGO_URL=mongodb://localhost:27017
DB_NAME=attendance_db
CORS_ORIGINS=*
JWT_SECRET=change-me-to-a-random-64-char-hex
JWT_ALGORITHM=HS256
ADMIN_EMAIL=admin@demo.com
ADMIN_PASSWORD=Admin@123
FACE_MATCH_THRESHOLD=75

---

🛠️ API Overview

Method| Endpoint| Description
POST| /api/auth/login| Admin login
GET| /api/auth/me| Current user
GET| /api/students| Students list
POST| /api/attendance/recognize| Face recognition
GET| /api/attendance/history| Attendance history
GET| /api/attendance/stats| Dashboard stats

---

🐛 Troubleshooting

- Install OpenCV:

pip install opencv-contrib-python

- Ensure MongoDB is running
- Allow browser camera permissions
- Adjust "FACE_MATCH_THRESHOLD" if needed

---

📝 Demo Credentials

- Email: admin@demo.com
- Password: Admin@123
