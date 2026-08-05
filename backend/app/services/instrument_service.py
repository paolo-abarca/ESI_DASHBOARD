from app.repositories.instrument_repository import InstrumentRepository

class InstrumentService:
    @staticmethod
    def get_all():

        instrumentos = InstrumentRepository.get_all()

        for instrumento in instrumentos:
            instrumento["activo"] = bool(instrumento["activo"])

        return instrumentos