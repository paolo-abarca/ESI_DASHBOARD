from app.repositories.auth_repository import AuthRepository
from app.utils.password import verify_password
from flask_jwt_extended import create_access_token

class AuthService:
    @staticmethod
    def login(email: str, password: str):
        profesor = AuthRepository.find_by_email(email)

        if not profesor:
            return None

        if not profesor["activo"]:
            return None

        if not verify_password(password, profesor["password_hash"]):
            return None

        access_token = create_access_token(
            identity=str(profesor["_id"]),
            additional_claims={
                "email": profesor["email"],
                "nombre": profesor["nombre"]
            }
        )

        return {
            "profesor": profesor,
            "access_token": access_token
        }