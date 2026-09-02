from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from app.services.inscripcion_service import InscripcionService

inscripcion_bp = Blueprint(
    "inscripcion",
    __name__,
    url_prefix="/inscripciones"
)

@inscripcion_bp.get("/inscripciones")
@jwt_required()
def get_all():

    inscripciones = InscripcionService.get_all()

    return {
        "success": True,
        "data": inscripciones
    }

@inscripcion_bp.get("/inscripciones/<int:inscripcion_id>")
@jwt_required()
def get_by_id(inscripcion_id):

    inscripcion = InscripcionService.get_by_id(
        inscripcion_id
    )

    return {
        "success": True,
        "data": inscripcion
    }

@inscripcion_bp.get("")
def get_inscripciones():

    inscripciones = InscripcionService.get_all()

    return jsonify(inscripciones), 200

@inscripcion_bp.get("/<int:inscripcion_id>")
def get_inscripcion(inscripcion_id):

    inscripcion = InscripcionService.get_by_id(
        inscripcion_id
    )

    return jsonify(inscripcion), 200

@inscripcion_bp.post("")
def create_inscripcion():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "El body es obligatorio."
        }), 400

    inscripcion = InscripcionService.create(data)

    return jsonify(inscripcion), 201

@inscripcion_bp.put("/<int:inscripcion_id>")
def update_inscripcion(inscripcion_id):

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "El body es obligatorio."
        }), 400

    inscripcion = InscripcionService.update(
        inscripcion_id,
        data
    )

    return jsonify(inscripcion), 200

@inscripcion_bp.patch(
    "/<int:inscripcion_id>/desactivar"
)
def deactivate_inscripcion(inscripcion_id):

    result = InscripcionService.deactivate(
        inscripcion_id
    )

    return jsonify(result), 200