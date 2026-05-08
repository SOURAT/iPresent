from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from models import StudentBase, EnrollmentModeRequest
from services.face_service import add_face_to_dataset
from services.attendance_service import mark_attendance
from auth import get_current_user
from db import db
from config import PENDING_DIR
import base64, uuid
from datetime import datetime, timezone

router = APIRouter(prefix="/api/enrollment", tags=["enrollment"])


class EnrollmentSubmit(StudentBase):
    snapshot_b64: str  # face image (no data URI prefix)


@router.post("/mode")
async def set_mode(body: EnrollmentModeRequest, user=Depends(get_current_user)):
    await db.config.update_one(
        {"key": "enrollment_mode"},
        {"$set": {"enabled": body.enabled}},
        upsert=True,
    )
    return {"enabled": body.enabled}


@router.get("/mode")
async def get_mode():
    cfg = await db.config.find_one({"key": "enrollment_mode"}, {"_id": 0})
    return {"enabled": bool(cfg and cfg.get("enabled"))}


@router.post("/submit")
async def submit_enrollment(body: EnrollmentSubmit):
    """Public — no auth (student self-enrolls during enrollment mode)."""
    cfg = await db.config.find_one({"key": "enrollment_mode"})
    if not (cfg and cfg.get("enabled")):
        raise HTTPException(403, "Enrollment mode is disabled")

    # Save snapshot to pending_faces/
    snap_id = str(uuid.uuid4())
    snap_path = PENDING_DIR / f"{snap_id}.jpg"
    snap_path.write_bytes(base64.b64decode(body.snapshot_b64))

    doc = body.model_dump(exclude={"snapshot_b64"})
    doc.update({
        "id": str(uuid.uuid4()),
        "status": "pending",
        "snapshot_id": snap_id,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    await db.students.insert_one(doc)
    return {"ok": True, "message": "Submitted — awaiting admin approval"}

@router.get("/pending")
async def list_pending(user=Depends(get_current_user)):
    items = await db.students.find({"status": "pending"}, {"_id": 0}) \
        .sort("created_at", -1).to_list(500)
    # Attach base64 snapshot for preview
    for i in items:
        snap = PENDING_DIR / f"{i['snapshot_id']}.jpg"
        if snap.exists():
            i["snapshot_b64"] = base64.b64encode(snap.read_bytes()).decode()
    return items


@router.post("/approve/{student_id}")
async def approve(student_id: str, user=Depends(get_current_user)):
    student = await db.students.find_one({"id": student_id, "status": "pending"})
    if not student:
        raise HTTPException(404, "Pending student not found")

    snap_path = PENDING_DIR / f"{student['snapshot_id']}.jpg"
    if not snap_path.exists():
        raise HTTPException(400, "Snapshot missing")

    snap_b64 = base64.b64encode(snap_path.read_bytes()).decode()
    person_name = student["name"].replace(" ", "_")
    samples, new_path = add_face_to_dataset(person_name, snap_b64)

    await db.students.update_one(
        {"id": student_id},
        {"$set": {"status": "active", "name": person_name, "photo_path": new_path}}
    )
    # Auto-mark today's attendance
    await mark_attendance(student_id, person_name)
    snap_path.unlink(missing_ok=True)
    return {"ok": True, "trained_samples": samples}


@router.post("/reject/{student_id}")
async def reject(student_id: str, user=Depends(get_current_user)):
    student = await db.students.find_one({"id": student_id, "status": "pending"})
    if not student:
        raise HTTPException(404, "Pending student not found")
    (PENDING_DIR / f"{student['snapshot_id']}.jpg").unlink(missing_ok=True)
    await db.students.delete_one({"id": student_id})
    return {"ok": True}
