from app.config.database import get_connection

class BaseRepository:

    @staticmethod
    def execute_query(query, params=None, fetchone=False, fetchall=False):

        connection = None
        cursor = None

        try:
            connection = get_connection()
            cursor = connection.cursor(dictionary=True)
            cursor.execute(query, params or ())

            if fetchone:
                return cursor.fetchone()
            
            if fetchall:
                return cursor.fetchall()

            connection.commit()

            return cursor.lastrowid

        finally:
            if cursor:
                cursor.close()

            if connection and connection.is_connected():
                connection.close()