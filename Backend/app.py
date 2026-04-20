

from flask import Flask
from flask_cors import CORS
from Backend.config import Config
from Backend.models import db
from Backend.routes.auth_routes import auth_bp
from Backend.routes.attendance_routes import attendance_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    db.init_app(app)

    # Create tables automatically
    with app.app_context():
        db.create_all()

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(attendance_bp, url_prefix='/api/attendance')

    # Health check route
    @app.route('/')
    def health_check():
        return {
            'status': 'Smart Attendance System is running!',
            'version': '1.0.0'
        }

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
