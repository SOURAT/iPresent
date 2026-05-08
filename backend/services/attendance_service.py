from datetime import datetime, timezone, timedelta
from db import db
from models import AttendanceRecord

IST = timezone(timedelta(hours=5, minutes=30))

async def mark_attendance(student_id: str, student_name: str) -> bool:
    now = datetime.now(IST)
    today = now.strftime("%Y-%m-%d")

    existing = await db.attendance.find_one({"student_id": student_id, "date": today})
    if existing:
        return False

    record = AttendanceRecord(
        student_id=student_id,
        student_name=student_name,
        date=today,
        time=now.strftime("%H:%M:%S"),
    )
    doc = record.model_dump()
    doc["timestamp"] = doc["timestamp"].isoformat()
    await db.attendance.insert_one(doc)
    return True

async def get_today_count() -> int:
    today = datetime.now(IST).strftime("%Y-%m-%d")
    return await db.attendance.count_documents({"date": today})