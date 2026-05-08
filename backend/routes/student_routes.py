from fastapi import APIRouter, Depends
from auth import get_current_user
from db import db

router = APIRouter(prefix="/api/students", tags=["students"])


@router.get("")
async def list_students(user=Depends(get_current_user)):
    students = await db.students.find(
        {"status": "active"}, {"_id": 0}
    ).sort("name", 1).to_list(1000)
    return students
