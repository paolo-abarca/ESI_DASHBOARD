from app.repositories.base_repository import BaseRepository
from app.config.database import get_connection

class IglesiaRepository:
    @staticmethod
    def get_all():

        return BaseRepository.execute_query(
            """
            SELECT
                id,
                nombre,
                direccion,
                contacto,
                telefono,
                activo,
                created_at,
                updated_at
            FROM iglesia
            WHERE activo = TRUE
            ORDER BY nombre ASC
            """,
            fetchall=True
        )

    @staticmethod
    def get_by_id(iglesia_id: int):

        return BaseRepository.execute_query(
            """
            SELECT
                id,
                nombre,
                direccion,
                contacto,
                telefono,
                activo,
                created_at,
                updated_at
            FROM iglesia
            WHERE id = %s
            AND activo = TRUE
            LIMIT 1
            """,
            (iglesia_id,),
            fetchone=True
        )

    @staticmethod
    def exits_by_name(nombre: str):

        result = BaseRepository.execute_query(
            """
            SELECT id
            FROM iglesia
            WHERE nombre = %s
            AND activo = TRUE
            LIMIT 1
            """,
            (nombre,),
            fetchone=True
        )

        return result is not None

    @staticmethod
    def create(
        nombre: str,
        direccion: str | None,
        contacto: str | None,
        telefono: str | None
    ):

        return BaseRepository.execute_query(
            """
            INSERT INTO iglesia
            (
                nombre,
                direccion,
                contacto,
                telefono
            )
            VALUES (%s, %s, %s, %s)
            """,
            (
                nombre,
                direccion,
                contacto,
                telefono
            )
        )

    @staticmethod
    def update(
        iglesia_id: int,
        nombre: str,
        direccion: str | None,
        contacto: str | None,
        telefono: str | None
    ):

        connection = None
        cursor = None

        try:
            connection = get_connection()
            cursor = connection.cursor()

            cursor.execute(
                """
                UPDATE iglesia
                SET
                    nombre = %s,
                    direccion = %s,
                    contacto = %s,
                    telefono = %s
                WHERE id = %s
                AND activo = TRUE
                """,
                (
                    nombre,
                    direccion,
                    contacto,
                    telefono,
                    iglesia_id
                )
            )

            connection.commit()

            return cursor.rowcount > 0

        finally:
            if cursor:
                cursor.close()

            if connection and connection.is_connected():
                connection.close()

    @staticmethod
    def get_by_name(nombre: str):

        return BaseRepository.execute_query(
            """
            SELECT
                id,
                nombre
            FROM iglesia
            WHERE nombre = %s
            AND activo = TRUE
            LIMIT 1
            """,
            (nombre,),
            fetchone=True
        )

    @staticmethod
    def deactivate(iglesia_id: int):

        connection = None
        cursor = None

        try:
            connection = get_connection()
            cursor = connection.cursor()

            cursor.execute(
                """
                UPDATE iglesia
                SET activo = False
                WHERE id = %s
                AND activo = True
                """,
                (iglesia_id,)
            )

            connection.commit()

            return cursor.rowcount > 0

        finally:
            if cursor:
                cursor.close()

            if connection and connection.is_connected():
                connection.close()