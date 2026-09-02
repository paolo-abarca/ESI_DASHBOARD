from datetime import date
from app.exceptions.not_found import NotFoundError
from app.exceptions.validation import ValidationError
from app.repositories.inscripcion_repository import (
    InscripcionRepository
)
from app.repositories.clase_repository import (
    ClaseRepository
)

class ClaseService:

    @staticmethod
    def get_all():
        return ClaseRepository.get_all()

    @staticmethod
    def get_by_id(clase_id):

        clase = ClaseRepository.get_by_id(
            clase_id
        )

        if not clase:
            raise NotFoundError(
                "Clase no encontrada."
            )

        return clase
    
    @staticmethod
    def create(data):

        inscripcion_id = data.get(
            "inscripcion_id"
        )
        fecha = data.get("fecha")
        hora_inicio = data.get("hora_inicio")
        hora_fin = data.get("hora_fin")
        tema = data.get("tema")
        observaciones = data.get(
            "observaciones"
        )

        if inscripcion_id is None:
            raise ValidationError(
                "inscripcion_id es obligatorio."
            )

        if not fecha:
            raise ValidationError(
                "fecha es obligatoria."
            )

        if not hora_inicio:
            raise ValidationError(
                "hora_inicio es obligatoria."
            )

        inscripcion = (
            InscripcionRepository.get_by_id(
                inscripcion_id
            )
        )

        if not inscripcion:
            raise NotFoundError(
                "Inscripción no encontrada."
            )

        try:
            fecha_obj = date.fromisoformat(
                fecha
            )

        except (TypeError, ValueError):
            raise ValidationError(
                "fecha debe estar en formato YYYY-MM-DD."
            )

        clase_id = ClaseRepository.create(
            inscripcion_id,
            fecha_obj,
            hora_inicio,
            hora_fin,
            tema,
            observaciones
        )

        return ClaseRepository.get_by_id(
            clase_id
        )