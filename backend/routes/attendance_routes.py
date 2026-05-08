from fastapi import APIRouter, Depends
from models import RecognizeRequest
from services.face_service import recognize_frame
from services.attendance_service import mark_attendance, get_today_count
from auth import get_current_user
from db import db

router = APIRouter(prefix="/api/attendance", tags=["attendance"])


@router.post("/recognize")
async def recognize(body: RecognizeRequest, user=Depends(get_current_user)):
    result = recognize_frame(body.image)
    marked = []

    # Check if enrollment mode is on
    cfg = await db.config.find_one({"key": "enrollment_mode"}, {"_id": 0})
    enrollment_on = bool(cfg and cfg.get("enabled"))

    for face in result["faces"]:
        if face["status"] == "recognized":
            student = await db.students.find_one(
                {"name": face["name"], "status": "active"}, {"_id": 0}
            )
            if student:
                was_new = await mark_attendance(student["id"], student["name"])
                face["marked"] = was_new
                if was_new:
                    marked.append(student["name"])

    result["marked"] = marked
    result["enrollment_mode"] = enrollment_on
    return result


@router.get("/history")
async def history(date: str | None = None, user=Depends(get_current_user)):
    query = {"date": date} if date else {}
    records = await db.attendance.find(query, {"_id": 0}) \
        .sort("timestamp", -1).to_list(5000)
    return records


@router.get("/stats")
async def stats(user=Depends(get_current_user)):
    total = await db.students.count_documents({"status": "active"})
    pending = await db.students.count_documents({"status": "pending"})
    today_count = await get_today_count()
    cfg = await db.config.find_one({"key": "enrollment_mode"}, {"_id": 0})
    return {
        "total_students": total,
        "pending_approvals": pending,
        "present_today": today_count,
        "enrollment_mode": bool(cfg and cfg.get("enabled")),
    }
