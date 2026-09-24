from app.exceptions.not_found import NotFoundError
from app.exceptions.validation import ValidationError
from app.repositories.clase_repository import (
    ClaseRepository
)
from app.repositories.inscripcion_repository import (
    InscripcionRepository
)
from app.repositories.asistencia_repository import (
    AsistenciaRepository
)
from app.exceptions.forbidden import ForbiddenError
from app.utils.auth_utils import get_current_profesor_id

class AsistenciaService:

    ESTADOS_VALIDOS = (
        "presente",
        "ausente",
        "tarde",
        "justificado"
    )

    @staticmethod
    def get_all():
        return AsistenciaRepository.get_all()

    @staticmethod
    def get_by_id(asistencia_id):

        asistencia = (
            AsistenciaRepository.get_by_id(
                asistencia_id
            )
        )

        if not asistencia:
            raise NotFoundError(
                "Asistencia no encontrada."
            )

        return asistencia

    @staticmethod
    def create(data):

        clase_id = data.get("clase_id")
        inscripcion_id = data.get(
            "inscripcion_id"
        )
        estado = data.get("estado")

        if clase_id is None:
            raise ValidationError(
                "clase_id es obligatorio."
            )

        if inscripcion_id is None:
            raise ValidationError(
                "inscripcion_id es obligatorio."
            )

        if not estado:
            raise ValidationError(
                "estado es obligatorio."
            )

        if estado not in AsistenciaService.ESTADOS_VALIDOS:
            raise ValidationError(
                "estado debe ser: presente, ausente, "
                "tarde o justificado."
            )
        
        clase = ClaseRepository.get_by_id(
            clase_id
        )

        if not clase:
            raise NotFoundError(
                "Clase no encontrada."
            )

        inscripcion = (
            InscripcionRepository.get_by_id(
                inscripcion_id
            )
        )

        if not inscripcion:
            raise NotFoundError(
                "Inscripcion no encontrada."
            )

        if clase["inscripcion_id"] != inscripcion_id:
            raise ValidationError(
                "La clase no pertenece a la inscripción."
            )

        profesor_id = get_current_profesor_id()

        if not ClaseRepository.belongs_to_profesor(
            clase_id,
            profesor_id
        ):
            raise ForbiddenError(
                "No tienes permiso para registrar asistencia en esta clase."
            )

        existente = (
            AsistenciaRepository
            .get_by_clase_and_inscripcion(
                clase_id,
                inscripcion_id
            )
        )

        if existente:
            raise ValidationError(
                "Ya existe asistencia registrada "
                "para esta clase."
            )

        asistencia_id = (
            AsistenciaRepository.create(
                clase_id,
                inscripcion_id,
                estado
            )
        )

        return AsistenciaRepository.get_by_id(
            asistencia_id
        )

    @staticmethod
    def update(asistencia_id, data):
        asistencia = (
            AsistenciaRepository.get_by_id(
                asistencia_id
            )
        )

        if not asistencia:
            raise NotFoundError(
                "Asistencia no encontrada."
            )

        profesor_id = get_current_profesor_id()

        if not AsistenciaRepository.belongs_to_profesor(
            asistencia_id,
            profesor_id
        ):
            raise ForbiddenError(
                "No tienes permiso para modificar esta asistencia."
            )

        estado = data.get("estado")

        if not estado:
            raise ValidationError(
                "estado es obligatorio."
            )

        if estado not in AsistenciaService.ESTADOS_VALIDOS:
            raise ValidationError(
                "estado debe ser: presente, ausente, "
                "tarde o justificado."
            )

        AsistenciaRepository.update(
            asistencia_id,
            estado
        )

        return AsistenciaRepository.get_by_id(
            asistencia_id
        )