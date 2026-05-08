from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from config import CORS_ORIGINS
from routes import auth_routes, student_routes, attendance_routes, enrollment_routes
from seed import seed_admin, seed_students_from_dataset
from services.face_service import train_from_dataset
from db import db


@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.users.create_index("email", unique=True)
    await db.students.create_index("name")
    await db.attendance.create_index([("student_id", 1), ("date", 1)])
    await seed_admin()
    await seed_students_from_dataset()
    train_from_dataset()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(student_routes.router)
app.include_router(attendance_routes.router)
app.include_router(enrollment_routes.router)


@app.get("/api/")
async def root():
    return {"message": "Smart Attendance API", "status": "ok"}
