from datetime import date
from app.exceptions.not_found import NotFoundError
from app.exceptions.validation import ValidationError
from app.repositories.alumno_repository import AlumnoRepository
from app.repositories.profesor_instrumento_repository import (
    ProfesorInstrumentoRepository
)
from app.repositories.inscripcion_repository import InscripcionRepository
from app.exceptions.forbidden import ForbiddenError
from app.utils.auth_utils import get_current_profesor_id

class InscripcionService:

    @staticmethod
    def get_all():

        return InscripcionRepository.get_all()

    @staticmethod
    def get_by_id(inscripcion_id):

        inscripcion = InscripcionRepository.get_by_id(inscripcion_id)

        if not inscripcion:
            raise NotFoundError("Inscripción no encontrada.")

        return inscripcion

    @staticmethod
    def create(data):

        alumno_id = data.get("alumno_id")
        profesor_instrumento_id = data.get("profesor_instrumento_id")
        tipo_clase = data.get("tipo_clase")
        fecha_inicio = data.get("fecha_inicio")
        fecha_fin = data.get("fecha_fin")
        observaciones = data.get("observaciones")

        if alumno_id is None:
            raise ValidationError("alumno_id' es obligatorio.")

        if profesor_instrumento_id is None:
            raise ValidationError(
                "profesor_instrumento_id es obligatorio."
            )

        if not tipo_clase:
            raise ValidationError("tipo_clase es obligatorio.")

        if not fecha_inicio:
            raise ValidationError("fecha_inicio es obligatorio.")

        if tipo_clase not in ("grupal", "particular"):
            raise ValidationError(
                "tipo_clase debe ser 'grupal' o 'particular'."
            )

        alumno = AlumnoRepository.get_by_id(alumno_id)

        if not alumno:
            raise NotFoundError("Alumno no encontrado.")

        profesor_instrumento = (
            ProfesorInstrumentoRepository.get_by_id(
                profesor_instrumento_id
            )
        )

        if not profesor_instrumento:
            raise NotFoundError(
                "La relación profesor-instrumento no existe."
            )

        profesor_id = get_current_profesor_id()

        if not ProfesorInstrumentoRepository.belongs_to_profesor(
            profesor_instrumento_id,
            profesor_id
        ):
            raise ForbiddenError(
                "No tienes permiso para crear una inscripción con este profesor-instrumento."
            )

        try:
            fecha_inicio_obj = date.fromisoformat(fecha_inicio)
        except (TypeError, ValueError):
            raise ValidationError(
                "fecha_inicio debe tener formato YYYY-MM-DD."
            )

        fecha_fin_obj = None

        if fecha_fin is not None:

            try:
                fecha_fin_obj = date.fromisoformat(fecha_fin)
            except (TypeError, ValueError):
                raise ValidationError(
                    "fecha_fin debe tener formato YYYY-MM-DD."
                )

            if fecha_fin_obj < fecha_inicio_obj:
                raise ValidationError(
                    "fecha_fin no puede ser anterior a fecha_inicio."
                )

        existente = InscripcionRepository.get_by_unique(
            alumno_id,
            profesor_instrumento_id,
            tipo_clase
        )

        if existente:

            if existente["activo"]:
                raise ValidationError(
                    "El alumno ya tiene una inscripción activa "
                    "con este profesor, instrumento y tipo de clase."
                )

            InscripcionRepository.reactivate(
                existente["id"],
                fecha_inicio_obj,
                fecha_fin_obj,
                observaciones
            )

            return InscripcionRepository.get_by_id(
                existente["id"]
            )

        inscripcion_id = InscripcionRepository.create(
            alumno_id,
            profesor_instrumento_id,
            tipo_clase,
            fecha_inicio_obj,
            fecha_fin_obj,
            observaciones
        )

        return InscripcionRepository.get_by_id(inscripcion_id)

    @staticmethod
    def update(inscripcion_id, data):

        inscripcion = InscripcionRepository.get_by_id(
            inscripcion_id
        )

        if not inscripcion:
            raise NotFoundError(
                "Inscripción no encontrada."
            )

        profesor_id = get_current_profesor_id()

        if not InscripcionRepository.belongs_to_profesor(
            inscripcion_id,
            profesor_id
        ):
            raise ForbiddenError(
                "No tienes permiso para modificar esta inscripción."
            )

        fecha_inicio = data.get("fecha_inicio")
        fecha_fin = data.get("fecha_fin")
        observaciones = data.get("observaciones")

        if not fecha_inicio:
            raise ValidationError(
                "fecha_inicio es obligatorio."
            )

        try:
            fecha_inicio_obj = date.fromisoformat(
                fecha_inicio
            )

        except (TypeError, ValueError):
            raise ValidationError(
                "fecha_inicio debe tener formato YYYY-MM-DD."
            )

        fecha_fin_obj = None

        if fecha_fin is not None:

            try:
                fecha_fin_obj = date.fromisoformat(
                    fecha_fin
                )

            except (TypeError, ValueError):
                raise ValidationError(
                    "fecha_fin debe tener formato YYYY-MM-DD."
                )

            if fecha_fin_obj < fecha_inicio_obj:
                raise ValidationError(
                    "fecha_fin no puede ser anterior a fecha_inicio."
                )

        InscripcionRepository.update(
            inscripcion_id,
            fecha_inicio_obj,
            fecha_fin_obj,
            observaciones
        )

        return InscripcionRepository.get_by_id(
            inscripcion_id
        )

    @staticmethod
    def deactivate(inscripcion_id: int):

        inscripcion = InscripcionRepository.get_by_id(
            inscripcion_id
        )

        if not inscripcion:
            raise NotFoundError(
                "Inscripción no encontrada."
            )

        profesor_id = get_current_profesor_id()

        if not InscripcionRepository.belongs_to_profesor(
            inscripcion_id,
            profesor_id
        ):
            raise ForbiddenError(
                "No tienes permiso para modificar esta inscripción."
            )

        InscripcionRepository.deactivate(
            inscripcion_id
        )

        return {
            "message": "Inscripción desactivada correctamente."
        }