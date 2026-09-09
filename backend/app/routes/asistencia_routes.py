from flask import Blueprint, jsonify, request
from app.services.asistencia_service import (
    AsistenciaService
)

asistencia_bp = Blueprint(
    "asistencia",
    __name__,
    url_prefix="/asistencias"
)

@asistencia_bp.get("")
def get_asistencias():

    asistencias = (
        AsistenciaService.get_all()
    )

    return jsonify(asistencias), 200

@asistencia_bp.get("/<int:asistencia_id>")
def get_asistencia(asistencia_id):

    asistencia = (
        AsistenciaService.get_by_id(
            asistencia_id
        )
    )

    return jsonify(asistencia), 200

@asistencia_bp.post("")
def create_asistencia():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "El body es obligatorio."
        }), 400

    asistencia = (
        AsistenciaService.create(data)
    )

    return jsonify(asistencia), 201

@asistencia_bp.put("/<int:asistencia_id>")
def update_asistencia(asistencia_id):

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "El body es obligatorio."
        }), 400

    asistencia = (
        AsistenciaService.update(
            asistencia_id,
            data
        )
    )

    return jsonify(asistencia), 200