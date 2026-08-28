from app.exceptions.not_found import NotFoundError
from app.exceptions.validation import ValidationError
from app.repositories.profesor_repository import ProfesorRepository
from app.repositories.instrument_repository import InstrumentRepository
from app.repositories.profesor_instrumento_repository import (
    ProfesorInstrumentoRepository
)

class ProfesorInstrumentoService:

    @staticmethod
    def assign(
        profesor_id: int,
        instrumento_id: int
    ):

        profesor = ProfesorRepository.get_by_id(
            profesor_id
        )

        if profesor is None:
            raise NotFoundError(
                "Profesor no encontrado."
            )

        instrumento = InstrumentRepository.get_by_id(
            instrumento_id
        )

        if instrumento is None:
            raise NotFoundError(
                "Instrumento no encontrado."
            )

        if ProfesorInstrumentoRepository.exists(
            profesor_id,
            instrumento_id
        ):
            raise ValidationError(
                "El profesor ya está asociado a este instrumento."
            )

        ProfesorInstrumentoRepository.create(
            profesor_id,
            instrumento_id
        )

        return ProfesorInstrumentoRepository.get_by_ids(
            profesor_id,
            instrumento_id
        )

    @staticmethod
    def get_instrumentos(
        profesor_id: int
    ):

        profesor = ProfesorRepository.get_by_id(
            profesor_id
        )

        if profesor is None:
            raise NotFoundError(
                "Profesor no encontrado."
            )

        instrumentos = (
            ProfesorInstrumentoRepository
            .get_instrumentos_by_profesor(
                profesor_id
            )
        )

        for instrumento in instrumentos:
            instrumento["activo"] = bool(
                instrumento["activo"]
            )

        return instrumentos

    @staticmethod
    def deactivate(
        profesor_id: int,
        instrumento_id: int
    ):

        profesor = ProfesorRepository.get_by_id(
            profesor_id
        )

        if profesor is None:
            raise NotFoundError(
                "Profesor no encontrado."
            )

        instrumento = InstrumentRepository.get_by_id(
            instrumento_id
        )

        if instrumento is None:
            raise NotFoundError(
                "Instrumento no encontrado."
            )

        relation = (
            ProfesorInstrumentoRepository
            .get_by_ids(
                profesor_id,
                instrumento_id
            )
        )

        if relation is None:
            raise NotFoundError(
                "La asociación entre el profesor y el instrumento no existe."
            )

        updated = (
            ProfesorInstrumentoRepository
            .deactivate(
                profesor_id,
                instrumento_id
            )
        )

        if updated == 0:
            raise ValidationError(
                "No se pudo desactivar la asociación."
            )