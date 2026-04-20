import os
from datetime import timedelta

class Config:
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))

    # ✅ Database path (fixed)
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BASE_DIR, 'database', 'db.sqlite3')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SECRET_KEY = 'your-secret-key'

    # Face recognition paths
    DATASET_PATH = os.path.join(BASE_DIR, 'dataset')
    ENCODINGS_PATH = os.path.join(BASE_DIR, 'encodings', 'encodings.pkl')

    # Session config
    PERMANENT_SESSION_LIFETIME = timedelta(hours=2)

    # Attendance config
    MAX_ATTENDANCE_PER_DAY = 1
