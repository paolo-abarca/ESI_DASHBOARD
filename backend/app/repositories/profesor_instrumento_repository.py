from app.repositories.base_repository import BaseRepository

class ProfesorInstrumentoRepository:

    @staticmethod
    def exists(profesor_id: int, instrumento_id: int):

        result = BaseRepository.execute_query(
            """
            SELECT id
            FROM profesor_instrumento
            WHERE profesor_id = %s
            AND instrumento_id = %s
            AND activo = TRUE
            LIMIT 1
            """,
            (profesor_id, instrumento_id),
            fetchone=True
        )

        return result is not None

    @staticmethod
    def get_by_ids(
        profesor_id: int,
        instrumento_id: int
    ):

        return BaseRepository.execute_query(
            """
            SELECT
                id,
                profesor_id,
                instrumento_id,
                activo,
                created_at,
                updated_at
            FROM profesor_instrumento
            WHERE profesor_id = %s
            AND instrumento_id = %s
            AND activo = TRUE
            LIMIT 1
            """,
            (profesor_id, instrumento_id),
            fetchone=True
        )

    @staticmethod
    def create(
        profesor_id: int,
        instrumento_id: int
    ):

        return BaseRepository.execute_query(
            """
            INSERT INTO profesor_instrumento
            (
                profesor_id,
                instrumento_id
            )
            VALUES (%s, %s)
            """,
            (
                profesor_id,
                instrumento_id
            )
        )

    @staticmethod
    def get_instrumentos_by_profesor(
        profesor_id: int
    ):

        return BaseRepository.execute_query(
            """
            SELECT
                i.id,
                i.nombre,
                pi.id AS profesor_instrumento_id,
                pi.activo,
                pi.created_at,
                pi.updated_at
            FROM profesor_instrumento pi
            INNER JOIN instrumento i
            ON i.id = pi.instrumento_id
            WHERE pi.profesor_id = %s
            AND pi.activo = TRUE
            AND i.activo = TRUE
            ORDER BY i.nombre ASC
            """,
            (profesor_id,),
            fetchall=True
        )

    @staticmethod
    def deactivate(
        profesor_id: int,
        instrumento_id: int
    ):

        return BaseRepository.execute_update(
            """
            UPDATE profesor_instrumento
            SET activo = FALSE
            WHERE profesor_id = %s
            AND instrumento_id = %s
            AND activo = TRUE
            """,
            (
                profesor_id,
                instrumento_id
            )
        )

    @staticmethod
    def get_by_id(profesor_instrumento_id: int):

        return BaseRepository.execute_query(
            """
            SELECT
                id,
                profesor_id,
                instrumento_id,
                activo,
                created_at,
                updated_at
            FROM profesor_instrumento
            WHERE id = %s
            AND activo = TRUE
            LIMIT 1
            """,
            (profesor_instrumento_id,),
            fetchone=True
        )

    @staticmethod
    def belongs_to_profesor(
        profesor_instrumento_id: int,
        profesor_id: int
    ):
        result = BaseRepository.execute_query(
            """
            SELECT 1
            FROM profesor_instrumento
            WHERE id = %s
            AND profesor_id = %s
            AND activo = TRUE
            LIMIT 1
            """,
            (profesor_instrumento_id, profesor_id),
            fetchone=True
        )

        return result is not None