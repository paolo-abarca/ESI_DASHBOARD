from mysql.connector import Error
from app.config.database import get_connection
from app.repositories.base_repository import BaseRepository

class InstrumentRepository:
    @staticmethod
    def get_all():

        return BaseRepository.execute_query(
            """
            SELECT
                id,
                nombre,
                activo,
                created_at,
                updated_at
            FROM instrumento
            WHERE activo = TRUE
            ORDER BY nombre ASC
            """,
            fetchall=True
        )

    @staticmethod
    def get_by_id(instrument_id: int):

        return BaseRepository.execute_query(
            """
            SELECT
                id,
                nombre,
                activo,
                created_at,
                updated_at
            FROM instrumento
            WHERE id = %s
            AND activo = TRUE
            LIMIT 1
            """,
            (instrument_id,),
            fetchone=True
        )

    @staticmethod
    def exists_by_name(nombre: str):

        result = BaseRepository.execute_query(
            """
            SELECT id
            FROM instrumento
            WHERE nombre = %s
            AND activo = TRUE
            LIMIT 1
            """,
            (nombre,),
            fetchone=True
        )

        return result is not None

    @staticmethod
    def create(nombre: str):

        return BaseRepository.execute_query(
            """
            INSERT INTO instrumento(nombre)
            VALUES (%s)
            """,
            (nombre,)
        )

    @staticmethod
    def update(instrument_id: int, nombre: str):

        return BaseRepository.execute_update(
            """
            UPDATE instrumento
            SET nombre = %s
            WHERE id = %s
            AND activo = TRUE
            """,
            (nombre, instrument_id)
        )

    @staticmethod
    def deactivate(instrument_id: int):

        return BaseRepository.execute_update(
            """
            UPDATE instrumento
            SET activo = FALSE
            WHERE id = %s
            AND activo = TRUE
            """,
            (instrument_id,)
        )