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