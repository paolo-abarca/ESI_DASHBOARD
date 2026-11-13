from app.repositories.base_repository import BaseRepository

class ProfesorRepository:

    @staticmethod
    def get_all():

        return BaseRepository.execute_query(
            """
            SELECT
                id,
                nombre,
                apellido,
                email,
                google_id,
                foto_url,
                ultimo_login,
                activo,
                created_at,
                updated_at
            FROM profesor
            WHERE activo = TRUE
            ORDER BY apellido ASC, nombre ASC
            """,
            fetchall=True
        )

    @staticmethod
    def get_by_id(profesor_id: int):

        return BaseRepository.execute_query(
            """
            SELECT
                id,
                nombre,
                apellido,
                email,
                google_id,
                foto_url,
                ultimo_login,
                activo,
                created_at,
                updated_at
            FROM profesor
            WHERE id = %s
            AND activo = TRUE
            LIMIT 1
            """,
            (profesor_id,),
            fetchone=True
        )

    @staticmethod
    def get_by_email(email: str):

        return BaseRepository.execute_query(
            """
            SELECT
                id,
                nombre,
                apellido,
                email,
                password_hash,
                google_id,
                foto_url,
                ultimo_login,
                activo,
                created_at,
                updated_at
            FROM profesor
            WHERE email = %s
            LIMIT 1
            """,
            (email,),
            fetchone=True
        )

    @staticmethod
    def exists_by_email(email: str):

        result = BaseRepository.execute_query(
            """
            SELECT id
            FROM profesor
            WHERE email = %s
            LIMIT 1
            """,
            (email,),
            fetchone=True
        )

        return result is not None

    @staticmethod
    def create(
        nombre: str,
        apellido: str,
        email: str,
        password_hash: str,
        google_id: str | None = None,
        foto_url: str | None = None
    ):

        return BaseRepository.execute_query(
            """
            INSERT INTO profesor
            (
                nombre,
                apellido,
                email,
                password_hash,
                google_id,
                foto_url
            )
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (
                nombre,
                apellido,
                email,
                password_hash,
                google_id,
                foto_url
            )
        )

    @staticmethod
    def get_by_email_except_id(email: str, profesor_id: int):

        return BaseRepository.execute_query(
            """
            SELECT id
            FROM profesor
            WHERE email = %s
            AND id <> %s
            LIMIT 1
            """,
            (email, profesor_id),
            fetchone=True
        )

    @staticmethod
    def update(
        profesor_id: int,
        nombre: str,
        apellido: str,
        email: str,
        password_hash: str | None = None,
        google_id: str | None = None
    ):
        if password_hash is not None:

            return BaseRepository.execute_update(
                """
                UPDATE profesor
                SET
                    nombre = %s,
                    apellido = %s,
                    email = %s,
                    password_hash = %s,
                    google_id = %s
                WHERE id = %s
                AND activo = TRUE
                """,
                (
                    nombre,
                    apellido,
                    email,
                    password_hash,
                    google_id,
                    profesor_id
                )
            )

        return BaseRepository.execute_update(
            """
            UPDATE profesor
            SET
                nombre = %s,
                apellido = %s,
                email = %s,
                google_id = %s
            WHERE id = %s
            AND activo = TRUE
            """,
            (
                nombre,
                apellido,
                email,
                google_id,
                profesor_id
            )
        )

    @staticmethod
    def deactivate(profesor_id: int):

        return BaseRepository.execute_update(
            """
            UPDATE profesor
            SET activo = FALSE
            WHERE id = %s
            AND activo = TRUE
            """,
            (profesor_id,)
        )

    @staticmethod
    def get_photo_data(profesor_id: int):
        return BaseRepository.execute_query(
            """
            SELECT id, foto_url, foto_public_id
            FROM profesor
            WHERE id = %s
            AND activo = TRUE
            LIMIT 1
            """,
            (profesor_id,),
            fetchone=True
        )
    
    @staticmethod
    def update_photo(
        profesor_id: int,
        foto_url: str,
        foto_public_id: str
    ):
        return BaseRepository.execute_update(
            """
            UPDATE profesor
            SET
                foto_url = %s,
                foto_public_id = %s
            WHERE id = %s
            AND activo = TRUE
            """,
            (foto_url, foto_public_id, profesor_id)
        )
    
    @staticmethod
    def clear_photo(profesor_id: int):
        return BaseRepository.execute_update(
            """
            UPDATE profesor
            SET foto_url = NULL, foto_public_id = NULL
            WHERE id = %s AND activo = TRUE
            """,
            (profesor_id,)
        )