from app.repositories.base_repository import BaseRepository

class InscripcionRepository:

    @staticmethod
    def get_all():

        return BaseRepository.execute_query(
            """
            SELECT
                ins.id,
                ins.alumno_id,
                CONCAT(a.nombre, ' ', a.apellido) AS alumno_nombre,
                ins.profesor_instrumento_id,
                CONCAT(p.nombre, ' ', p.apellido) AS profesor_nombre,
                i.nombre AS instrumento_nombre,
                ins.tipo_clase,
                ins.fecha_inicio,
                ins.fecha_fin,
                ins.observaciones,
                ins.activo,
                ins.created_at,
                ins.updated_at
            FROM inscripcion ins
            INNER JOIN alumno a
                ON a.id = ins.alumno_id
            INNER JOIN profesor_instrumento pi
                ON pi.id = ins.profesor_instrumento_id
            INNER JOIN profesor p
                ON p.id = pi.profesor_id
            INNER JOIN instrumento i
                ON i.id = pi.instrumento_id
            WHERE ins.activo = TRUE
            ORDER BY ins.fecha_inicio DESC, ins.id DESC
            """,
            fetchall=True
        )

    @staticmethod
    def get_by_id(inscripcion_id):

        return BaseRepository.execute_query(
            """
            SELECT
                ins.id,
                ins.alumno_id,
                CONCAT(a.nombre, ' ', a.apellido) AS alumno_nombre,
                ins.profesor_instrumento_id,
                CONCAT(p.nombre, ' ', p.apellido) AS profesor_nombre,
                i.nombre AS instrumento_nombre,
                ins.tipo_clase,
                ins.fecha_inicio,
                ins.fecha_fin,
                ins.observaciones,
                ins.activo,
                ins.created_at,
                ins.updated_at
            FROM inscripcion ins
            INNER JOIN alumno a
                ON a.id = ins.alumno_id
            INNER JOIN profesor_instrumento pi
                ON pi.id = ins.profesor_instrumento_id
            INNER JOIN profesor p
                ON p.id = pi.profesor_id
            INNER JOIN instrumento i
                ON i.id = pi.instrumento_id
            WHERE ins.id = %s
            AND ins.activo = TRUE
            LIMIT 1
            """,
            (inscripcion_id,),
            fetchone=True
        )

    @staticmethod
    def exists(
        alumno_id: int,
        profesor_instrumento_id: int,
        tipo_clase: str
    ):

        result = BaseRepository.execute_query(
            """
            SELECT id
            FROM inscripcion
            WHERE alumno_id = %s
            AND profesor_instrumento_id = %s
            AND tipo_clase = %s
            AND activo = TRUE
            LIMIT 1
            """,
            (
                alumno_id,
                profesor_instrumento_id,
                tipo_clase
            ),
            fetchone=True
        )

        return result is not None

    @staticmethod
    def create(
        alumno_id,
        profesor_instrumento_id,
        tipo_clase,
        fecha_inicio,
        fecha_fin,
        observaciones
    ):

        return BaseRepository.execute_query(
            """
            INSERT INTO inscripcion
            (
                alumno_id,
                profesor_instrumento_id,
                tipo_clase,
                fecha_inicio,
                fecha_fin,
                observaciones
            )
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (
                alumno_id,
                profesor_instrumento_id,
                tipo_clase,
                fecha_inicio,
                fecha_fin,
                observaciones
            )
        )

    @staticmethod
    def update(
        inscripcion_id,
        fecha_inicio,
        fecha_fin,
        observaciones
    ):

        return BaseRepository.execute_update(
            """
            UPDATE inscripcion
            SET
                fecha_inicio = %s,
                fecha_fin = %s,
                observaciones = %s
            WHERE id = %s
            AND activo = TRUE
            """,
            (
                fecha_inicio,
                fecha_fin,
                observaciones,
                inscripcion_id
            )
        )

    @staticmethod
    def deactivate(inscripcion_id):

        return BaseRepository.execute_update(
            """
            UPDATE inscripcion
            SET activo = FALSE
            WHERE id = %s
            AND activo = TRUE
            """,
            (inscripcion_id,)
        )

    @staticmethod
    def get_by_unique(
        alumno_id,
        profesor_instrumento_id,
        tipo_clase
    ):

        return BaseRepository.execute_query(
            """
            SELECT
                id,
                alumno_id,
                profesor_instrumento_id,
                tipo_clase,
                fecha_inicio,
                fecha_fin,
                observaciones,
                activo
            FROM inscripcion
            WHERE alumno_id = %s
            AND profesor_instrumento_id = %s
            AND tipo_clase = %s
            LIMIT 1
            """,
            (
                alumno_id,
                profesor_instrumento_id,
                tipo_clase
            ),
            fetchone=True
        )

    @staticmethod
    def reactivate(
        inscripcion_id,
        fecha_inicio,
        fecha_fin,
        observaciones
    ):

        return BaseRepository.execute_update(
            """
            UPDATE inscripcion
            SET
                fecha_inicio = %s,
                fecha_fin = %s,
                observaciones = %s,
                activo = TRUE
            WHERE id = %s
            AND activo = FALSE
            """,
            (
                fecha_inicio,
                fecha_fin,
                observaciones,
                inscripcion_id
            )
        )