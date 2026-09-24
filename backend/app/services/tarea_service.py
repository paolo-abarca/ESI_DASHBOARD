from datetime import date
from app.exceptions.not_found import NotFoundError
from app.exceptions.validation import ValidationError
from app.repositories.clase_repository import ClaseRepository
from app.repositories.tarea_repository import TareaRepository
from app.exceptions.forbidden import ForbiddenError
from app.utils.auth_utils import get_current_profesor_id

class TareaService:

    ESTADOS_VALIDOS = (
        "pendiente",
        "en_progreso",
        "completada",
        "cancelada"
    )

    @staticmethod
    def get_all():
        return TareaRepository.get_all()

    @staticmethod
    def get_by_id(tarea_id):
        tarea = TareaRepository.get_by_id(tarea_id)

        if not tarea:
            raise NotFoundError("Tarea no encontrada")

        return tarea

    @staticmethod
    def _parse_fecha_entrega(value):

        if value is None:
            return None

        try:
            return date.fromisoformat(value)

        except (TypeError, ValueError):
            raise ValidationError(
                "fecha_entrega debe tener formato YYYY-MM-DD"
            )

    @staticmethod
    def _validate_estado(estado):

        if estado not in TareaService.ESTADOS_VALIDOS:
            raise ValidationError(
                "estado debe ser: pendiente, en_progreso, "
                "completada o cancelada"
            )

    @staticmethod
    def create(data):

        clase_id = data.get("clase_id")
        titulo = data.get("titulo")
        descripcion = data.get("descripcion")
        fecha_entrega = data.get("fecha_entrega")
        estado = data.get("estado", "pendiente")

        if clase_id is None:
            raise ValidationError("clase_id es obligatorio")

        if not titulo:
            raise ValidationError("titulo es obligatorio")

        if not estado:
            raise ValidationError("estado es obligatorio")

        TareaService._validate_estado(estado)

        clase = ClaseRepository.get_by_id(clase_id)

        if not clase:
            raise NotFoundError("Clase no encontrada.")

        profesor_id = get_current_profesor_id()
        
        if not ClaseRepository.belongs_to_profesor(
            clase_id,
            profesor_id
        ):
            raise ForbiddenError(
                "No tienes permiso para crear una tarea en esta clase."
            )

        fecha_entrega_obj = TareaService._parse_fecha_entrega(
            fecha_entrega
        )

        tarea_id = TareaRepository.create(
            clase_id,
            titulo,
            descripcion,
            fecha_entrega_obj,
            estado
        )

        return TareaRepository.get_by_id(tarea_id)

    @staticmethod
    def update(tarea_id, data):

        tarea = TareaRepository.get_by_id(tarea_id)

        if not tarea:
            raise NotFoundError("Tarea no encontrada.")

        profesor_id = get_current_profesor_id()

        if not TareaRepository.belongs_to_profesor(
            tarea_id,
            profesor_id
        ):
            raise ForbiddenError(
                "No tienes permiso para modificar esta tarea."
            )

        titulo = data.get("titulo")
        descripcion = data.get("descripcion")
        fecha_entrega = data.get("fecha_entrega")

        if not titulo:
            raise ValidationError("titulo es obligatorio")

        fecha_entrega_obj = TareaService._parse_fecha_entrega(
            fecha_entrega
        )

        TareaRepository.update(
            tarea_id,
            titulo,
            descripcion,
            fecha_entrega_obj
        )

        return TareaRepository.get_by_id(tarea_id)

    @staticmethod
    def update_estado(tarea_id, data):
        tarea = TareaRepository.get_by_id(tarea_id)

        if not tarea:
            raise NotFoundError("Tarea no encontrada.")

        profesor_id = get_current_profesor_id()

        if not TareaRepository.belongs_to_profesor(
            tarea_id,
            profesor_id
        ):
            raise ForbiddenError(
                "No tienes permiso para modificar esta tarea."
            )

        estado = data.get("estado")

        if not estado:
            raise ValidationError("estado es obligatorio")

        TareaService._validate_estado(estado)

        TareaRepository.update_estado(
            tarea_id,
            estado
        )

        return TareaRepository.get_by_id(tarea_id)