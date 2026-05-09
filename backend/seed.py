import asyncio, uuid, random
from datetime import datetime, timezone
from db import db
from auth import hash_password
from config import ADMIN_EMAIL, ADMIN_PASSWORD, DATASET_DIR
from services.face_service import train_from_dataset

DEPARTMENTS = ["Computer Science", "Information Technology", "Electronics", "Mechanical", "Civil"]

def generate_phone():
    return f"+91{''.join([str(random.randint(0, 9)) for _ in range(10)])}"

def generate_email(name: str):
    clean = name.lower().replace("_", ".")
    domains = ["gmail.com", "yahoo.com", "outlook.com"]
    return f"{clean}{random.randint(1, 99)}@{random.choice(domains)}"

async def seed_admin():
    existing = await db.users.find_one({"email": ADMIN_EMAIL})
    if existing:
        return
    await db.users.insert_one({
        "id": str(uuid.uuid4()),
        "email": ADMIN_EMAIL.lower(),
        "password_hash": hash_password(ADMIN_PASSWORD),
        "name": "Admin",
        "role": "admin",
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    print(f"[seed] Admin created: {ADMIN_EMAIL}")

async def seed_students_from_dataset():
    for person_dir in sorted(DATASET_DIR.iterdir()):
        if not person_dir.is_dir():
            continue
        name = person_dir.name
        if await db.students.find_one({"name": name}):
            continue
        await db.students.insert_one({
            "id": str(uuid.uuid4()),
            "name": name,
            "student_id": name.upper()[:8],
            "email": generate_email(name),
            "phone": generate_phone(),
            "year": "1st Year",
            "status": "active",
            "photo_path": str(next(person_dir.glob("*.jpg"), "")),
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    print("[seed] Students seeded from dataset")

async def main():
    await seed_admin()
    await seed_students_from_dataset()
    count, label_map = train_from_dataset()
    print(f"[seed] Trained on {count} samples / {len(label_map)} people")

if __name__ == "__main__":
    asyncio.run(main())