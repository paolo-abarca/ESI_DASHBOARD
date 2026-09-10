from flask import Blueprint
from flask_jwt_extended import jwt_required
from app.services.profesor_service import ProfesorService
from flask import Blueprint, request
from app.services.profesor_iglesia_service import (
    ProfesorIglesiaService
)
from app.services.profesor_instrumento_service import (
    ProfesorInstrumentoService
)
from app.utils.permissions import own_profesor_required

profesor_bp = Blueprint("profesores", __name__)

@profesor_bp.get("/profesores")
@jwt_required()
def get_all():

    profesores = ProfesorService.get_all()

    return {
        "success": True,
        "data": profesores
    }

@profesor_bp.get("/profesores/<int:profesor_id>")
@jwt_required()
def get_by_id(profesor_id):

    profesor = ProfesorService.get_by_id(profesor_id)

    return {
        "success": True,
        "data": profesor
    }

@profesor_bp.post("/profesores")
@jwt_required()
def create():

    data = request.get_json() or {}

    profesor = ProfesorService.create(
        nombre=data.get("nombre", ""),
        apellido=data.get("apellido", ""),
        email=data.get("email", ""),
        password=data.get("password", ""),
        google_id=data.get("google_id"),
        foto_url=data.get("foto_url")
    )

    return {
        "success": True,
        "message": "Profesor creado correctamente.",
        "data": profesor
    }, 201

@profesor_bp.put("/profesores/<int:profesor_id>")
@jwt_required()
@own_profesor_required
def update(profesor_id):

    data = request.get_json() or {}

    profesor = ProfesorService.update(
        profesor_id=profesor_id,
        nombre=data.get("nombre", ""),
        apellido=data.get("apellido", ""),
        email=data.get("email", ""),
        password=data.get("password"),
        google_id=data.get("google_id"),
        foto_url=data.get("foto_url")
    )

    return {
        "success": True,
        "message": "Profesor actualizado correctamente.",
        "data": profesor
    }

@profesor_bp.patch("/profesores/<int:profesor_id>/desactivar")
@jwt_required()
@own_profesor_required
def deactivate(profesor_id):

    ProfesorService.deactivate(profesor_id)

    return {
        "success": True,
        "message": "Profesor desactivado correctamente."
    }

@profesor_bp.post(
    "/profesores/<int:profesor_id>/iglesias/<int:iglesia_id>"
)
@jwt_required()
def assign_iglesia(profesor_id, iglesia_id):

    relacion = ProfesorIglesiaService.assign(
        profesor_id,
        iglesia_id
    )

    return {
        "success": True,
        "message": "Iglesia asignada al profesor correctamente.",
        "data": relacion
    }, 201

@profesor_bp.get(
    "/profesores/<int:profesor_id>/iglesias"
)
@jwt_required()
def get_iglesias(profesor_id):

    iglesias = ProfesorIglesiaService.get_iglesias(
        profesor_id
    )

    return {
        "success": True,
        "data": iglesias
    }

@profesor_bp.patch(
    "/profesores/<int:profesor_id>/iglesias/<int:iglesia_id>/desactivar"
)
@jwt_required()
def deactivate_iglesia(profesor_id, iglesia_id):

    ProfesorIglesiaService.deactivate(
        profesor_id,
        iglesia_id
    )

    return {
        "success": True,
        "message": "Asociación desactivada correctamente."
    }

@profesor_bp.post(
    "/profesores/<int:profesor_id>/instrumentos/<int:instrumento_id>"
)
@jwt_required()
def assign_instrumento(profesor_id, instrumento_id):

    relacion = ProfesorInstrumentoService.assign(
        profesor_id,
        instrumento_id
    )

    return {
        "success": True,
        "message": "Instrumento asignado al profesor correctamente.",
        "data": relacion
    }, 201

@profesor_bp.get(
    "/profesores/<int:profesor_id>/instrumentos"
)
@jwt_required()
def get_instrumentos(profesor_id):

    instrumentos = ProfesorInstrumentoService.get_instrumentos(
        profesor_id
    )

    return {
        "succcess": True,
        "data": instrumentos
    }

@profesor_bp.patch(
    "/profesores/<int:profesor_id>/instrumentos/<int:instrumento_id>/desactivar"
)
@jwt_required()
def deactivate_instrumento(
    profesor_id,
    instrumento_id
):

    ProfesorInstrumentoService.deactivate(
        profesor_id,
        instrumento_id
    )

    return {
        "success": True,
        "message": "Asociación con el instrumento desactivada correctamente."
    }