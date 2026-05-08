import os
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).parent
load_dotenv(ROOT / ".env")

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "*").split(",")

JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGORITHM = os.environ.get("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = 60 * 24  # 1 day

ADMIN_EMAIL = os.environ["ADMIN_EMAIL"]
ADMIN_PASSWORD = os.environ["ADMIN_PASSWORD"]

FACE_MATCH_THRESHOLD = float(os.environ.get("FACE_MATCH_THRESHOLD", "0.75"))

DATASET_DIR = ROOT / "Face_Dataset"
ENCODINGS_DIR = ROOT / "encodings"
PENDING_DIR = ROOT / "pending_faces"

for d in (DATASET_DIR, ENCODINGS_DIR, PENDING_DIR):
    d.mkdir(exist_ok=True, parents=True)

MODEL_PATH = ENCODINGS_DIR / "lbph_model.yml"
LABEL_MAP_PATH = ENCODINGS_DIR / "label_map.json"
