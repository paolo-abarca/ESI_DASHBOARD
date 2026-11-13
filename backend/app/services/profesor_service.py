from app.exceptions.not_found import NotFoundError
from app.repositories.profesor_repository import ProfesorRepository
from werkzeug.security import generate_password_hash
from app.exceptions.validation import ValidationError
import logging
from app.services.cloudinary_service import CloudinaryService

class ProfesorService:

    @staticmethod
    def get_all():

        profesores = ProfesorRepository.get_all()

        for profesor in profesores:
            profesor["activo"] = bool(profesor["activo"])

        return profesores

    @staticmethod
    def get_by_id(profesor_id: int):

        profesor = ProfesorRepository.get_by_id(profesor_id)

        if profesor is None:
            raise NotFoundError("Profesor no encontrado.")

        profesor["activo"] = bool(profesor["activo"])

        return profesor

    @staticmethod
    def create(
        nombre: str,
        apellido: str,
        email: str,
        password: str,
        google_id: str | None = None,
        foto_url: str | None = None
    ):

        nombre = nombre.strip()
        apellido = apellido.strip()
        email = email.strip().lower()

        if not nombre:
            raise ValidationError(
                "El nombre del profesor es obligatorio."
            )

        if not apellido:
            raise ValidationError(
                "El apellido del profesor es obligatorio."
            )

        if not email:
            raise ValidationError(
                "El email del profesor es obligatorio."
            )

        if not password:
            raise ValidationError(
                "La contraseña del profesor es obligatoria."
            )

        if ProfesorRepository.exists_by_email(email):
            raise ValidationError(
                "Ya existe un profesor con ese email."
            )

        password_hash = generate_password_hash(password)

        profesor_id = ProfesorRepository.create(
            nombre=nombre,
            apellido=apellido,
            email=email,
            password_hash=password_hash,
            google_id=google_id,
            foto_url=foto_url
        )

        return ProfesorRepository.get_by_id(profesor_id)

    @staticmethod
    def update(
        profesor_id: int,
        nombre: str,
        apellido: str,
        email: str,
        password: str | None = None,
        google_id: str | None = None,
        foto_url: str | None = None
    ):

        profesor = ProfesorRepository.get_by_id(profesor_id)

        if profesor is None:
            raise NotFoundError("Profesor no encontrado.")

        nombre = nombre.strip()
        apellido = apellido.strip()
        email = email.strip().lower()

        if not nombre:
            raise ValidationError(
                "El nombre del profesor es obligatorio."
            )

        if not apellido:
            raise ValidationError(
                "El apellido del profesor es obligatorio."
            )

        if not email:
            raise ValidationError(
                "El email del profesor es obligatorio."
            )

        existing = ProfesorRepository.get_by_email_except_id(
            email,
            profesor_id
        )

        if existing:
            raise ValidationError(
                "Ya existe otro profesor con ese email."
            )

        password_hash = None

        if password is not None:

            if not password:
                raise ValidationError(
                    "La contraseña no puede estar vacía."
                )

            password_hash = generate_password_hash(password)

        # Comprobar si realmente existen cambios.
        sin_cambios = (
            profesor["nombre"] == nombre
            and profesor["apellido"] == apellido
            and profesor["email"] == email
            and password is None
            and profesor.get("google_id") == google_id
        )

        if sin_cambios:
            return profesor

        updated = ProfesorRepository.update(
            profesor_id=profesor_id,
            nombre=nombre,
            apellido=apellido,
            email=email,
            password_hash=password_hash,
            google_id=google_id
        )

        if updated == 0:
            raise ValidationError(
                "No se pudo actualizar el profesor."
            )

        return ProfesorRepository.get_by_id(profesor_id)

    @staticmethod
    def deactivate(profesor_id: int):

        profesor = ProfesorRepository.get_by_id(profesor_id)

        if profesor is None:
            raise NotFoundError("Profesor no encontrado.")

        deactivated = ProfesorRepository.deactivate(profesor_id)

        if deactivated == 0:
            raise ValidationError(
                "No se pudo desactivar el profesor."
            )

    @staticmethod
    def upload_photo(profesor_id: int, file):

        profesor = ProfesorRepository.get_photo_data(profesor_id)

        if profesor is None:
            raise NotFoundError("Profesor no encontrado.")

        # Subir primero la nueva imagen
        nueva_foto = CloudinaryService.upload_profesor_photo(file)

        nueva_url = nueva_foto["secure_url"]
        nuevo_public_id = nueva_foto["public_id"]

        try:
            updated = ProfesorRepository.update_photo(
                profesor_id=profesor_id,
                foto_url=nueva_url,
                foto_public_id=nuevo_public_id
            )

            if updated == 0:
                raise ValidationError(
                    "No se pudo actualizar la foto del profesor."
                )

        except Exception:
            # Si falla MySQL, eliminar la imagen recién subida
            try:
                CloudinaryService.delete_photo(nuevo_public_id)
            except Exception:
                logging.exception(
                    "No se pudo eliminar la nueva imagen de Cloudinary."
                )

            raise

        # Eliminar la foto anterior después de guardar la nueva
        foto_anterior = profesor.get("foto_public_id")

        if foto_anterior:
            try:
                CloudinaryService.delete_photo(foto_anterior)
            except Exception:
                logging.exception(
                    "No se pudo eliminar la foto anterior de Cloudinary."
                )

        return {
            "foto_url": nueva_url,
            "foto_public_id": nuevo_public_id
        }

    @staticmethod
    def delete_photo(profesor_id: int):
        profesor = ProfesorRepository.get_photo_data(profesor_id)

        if profesor is None:
            raise NotFoundError("Profesor no encontrado.")

        foto_public_id = profesor.get("foto_public_id")

        # Primero limpiamos la referencia en la base de datos.
        updated = ProfesorRepository.clear_photo(profesor_id)

        if updated == 0:
            raise ValidationError(
                "No se pudo eliminar la fotografía del profesor."
            )

        # Después intentamos eliminar la imagen de Cloudinary.
        if foto_public_id:
            try:
                CloudinaryService.delete_photo(foto_public_id)
            except Exception:
                logging.exception(
                    "No se pudo eliminar la fotografía anterior de Cloudinary."
                )

        return {"foto_url": None, "foto_public_id": None}