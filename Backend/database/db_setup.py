from flask import Flask
from Backend.config import Config
from Backend.models import db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    return app

def init_db():
    app = create_app()

    with app.app_context():
        db.create_all()
        print("✅ Database created successfully!")

if __name__ == "__main__":
    init_db()
