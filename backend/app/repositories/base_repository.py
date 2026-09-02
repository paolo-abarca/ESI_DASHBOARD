from app.config.database import get_connection
from datetime import date, datetime, timedelta

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

    @staticmethod
    def execute_update(query, params=None):

        connection = None
        cursor = None

        try:
            connection = get_connection()
            cursor = connection.cursor(dictionary=True)

            cursor.execute(query, params or ())
            connection.commit()

            return cursor.rowcount

        finally:
            if cursor:
                cursor.close()

            if connection and connection.is_connected():
                connection.close()

    @staticmethod
    def _serialize_value(value):

        if isinstance(value, timedelta):
            total_seconds = int(value.total_seconds())

            hours, remainder = divmod(
                total_seconds,
                3600
            )

            minutes, seconds = divmod(
                remainder,
                60
            )

            return (
                f"{hours:02d}:"
                f"{minutes:02d}:"
                f"{seconds:02d}"
            )
        
        if isinstance(value, (datetime, date)):
            return value.isoformat()

        return value

    @staticmethod
    def _serialize_row(row):

        if row is None:
            return None

        return {
            key: BaseRepository._serialize_value(value)
            for key, value in row.items()
        }

    @staticmethod
    def _serialize_rows(rows):

        return [
            BaseRepository._serialize_row(row)
            for row in rows
        ]

    @staticmethod
    def execute_query(
        query,
        params=None,
        fetchone=False,
        fetchall=False
    ):

        connection = None
        cursor = None

        try:
            connection = get_connection()
            cursor = connection.cursor(
                dictionary=True
            )

            cursor.execute(
                query,
                params or ()
            )

            if fetchone:
                row = cursor.fetchone()
                return BaseRepository._serialize_row(
                    row
                )
            
            if fetchall:
                rows = cursor.fetchall()
                return BaseRepository._serialize_rows(
                    rows
                )

            connection.commit()

            return cursor.lastrowid

        finally:
            if cursor:
                cursor.close()

            if connection and connection.is_connected():
                connection.close()