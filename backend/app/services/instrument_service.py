from app.repositories.instrument_repository import InstrumentRepository

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
            return None

        instrumento["activo"] = bool(instrumento["activo"])

        return instrumento

    @staticmethod
    def create(nombre: str):
        nombre = nombre.strip()

        if not nombre:
            raise ValueError("El nombre es obligatorio.")

        if InstrumentRepository.exists_by_name(nombre):
            raise ValueError("Ya existe un instrumento con ese nombre.")

        instrumento_id = InstrumentRepository.create(nombre)

        return InstrumentRepository.get_by_id(instrumento_id)

    @staticmethod
    def update(instrument_id: int, nombre: str):

        nombre = nombre.strip()

        if not nombre:
            raise ValueError("El nombre es obligatorio.")

        instrumento = InstrumentRepository.get_by_id(instrument_id)

        if instrumento is None:
            raise ValueError("Instrumento no encontrado.")

        if InstrumentRepository.exists_by_name(nombre):
            if instrumento["nombre"].lower() != nombre.lower():
                raise ValueError(
                    "Ya existe un instrumento con ese nombre."
                )

        actualizado = InstrumentRepository.update(
            instrument_id,
            nombre
        )

        if not actualizado:
            raise ValueError("No se pudo actualizar el instrumento.")
        
        return InstrumentRepository.get_by_id(instrument_id)

    @staticmethod
    def deactivate(instrument_id: int):

        instrumento = InstrumentRepository.get_by_id(instrument_id)

        if instrumento is None:
            raise ValueError("Instrumento no encontrado.")

        desactivado = InstrumentRepository.deactivate(instrument_id)

        if not desactivado:
            raise ValueError("No se pudo desactivar el instrumento.")

        return True