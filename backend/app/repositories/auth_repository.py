from mysql.connector import Error
from app.config.database import get_connection

class AuthRepository:
    @staticmethod
    def find_by_email(email: str):
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
                    apellido,
                    email,
                    password_hash,
                    activo
                FROM profesor
                WHERE email = %s
                LIMIT 1
                """,
                (email,)
            )

            return cursor.fetchone()

        except Error:
            raise

        finally:
            if cursor:
                cursor.close()

            if connection and connection.is_connected():
                connection.close()