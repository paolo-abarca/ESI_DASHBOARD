from flask import Blueprint, jsonify, request
from app.services.calificacion_service import CalificacionService
from flask_jwt_extended import jwt_required

calificacion_bp = Blueprint(
    "calificacion",
    __name__,
    url_prefix="/calificaciones"
)

@calificacion_bp.get("")
@jwt_required()
def get_calificaciones():
    calificaciones = CalificacionService.get_all()
    return jsonify(calificaciones), 200

@calificacion_bp.get("/<int:calificacion_id>")
@jwt_required()
def get_calificacion(calificacion_id):
    calificacion = CalificacionService.get_by_id(
        calificacion_id
    )
    return jsonify(calificacion), 200

@calificacion_bp.post("")
@jwt_required()
def create_calificacion():
    data = request.get_json()

    if not data:
        return jsonify({
            "error": "El body es obligatorio."
        }), 400

    calificacion = CalificacionService.create(data)

    return jsonify(calificacion), 201

@calificacion_bp.put("/<int:calificacion_id>")
@jwt_required()
def update_calificacion(calificacion_id):
    data = request.get_json()

    if not data:
        return jsonify({
            "error": "El body es obligatorio."
        }), 400

    calificacion = CalificacionService.update(
        calificacion_id,
        data
    )

    return jsonify(calificacion), 200