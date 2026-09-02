from flask import Blueprint, jsonify, request
from app.services.clase_service import (
    ClaseService
)

clase_bp = Blueprint(
    "clase",
    __name__,
    url_prefix="/clases"
)

@clase_bp.get("")
def get_clases():

    clases = ClaseService.get_all()

    return jsonify(clases), 200

@clase_bp.get("/<int:clase_id>")
def get_clase(clase_id):

    clase = ClaseService.get_by_id(
        clase_id
    )

    return jsonify(clase), 200

@clase_bp.post("")
def create_clase():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "El body es obligatorio."
        }), 400

    clase = ClaseService.create(
        data
    )

    return jsonify(clase), 201