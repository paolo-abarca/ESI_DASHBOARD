from flask import Blueprint, request
from app.services.auth_service import AuthService
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.profesor_service import ProfesorService

auth_bp = Blueprint('auth', __name__)

@auth_bp.post("/auth/login")
def login():
    data = request.get_json()

    if not data:
        return {
            "success": False,
            "message": "Debe enviar un JSON."
        }, 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return {
            "success": False,
            "message": "Email y contraseña son obligatorios."
        }, 400

    resultado = AuthService.login(email, password)

    if resultado is None:
        return {
            "success": False,
            "message": "Correo o contraseña incorrectos."
        }, 401

    profesor = resultado["profesor"]

    return {
        "success": True,
        "message": "Login correcto.",
        "data": {
            "access_token": resultado["access_token"],
            "profesor": {
                "id": profesor["id"],
                "nombre": profesor["nombre"],
                "apellido": profesor["apellido"],
                "email": profesor["email"]
            }
        }
    }

@auth_bp.post("/auth/register")
def register():
    data = request.get_json()

    if not data:
        return {
            "success": False,
            "message": "Debe enviar un JSON."
        }, 400

    nombre = data.get("nombre", "")
    apellido = data.get("apellido", "")
    email = data.get("email", "")
    password = data.get("password", "")

    if not all(
        isinstance(value, str)
        for value in (nombre, apellido, email, password)
    ):
        return {
            "success": False,
            "message": "Los datos enviados no son válidos."
        }, 400

    if not all((nombre.strip(), apellido.strip(), email.strip(), password)):
        return {
            "success": False,
            "message": "Todos los campos son obligatorios."
        }, 400

    if len(password) < 8:
        return {
            "success": False,
            "message": "La contraseña debe tener al menos 8 caracteres."
        }, 400

    profesor = ProfesorService.create(
        nombre=nombre,
        apellido=apellido,
        email=email,
        password=password
    )

    return {
        "success": True,
        "message": "Cuenta creada correctamente.",
        "data": {
            "id": profesor["id"],
            "nombre": profesor["nombre"],
            "apellido": profesor["apellido"],
            "email": profesor["email"]
        }
    }, 201

@auth_bp.get("/auth/me")
@jwt_required()
def me():
    profesor_id = int(get_jwt_identity())
    profesor = AuthService.me(profesor_id)

    if profesor is None:
        return {
            "success": False,
            "message": "Profesor no encontrado."
        }, 404

    return {
        "success": True,
        "data": profesor
    }