from app.repositories.iglesia_repository import IglesiaRepository
from app.exceptions.not_found import NotFoundError
from app.exceptions.validation import ValidationError

class IglesiaService:
    @staticmethod
    def get_all():

        iglesias = IglesiaRepository.get_all()

        for iglesia in iglesias:
            iglesia["activo"] = bool(iglesia["activo"])

        return iglesias

    @staticmethod
    def get_by_id(iglesia_id: int):

        iglesia = IglesiaRepository.get_by_id(iglesia_id)

        if iglesia is None:
            raise NotFoundError("Iglesia no encontrada.")

        iglesia["activo"] = bool(iglesia["activo"])

        return iglesia

    @staticmethod
    def create(
        nombre: str,
        direccion: str | None = None,
        contacto: str | None = None,
        telefono: str | None = None
    ):

        nombre = nombre.strip()

        if not nombre:
            raise ValidationError(
                "El nombre de la iglesia es obligatorio."
            )

        if IglesiaRepository.exits_by_name(nombre):
            raise ValidationError(
                "Ya existe una iglesia con ese nombre."
            )

        direccion = direccion.strip() if direccion else None
        contacto = contacto.strip() if contacto else None
        telefono = telefono.strip() if telefono else None

        iglesia_id = IglesiaRepository.create(
            nombre,
            direccion,
            contacto,
            telefono
        )

        return IglesiaRepository.get_by_id(iglesia_id)

    @staticmethod
    def update(
        iglesia_id: int,
        nombre: str,
        direccion: str | None = None,
        contacto: str | None = None,
        telefono: str | None = None
    ):

        iglesia = IglesiaRepository.get_by_id(iglesia_id)

        if iglesia is None:
            raise NotFoundError("Iglesia no encontrada.")

        nombre = nombre.strip()

        if not nombre:
            raise ValidationError(
                "El nombre de la iglesia es obligatorio."
            )

        existing = IglesiaRepository.get_by_name(nombre)

        if existing and existing["id"] != iglesia_id:
            raise ValidationError(
                    "Ya existe una iglesia con ese nombre."
                )

        direccion = direccion.strip() if direccion else None
        contacto = contacto.strip() if contacto else None
        telefono = telefono.strip() if telefono else None

        updated = IglesiaRepository.update(
            iglesia_id,
            nombre,
            direccion,
            contacto,
            telefono
        )

        if not updated:
            raise ValidationError(
                "No se pudo actualizar la iglesia."
            )

        return IglesiaRepository.get_by_id(iglesia_id)

    @staticmethod
    def deactivate(iglesia_id: int):

        iglesia = IglesiaRepository.get_by_id(iglesia_id)

        if iglesia is None:
            raise NotFoundError("Iglesia no encontrada.")

        deactivated = IglesiaRepository.deactivate(iglesia_id)

        if not deactivated:
            raise ValidationError(
                "No se pudo desactivar la iglesia."
            )