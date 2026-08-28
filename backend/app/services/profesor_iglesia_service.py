from app.exceptions.not_found import NotFoundError
from app.exceptions.validation import ValidationError
from app.repositories.profesor_repository import ProfesorRepository
from app.repositories.iglesia_repository import IglesiaRepository
from app.repositories.profesor_iglesia_repository import (
    ProfesorIglesiaRepository
)

class ProfesorIglesiaService:

    @staticmethod
    def assign(profesor_id: int, iglesia_id: int):

        profesor = ProfesorRepository.get_by_id(profesor_id)

        if profesor is None:
            raise NotFoundError(
                "Profesor no encontrado."
            )

        iglesia = IglesiaRepository.get_by_id(iglesia_id)

        if iglesia is None:
            raise NotFoundError(
                "Iglesia no encontrada."
            )

        if ProfesorIglesiaRepository.exists(
            profesor_id,
            iglesia_id
        ):
            raise ValidationError(
                "El profesor ya está asociado a esta iglesia."
            )

        relacion_id = ProfesorIglesiaRepository.create(
            profesor_id,
            iglesia_id
        )

        return ProfesorIglesiaRepository.get_by_ids(
            profesor_id,
            iglesia_id
        )

    @staticmethod
    def get_iglesias(profesor_id: int):

        profesor = ProfesorRepository.get_by_id(profesor_id)

        if profesor is None:
            raise NotFoundError(
                "Profesor no encontrado."
            )

        iglesias = (
            ProfesorIglesiaRepository
            .get_iglesias_by_profesor(profesor_id)
        )

        for iglesia in iglesias:
            iglesia["activo"] = bool(
                iglesia["activo"]
            )

        return iglesias

    @staticmethod
    def deactivate(
        profesor_id: int,
        iglesia_id: int
    ):

        profesor = ProfesorRepository.get_by_id(profesor_id)

        if profesor is None:
            raise NotFoundError(
                "Profesor no encontrado."
            )

        iglesia = IglesiaRepository.get_by_id(iglesia_id)

        if iglesia is None:
            raise NotFoundError(
                "Iglesia no encontrada."
            )

        relation = ProfesorIglesiaRepository.get_by_ids(
            profesor_id,
            iglesia_id
        )

        if relation is None:
            raise NotFoundError(
                "La asociación entre el profesor y la iglesia no existe."
            )

        updated = ProfesorIglesiaRepository.deactivate(
            profesor_id,
            iglesia_id
        )

        if updated == 0:
            raise ValidationError(
                "No se pudo desactivar la asociación."
            )