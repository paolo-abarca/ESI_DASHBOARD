from flask import Blueprint, request
from app.services.auth_service import AuthService

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