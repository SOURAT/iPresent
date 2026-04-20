

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date, time
from werkzeug.security import generate_password_hash, check_password_hash
import enum

db = SQLAlchemy()

# 🔹 User Roles
class UserRole(enum.Enum):
    ADMIN = 'admin'
    TEACHER = 'teacher'
    STUDENT = 'student'


# 🔹 User Table (Login System)
class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    role = db.Column(db.Enum(UserRole), default=UserRole.STUDENT, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    student = db.relationship('Student', backref='user', uselist=False)
    subjects = db.relationship('Subject', backref='teacher', lazy=True)

    # Password methods
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User {self.username}>"


# 🔹 Student Table (IMPORTANT for Face Recognition Mapping)
class Student(db.Model):
    __tablename__ = 'students'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)

    student_id = db.Column(db.String(20), unique=True, nullable=False)

    # ⚠️ This must match dataset folder name EXACTLY
    full_name = db.Column(db.String(100), unique=True, nullable=False)

    roll_number = db.Column(db.String(20), unique=True, nullable=True)
    department = db.Column(db.String(50), nullable=False)
    year = db.Column(db.Integer, nullable=True)
    semester = db.Column(db.Integer, nullable=True)

    phone = db.Column(db.String(15))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    attendances = db.relationship('Attendance', backref='student', lazy=True)

    def __repr__(self):
        return f"<Student {self.full_name}>"


# 🔹 Subject Table
class Subject(db.Model):
    __tablename__ = 'subjects'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    code = db.Column(db.String(20), unique=True, nullable=False)

    teacher_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    attendances = db.relationship('Attendance', backref='subject', lazy=True)

    def __repr__(self):
        return f"<Subject {self.name}>"


# 🔹 Attendance Table (CORE LOGIC)
class Attendance(db.Model):
    __tablename__ = 'attendance'

    id = db.Column(db.Integer, primary_key=True)

    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.id'), nullable=False)

    # ✅ Separate date and time (IMPORTANT)
    attendance_date = db.Column(db.Date, nullable=False, default=date.today)
    attendance_time = db.Column(db.Time, nullable=False, default=datetime.now().time)

    status = db.Column(db.String(20), default='Present')  # Present / Late / Absent

    # 🤖 Face recognition confidence
    confidence = db.Column(db.Float)

    marked_by = db.Column(db.Integer, db.ForeignKey('users.id'))  # Teacher/Admin

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # ✅ Prevent duplicate attendance per day
    __table_args__ = (
        db.UniqueConstraint(
            'student_id',
            'subject_id',
            'attendance_date',
            name='unique_attendance_per_day'
        ),
    )

    def __repr__(self):
        return f"<Attendance Student:{self.student_id} Date:{self.attendance_date}>"
