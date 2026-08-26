from flask import Blueprint
from flask_jwt_extended import jwt_required
from app.services.profesor_service import ProfesorService
from flask import Blueprint, request

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
def deactivate(profesor_id):

    ProfesorService.deactivate(profesor_id)

    return {
        "success": True,
        "message": "Profesor desactivado correctamente."
    }