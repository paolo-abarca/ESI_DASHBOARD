from flask import Blueprint, jsonify, request
from app.services.tarea_service import TareaService
from flask_jwt_extended import jwt_required

tarea_bp = Blueprint(
    "tarea",
    __name__,
    url_prefix="/tareas"
)

@tarea_bp.get("")
@jwt_required()
def get_tareas():
    tareas = TareaService.get_all()
    return jsonify(tareas), 200


@tarea_bp.get("/<int:tarea_id>")
@jwt_required()
def get_tarea(tarea_id):
    tarea = TareaService.get_by_id(tarea_id)
    return jsonify(tarea), 200


@tarea_bp.post("")
@jwt_required()
def create_tarea():
    data = request.get_json()

    if not data:
        return jsonify({
            "error": "El body es obligatorio"
        }), 400

    tarea = TareaService.create(data)

    return jsonify(tarea), 201


@tarea_bp.put("/<int:tarea_id>")
@jwt_required()
def update_tarea(tarea_id):
    data = request.get_json()

    if not data:
        return jsonify({
            "error": "El body es obligatorio"
        }), 400

    tarea = TareaService.update(
        tarea_id,
        data
    )

    return jsonify(tarea), 200


@tarea_bp.patch("/<int:tarea_id>/estado")
@jwt_required()
def update_estado_tarea(tarea_id):
    data = request.get_json()

    if not data:
        return jsonify({
            "error": "El body es obligatorio"
        }), 400

    tarea = TareaService.update_estado(
        tarea_id,
        data
    )

    return jsonify(tarea), 200