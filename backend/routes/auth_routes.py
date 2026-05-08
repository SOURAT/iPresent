from fastapi import APIRouter, HTTPException, Depends
from models import LoginRequest
from auth import verify_password, create_access_token, get_current_user
from db import db

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login")
async def login(body: LoginRequest):
    email = body.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(401, "Invalid credentials")
    token = create_access_token(user["id"], email)
    return {"token": token, "user": {"id": user["id"], "email": email, "name": user["name"]}}


@router.get("/me")
async def me(user=Depends(get_current_user)):
    return user
