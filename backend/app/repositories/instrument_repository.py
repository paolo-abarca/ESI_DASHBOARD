from mysql.connector import Error
from app.config.database import get_connection

class InstrumentRepository:
    @staticmethod
    def get_all():

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
                WHERE activo = TRUE
                ORDER BY nombre ASC
                """
            )

            return cursor.fetchall()

        except Error:
            raise

        finally:
            if cursor:
                cursor.close()

            if connection and connection.is_connected():
                connection.close()

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