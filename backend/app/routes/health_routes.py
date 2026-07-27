from flask import Blueprint
from app.services.health_service import HealthService

health_bp = Blueprint('health', __name__)

@health_bp.get("/health")
def health():
    connected = HealthService.check_database()

    if connected:
        return {
            "status": "ok",
            "database": "connected",
            "message": "ESI Dashboard API funcionando correctamente"
        }

    return {
        "status": "error",
        "database": "disconnected",
        "message": "No se pudo conectar a la base de datos"
    }, 500