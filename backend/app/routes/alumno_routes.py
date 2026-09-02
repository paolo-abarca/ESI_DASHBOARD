from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from app.services.alumno_service import AlumnoService

alumno_bp = Blueprint("alumnos", __name__)

@alumno_bp.get("/alumnos")
@jwt_required()
def get_all():

    alumnos = AlumnoService.get_all()

    return {
        "success": True,
        "data": alumnos
    }

@alumno_bp.get("/alumnos/<int:alumno_id>")
@jwt_required()
def get_by_id(alumno_id):

    alumno = AlumnoService.get_by_id(alumno_id)

    return {
        "success": True,
        "data": alumno
    }

@alumno_bp.post("/alumnos")
@jwt_required()
def create():

    data = request.get_json() or {}

    alumno = AlumnoService.create(
        nombre=data.get("nombre"),
        apellido=data.get("apellido"),
        fecha_nacimiento=data.get("fecha_nacimiento"),
        celular=data.get("celular"),
        genero=data.get("genero"),
        imagen=data.get("imagen"),
        iglesia_id=data.get("iglesia_id")
    )

    return {
        "success": True,
        "message": "Alumno creado correctamente.",
        "data": alumno
    }, 201

@alumno_bp.put("/alumnos/<int:alumno_id>")
@jwt_required()
def update(alumno_id):

    data = request.get_json() or {}

    alumno = AlumnoService.update(
        alumno_id=alumno_id,
        nombre=data.get("nombre"),
        apellido=data.get("apellido"),
        fecha_nacimiento=data.get("fecha_nacimiento"),
        celular=data.get("celular"),
        genero=data.get("genero"),
        imagen=data.get("imagen"),
        iglesia_id=data.get("iglesia_id")
    )

    return {
        "success": True,
        "message": "Alumno actualizado correctamente.",
        "data": alumno
    }

@alumno_bp.patch("/alumnos/<int:alumno_id>/desactivar")
@jwt_required()
def deactivate(alumno_id):

    AlumnoService.deactivate(alumno_id)

    return {
        "success": True,
        "message": "Alumno desactivado correctamente."
    }