from flask import Blueprint
from flask_jwt_extended import jwt_required
from app.services.instrument_service import InstrumentService
from flask import request

instrument_bp = Blueprint("instrumentos", __name__)

@instrument_bp.get("/instrumentos")
@jwt_required()
def get_all():

    instrumentos = InstrumentService.get_all()

    return {
        "success": True,
        "data": instrumentos
    }

@instrument_bp.get("/instrumentos/<int:instrument_id>")
@jwt_required()
def get_by_id(instrument_id):

    instrumento = InstrumentService.get_by_id(instrument_id)

    if instrumento is None:
        return {
            "success": False,
            "message": "Instrumento no encontrado."
        }, 404

    return {
        "success": True,
        "data": instrumento
    }

@instrument_bp.post("/instrumentos")
@jwt_required()
def create():

    data = request.get_json()

    try:
        instrumento = InstrumentService.create(
            data.get("nombre", "")
        )

        return {
            "success": True,
            "message": "Instrumento creado correctamente.",
            "data": instrumento
        }, 201

    except ValueError as e:
        return {
            "success": False,
            "message": str(e)
        }, 400