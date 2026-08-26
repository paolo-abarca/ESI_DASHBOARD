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
        google_id: str | None = None,
        foto_url: str | None = None
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
                    google_id = %s,
                    foto_url = %s
                WHERE id = %s
                AND activo = TRUE
                """,
                (
                    nombre,
                    apellido,
                    email,
                    password_hash,
                    google_id,
                    foto_url,
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
                google_id = %s,
                foto_url = %s
            WHERE id = %s
            AND activo = TRUE
            """,
            (
                nombre,
                apellido,
                email,
                google_id,
                foto_url,
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