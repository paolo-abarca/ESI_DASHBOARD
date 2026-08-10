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

        connection = None
        cursor = None

        try:
            connection = get_connection()
            cursor = connection.cursor(dictionary=True)
            cursor.execute(
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
                (instrument_id,)
            )

            return cursor.fetchone()

        except Error:
            raise

        finally:
            if cursor:
                cursor.close()

            if connection and connection.is_connected():
                connection.close()

    @staticmethod
    def exists_by_name(nombre: str):

        connection = None
        cursor = None

        try:
            connection = get_connection()
            cursor = connection.cursor(dictionary=True)
            cursor.execute(
                """
                SELECT id
                FROM instrumento
                WHERE nombre = %s
                AND activo = TRUE
                LIMIT 1
                """,
                (nombre,)
            )

            return cursor.fetchone() is not None

        except Error:
            raise

        finally:
            if cursor:
                cursor.close()

            if connection and connection.is_connected():
                connection.close()

    @staticmethod
    def create(nombre: str):

        connection = None
        cursor = None

        try:
            connection = get_connection()
            cursor = connection.cursor(dictionary=True)
            cursor.execute(
                """
                INSERT INTO instrumento(nombre)
                VALUES (%s)
                """,
                (nombre,)
            )

            connection.commit()

            return cursor.lastrowid
        
        except Error:
            connection.rollback()
            raise

        finally:
            if cursor:
                cursor.close()

            if connection and connection.is_connected():
                connection.close()

    @staticmethod
    def update(instrument_id: int, nombre: str):

        connection = None
        cursor = None

        try:
            connection = get_connection()
            cursor = connection.cursor()
            cursor.execute(
                """
                UPDATE instrumento
                SET nombre = %s
                WHERE id = %s
                AND activo = TRUE
                """,
                (nombre, instrument_id)
            )

            connection.commit()

            return cursor.rowcount > 0
        
        except Error:
            if connection:
                connection.rollback()
            raise

        finally:
            if cursor:
                cursor.close()

            if connection and connection.is_connected():
                connection.close()

    @staticmethod
    def deactivate(instrument_id: int):

        connection = None
        cursor = None

        try:
            connection = get_connection()
            cursor = connection.cursor()
            cursor.execute(
                """
                UPDATE instrumento
                SET activo = FALSE
                WHERE id = %s
                AND activo = TRUE
                """,
                (instrument_id,)
            )

            connection.commit()

            return cursor.rowcount > 0
        
        except Error:
            if connection:
                connection.rollback()
            raise

        finally:
            if cursor:
                cursor.close()

            if connection and connection.is_connected():
                connection.close()