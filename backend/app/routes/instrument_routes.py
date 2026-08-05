from flask import Blueprint
from flask_jwt_extended import jwt_required
from app.services.instrument_service import InstrumentService

instrument_bp = Blueprint("instrumentos", __name__)

@instrument_bp.get("/instrumentos")
@jwt_required()
def get_all():

    instrumentos = InstrumentService.get_all()

    return {
        "success": True,
        "data": instrumentos
    }