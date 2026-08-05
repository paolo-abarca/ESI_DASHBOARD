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