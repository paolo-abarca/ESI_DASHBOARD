from datetime import date, time
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
    def _parse_time(value, field_name):

        try:
            return time.fromisoformat(value)

        except (TypeError, ValueError):
            raise ValidationError(
                f"{field_name} debe tener formato HH:MM:SS."
            )

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

        hora_inicio_obj = ClaseService._parse_time(
            hora_inicio,
            "hora_inicio"
        )

        hora_fin_obj = None

        if hora_fin is not None:

            hora_fin_obj = ClaseService._parse_time(
                hora_fin,
                "hora_fin"
            )

            if hora_fin_obj <= hora_inicio_obj:

                raise ValidationError(
                    "hora_fin debe ser posterior a hora_inicio."
                )

        clase_id = ClaseRepository.create(
            inscripcion_id,
            fecha_obj,
            hora_inicio_obj,
            hora_fin_obj,
            tema,
            observaciones
        )

        return ClaseRepository.get_by_id(
            clase_id
        )

    @staticmethod
    def update(clase_id, data):

        clase = ClaseRepository.get_by_id(
            clase_id
        )

        if not clase:
            raise NotFoundError(
                "Clase no encontrada."
            )

        fecha = data.get("fecha")
        hora_inicio = data.get(
            "hora_inicio"
        )
        hora_fin = data.get(
            "hora_fin"
        )
        tema = data.get("tema")
        observaciones = data.get(
            "observaciones"
        )

        if not fecha:
            raise ValidationError(
                "fecha es obligatoria."
            )

        if not hora_inicio:
            raise ValidationError(
                "hora_inicio es obligatoria."
            )

        try:
            fecha_obj = date.fromisoformat(
                fecha
            )

        except (TypeError, ValueError):
            raise ValidationError(
                "fecha debe tener en formato YYYY-MM-DD."
            )

        hora_inicio_obj = ClaseService._parse_time(
            hora_inicio,
            "hora_inicio"
        )

        hora_fin_obj = None

        if hora_fin is not None:

            hora_fin_obj = ClaseService._parse_time(
                hora_fin,
                "hora_fin"
            )

            if hora_fin_obj <= hora_inicio_obj:

                raise ValidationError(
                    "hora_fin debe ser posterior a hora_inicio."
                )

        ClaseRepository.update(
            clase_id,
            fecha_obj,
            hora_inicio_obj,
            hora_fin_obj,
            tema,
            observaciones
        )

        return ClaseRepository.get_by_id(
            clase_id
        )

    @staticmethod
    def deactivate(clase_id):

        clase = ClaseRepository.get_by_id(
            clase_id
        )

        if not clase:
            raise NotFoundError(
                "Clase no encontrada."
            )

        ClaseRepository.deactivate(
            clase_id
        )

        return {
            "message": "Clase desactivada correctamente."
        }