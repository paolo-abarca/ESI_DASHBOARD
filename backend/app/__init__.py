from flask import Flask
from app.config import Config
from app.extensions import cors, jwt
from app.routes.health_routes import health_bp
from app.routes.auth_routes import auth_bp
from app.routes.instrument_routes import instrument_bp
from app.error_handlers import register_error_handlers

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    cors.init_app(app)
    jwt.init_app(app)

    register_error_handlers(app)

    app.register_blueprint(health_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(instrument_bp)

    @app.get("/")
    def home():
        return {
            "name": "ESI Dashboard API",
            "version": "1.0.0",
        }
    
    return app