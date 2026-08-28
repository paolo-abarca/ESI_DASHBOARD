from app.repositories.base_repository import BaseRepository

class ProfesorIglesiaRepository:

    @staticmethod
    def exists(profesor_id: int, iglesia_id: int):

        result = BaseRepository.execute_query(
            """
            SELECT id
            FROM profesor_iglesia
            WHERE profesor_id = %s
            AND iglesia_id = %s
            AND activo = TRUE
            LIMIT 1
            """,
            (profesor_id, iglesia_id),
            fetchone=True
        )

        return result is not None

    @staticmethod
    def get_by_ids(profesor_id: int, iglesia_id: int):

        return BaseRepository.execute_query(
            """
            SELECT
                id,
                profesor_id,
                iglesia_id,
                activo,
                created_at
            FROM profesor_iglesia
            WHERE profesor_id = %s
            AND iglesia_id = %s
            AND activo = TRUE
            LIMIT 1
            """,
            (profesor_id, iglesia_id),
            fetchone=True
        )

    @staticmethod
    def create(profesor_id: int, iglesia_id: int):

        return BaseRepository.execute_query(
            """
            INSERT INTO profesor_iglesia
            (
                profesor_id,
                iglesia_id
            )
            VALUES (%s, %s)
            """,
            (profesor_id, iglesia_id)
        )

    @staticmethod
    def get_iglesias_by_profesor(profesor_id: int):

        return BaseRepository.execute_query(
            """
            SELECT
                i.id,
                i.nombre,
                i.direccion,
                i.contacto,
                i.telefono,
                pi.id AS profesor_iglesia_id,
                pi.activo,
                pi.created_at
            FROM profesor_iglesia pi
            INNER JOIN iglesia i
                ON i.id = pi.iglesia_id
            WHERE pi.profesor_id = %s
            AND pi.activo = TRUE
            AND i.activo = TRUE
            ORDER BY i.nombre ASC
            """,
            (profesor_id,),
            fetchall=True
        )

    @staticmethod
    def deactivate(profesor_id: int, iglesia_id: int):

        return BaseRepository.execute_update(
            """
            UPDATE profesor_iglesia
            SET activo = FALSE
            WHERE profesor_id = %s
            AND iglesia_id = %s
            AND activo = TRUE
            """,
            (profesor_id, iglesia_id)
        )