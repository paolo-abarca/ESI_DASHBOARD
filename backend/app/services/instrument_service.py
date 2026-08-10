from app.repositories.instrument_repository import InstrumentRepository
from app.exceptions.not_found import NotFoundError
from app.exceptions.validation import ValidationError

class InstrumentService:
    @staticmethod
    def get_all():

        instrumentos = InstrumentRepository.get_all()

        for instrumento in instrumentos:
            instrumento["activo"] = bool(instrumento["activo"])

        return instrumentos

    @staticmethod
    def get_by_id(instrument_id: int):

        instrumento = InstrumentRepository.get_by_id(instrument_id)

        if instrumento is None:
            raise NotFoundError(
                "Instrumento no encontrado."
            )

        instrumento["activo"] = bool(instrumento["activo"])

        return instrumento

    @staticmethod
    def create(nombre: str):
        nombre = nombre.strip()

        if not nombre:
            raise ValidationError("El nombre es obligatorio.")

        if InstrumentRepository.exists_by_name(nombre):
            raise ValidationError("Ya existe un instrumento con ese nombre.")

        instrumento_id = InstrumentRepository.create(nombre)

        return InstrumentRepository.get_by_id(instrumento_id)

    @staticmethod
    def update(instrument_id: int, nombre: str):

        nombre = nombre.strip()

        if not nombre:
            raise ValidationError("El nombre es obligatorio.")

        instrumento = InstrumentRepository.get_by_id(instrument_id)

        if instrumento is None:
            raise ValidationError("Instrumento no encontrado.")

        if InstrumentRepository.exists_by_name(nombre):
            if instrumento["nombre"].lower() != nombre.lower():
                raise ValidationError(
                    "Ya existe un instrumento con ese nombre."
                )

        actualizado = InstrumentRepository.update(
            instrument_id,
            nombre
        )

        if not actualizado:
            raise ValidationError("No se pudo actualizar el instrumento.")
        
        return InstrumentRepository.get_by_id(instrument_id)

    @staticmethod
    def deactivate(instrument_id: int):

        instrumento = InstrumentRepository.get_by_id(instrument_id)

        if instrumento is None:
            raise ValidationError("Instrumento no encontrado.")

        desactivado = InstrumentRepository.deactivate(instrument_id)

        if not desactivado:
            raise ValidationError("No se pudo desactivar el instrumento.")

        return True