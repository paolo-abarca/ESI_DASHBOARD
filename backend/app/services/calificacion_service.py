from decimal import Decimal, InvalidOperation
from app.exceptions.not_found import NotFoundError
from app.exceptions.validation import ValidationError
from app.repositories.clase_repository import ClaseRepository
from app.repositories.inscripcion_repository import InscripcionRepository
from app.repositories.calificacion_repository import CalificacionRepository
from app.exceptions.forbidden import ForbiddenError
from app.utils.auth_utils import get_current_profesor_id

class CalificacionService:

    TIPOS_VALIDOS = (
        "practica",
        "evaluacion",
        "parcial",
        "final"
    )

    @staticmethod
    def get_all():
        return CalificacionRepository.get_all()

    @staticmethod
    def get_by_id(calificacion_id):
        calificacion = CalificacionRepository.get_by_id(calificacion_id)

        if not calificacion:
            raise NotFoundError("Calificación no encontrada.")

        return calificacion

    @staticmethod
    def _validate_nota(nota):
        if nota is None:
            raise ValidationError("nota es obligatoria.")

        try:
            nota_decimal = Decimal(str(nota))

        except (InvalidOperation, ValueError):
            raise ValidationError("nota debe ser un número válido.")

        if nota_decimal < 0:
            raise ValidationError("nota no puede ser negativa.")

        if nota_decimal > 20:
            raise ValidationError("nota no puede ser mayor a 20.")

        return nota_decimal

    @staticmethod
    def create(data):
        clase_id = data.get("clase_id")
        inscripcion_id = data.get("inscripcion_id")
        tipo = data.get("tipo")
        nota = data.get("nota")

        if clase_id is None:
            raise ValidationError("clase_id es obligatorio.")

        if inscripcion_id is None:
            raise ValidationError("inscripcion_id es obligatorio.")

        if not tipo:
            raise ValidationError("tipo es obligatorio.")

        if tipo not in CalificacionService.TIPOS_VALIDOS:
            raise ValidationError(
                "tipo debe ser: practica, evaluacion, parcial o final"
            )

        nota_decimal = CalificacionService._validate_nota(nota)
        clase = ClaseRepository.get_by_id(clase_id)

        if not clase:
            raise NotFoundError("Clase no encontrada.")

        inscripcion =InscripcionRepository.get_by_id(inscripcion_id)

        if not inscripcion:
            raise NotFoundError("Inscripción no encontrada.")

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
                "No tienes permiso para crear una calificación en esta clase."
            )

        existente = (
            CalificacionRepository.get_by_clase_inscripcion_tipo(
                clase_id,
                inscripcion_id,
                tipo
            )
        )

        if existente:
            raise ValidationError(
                "Ya existe una calificación registrada "
                "para esta clase, inscripción y tipo."
            )

        calificacion_id = CalificacionRepository.create(
            clase_id,
            inscripcion_id,
            tipo,
            nota_decimal
        )

        return CalificacionRepository.get_by_id(calificacion_id)

    @staticmethod
    def update(calificacion_id, data):
        calificacion = CalificacionRepository.get_by_id(
            calificacion_id
        )

        if not calificacion:
            raise NotFoundError("Calificación no encontrada.")

        profesor_id = get_current_profesor_id()

        if not CalificacionRepository.belongs_to_profesor(
            calificacion_id,
            profesor_id
        ):
            raise ForbiddenError(
                "No tienes permiso para modificar esta calificación."
            )

        tipo = data.get("tipo")
        nota = data.get("nota")

        if not tipo:
            raise ValidationError("tipo es obligatorio.")

        if tipo not in CalificacionService.TIPOS_VALIDOS:
            raise ValidationError(
                "tipo debe ser: practica, evaluacion, parcial o final"
            )

        nota_decimal = CalificacionService._validate_nota(nota)

        if tipo != calificacion["tipo"]:
            existente = (
                CalificacionRepository
                .get_by_clase_inscripcion_tipo(
                    calificacion["clase_id"],
                    calificacion["inscripcion_id"],
                    tipo
                )
            )

            if existente:
                raise ValidationError(
                    "Ya existe una calificación registrada "
                    "para esta clase, inscripción y tipo."
                )

        CalificacionRepository.update(
            calificacion_id,
            tipo,
            nota_decimal
        )

        return CalificacionRepository.get_by_id(calificacion_id)