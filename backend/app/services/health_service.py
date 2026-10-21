from app.config.database import get_connection

class HealthService:
    @staticmethod
    def check_database():
        connection = None

        try:
            connection = get_connection()

            if not connection.is_connected():
                return False

            cursor = connection.cursor()
            try:
                cursor.execute("SELECT 1")
                result = cursor.fetchone()
                return result is not None and result[0] == 1
            finally:
                cursor.close()

        except Exception:
            return False

        finally:
            if connection is not None:
                try:
                    connection.close()
                except Exception:
                    pass