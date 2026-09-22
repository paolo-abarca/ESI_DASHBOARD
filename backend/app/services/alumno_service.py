from datetime import date
from app.exceptions.not_found import NotFoundError
from app.exceptions.validation import ValidationError
from app.repositories.alumno_repository import AlumnoRepository
from app.repositories.iglesia_repository import IglesiaRepository
from flask_jwt_extended import get_jwt_identity
from app.exceptions.forbidden import ForbiddenError
from app.utils.auth_utils import get_current_profesor_id

class AlumnoService:

    @staticmethod
    def get_all():

        alumnos = AlumnoRepository.get_all()

        for alumno in alumnos:
            alumno["activo"] = bool(alumno["activo"])

        return alumnos

    @staticmethod
    def get_by_id(alumno_id: int):

        alumno = AlumnoRepository.get_by_id(alumno_id)

        if alumno is None:
            raise NotFoundError(
                "Alumno no encontrado."
            )

        alumno["activo"] = bool(alumno["activo"])

        return alumno

    @staticmethod
    def create(
        nombre: str,
        apellido: str,
        fecha_nacimiento,
        celular: str | None,
        genero: str,
        imagen: str | None,
        iglesia_id: int | None
    ):

        if not nombre or not nombre.strip():
            raise ValidationError(
                "El nombre del alumno es obligatorio."
            )

        nombre = nombre.strip()

        if not apellido or not apellido.strip():
            raise ValidationError(
                "El apellido del alumno es obligatorio."
            )

        apellido = apellido.strip()

        if genero not in ("M", "F"):
            raise ValidationError(
                "El género debe ser 'M' o 'F'."
            )

        fecha = None

        if fecha_nacimiento:

            try:
                fecha = date.fromisoformat(
                    fecha_nacimiento
                )

            except (TypeError, ValueError):
                raise ValidationError(
                    "La fecha de nacimiento debe tener el formato YYYY-MM-DD."
                )

            if fecha > date.today():
                raise ValidationError(
                    "La fecha de nacimiento no puede ser futura."
                )

        if iglesia_id is not None:

            iglesia = IglesiaRepository.get_by_id(
                iglesia_id
            )

            if iglesia is None:
                raise NotFoundError(
                    "Iglesia no encontrada."
                )

        alumno_id = AlumnoRepository.create(
            nombre=nombre,
            apellido=apellido,
            fecha_nacimiento=fecha,
            celular=celular,
            genero=genero,
            imagen=imagen,
            iglesia_id=iglesia_id
        )

        return AlumnoRepository.get_by_id(
            alumno_id
        )

    @staticmethod
    def update(
        alumno_id: int,
        nombre: str,
        apellido: str,
        fecha_nacimiento,
        celular: str | None,
        genero: str,
        imagen: str | None,
        iglesia_id: int | None
    ):

        alumno = AlumnoRepository.get_by_id(alumno_id)

        if alumno is None:
            raise NotFoundError(
                "Alumno no encontrado."
            )

        profesor_id = get_current_profesor_id()

        if not AlumnoRepository.belongs_to_profesor(
            alumno_id,
            profesor_id
        ):
            raise ForbiddenError(
                "No tienes permiso para modificar este alumno."
            )

        if not nombre or not nombre.strip():
            raise ValidationError(
                "El nombre del alumno es obligatorio."
            )

        nombre = nombre.strip()

        if not apellido or not apellido.strip():
            raise ValidationError(
                "El apellido del alumno es obligatorio."
            )

        apellido = apellido.strip()

        if genero not in ("M", "F"):
            raise ValidationError(
                "El género debe ser 'M' o 'F'."
            )

        fecha = None

        if fecha_nacimiento:

            try:
                fecha = date.fromisoformat(
                    fecha_nacimiento
                )

            except (TypeError, ValueError):
                raise ValidationError(
                    "La fecha de nacimiento debe tener el formato YYYY-MM-DD."
                )

            if fecha > date.today():
                raise ValidationError(
                    "La fecha de nacimiento no puede ser futura."
                )

        if iglesia_id is not None:

            iglesia = IglesiaRepository.get_by_id(
                iglesia_id
            )

            if iglesia is None:
                raise NotFoundError(
                    "Iglesia no encontrada."
                )

        updated = AlumnoRepository.update(
            alumno_id=alumno_id,
            nombre=nombre,
            apellido=apellido,
            fecha_nacimiento=fecha,
            celular=celular,
            genero=genero,
            imagen=imagen,
            iglesia_id=iglesia_id
        )

        if updated == 0:
            raise ValidationError(
                "No se pudo actualizar el alumno."
            )

        return AlumnoRepository.get_by_id(
            alumno_id
        )

    @staticmethod
    def deactivate(alumno_id: int):

        alumno = AlumnoRepository.get_by_id(alumno_id)

        if alumno is None:
            raise NotFoundError(
                "Alumno no encontrado."
            )

        profesor_id = get_current_profesor_id()

        if not AlumnoRepository.belongs_to_profesor(
            alumno_id,
            profesor_id
        ):
            raise ForbiddenError(
                "No tienes permiso para modificar este alumno."
            )

        updated = AlumnoRepository.deactivate(
            alumno_id
        )

        if updated == 0:
            raise ValidationError(
                "No se pudo desactivar el alumno."
            )