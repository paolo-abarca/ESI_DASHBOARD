from app.config.database import get_connection

class HealthService:
    @staticmethod
    def check_database():
        try:
            connection = get_connection()

            if connection.is_connected():
                connection.close()
                return True

            return False

        except Exception:
            return False