from app.repositories.base_repository import BaseRepository

class ClaseRepository:

    @staticmethod
    def get_all():

        return BaseRepository.execute_query(
            """
            SELECT
                c.id,
                c.inscripcion_id,
                CONCAT(a.nombre, ' ', a.apellido)
                AS alumno_nombre,
                CONCAT(p.nombre, ' ', p.apellido)
                AS profesor_nombre,
                i.nombre AS instrumento_nombre,
                ins.tipo_clase,
                c.fecha,
                c.hora_inicio,
                c.hora_fin,
                c.tema,
                c.observaciones,
                c.activo,
                c.created_at,
                c.updated_at
            FROM clase c
            INNER JOIN inscripcion ins
                ON ins.id = c.inscripcion_id
            INNER JOIN alumno a
                ON a.id = ins.alumno_id
            INNER JOIN profesor_instrumento pi
                ON pi.id = ins.profesor_instrumento_id
            INNER JOIN profesor p
                ON p.id = pi.profesor_id
            INNER JOIN instrumento i
                ON i.id = pi.instrumento_id
            WHERE c.activo = TRUE
            ORDER BY
                c.fecha DESC,
                c.hora_inicio DESC,
                c.id DESC
            """,
            fetchall=True
        )

    @staticmethod
    def get_by_id(clase_id):

        return BaseRepository.execute_query(
            """
            SELECT
                c.id,
                c.inscripcion_id,
                CONCAT(a.nombre, ' ', a.apellido)
                AS alumno_nombre,
                CONCAT(p.nombre, ' ', p.apellido)
                AS profesor_nombre,
                i.nombre AS instrumento_nombre,
                ins.tipo_clase,
                c.fecha,
                c.hora_inicio,
                c.hora_fin,
                c.tema,
                c.observaciones,
                c.activo,
                c.created_at,
                c.updated_at
            FROM clase c
            INNER JOIN inscripcion ins
                ON ins.id = c.inscripcion_id
            INNER JOIN alumno a
                ON a.id = ins.alumno_id
            INNER JOIN profesor_instrumento pi
                ON pi.id = ins.profesor_instrumento_id
            INNER JOIN profesor p
                ON p.id = pi.profesor_id
            INNER JOIN instrumento i
                ON i.id = pi.instrumento_id
            WHERE c.id = %s
            AND c.activo = TRUE
            LIMIT 1
            """,
            (clase_id,),
            fetchone=True
        )

    @staticmethod
    def create(
        inscripcion_id,
        fecha,
        hora_inicio,
        hora_fin,
        tema,
        observaciones
    ):

        return BaseRepository.execute_query(
            """
            INSERT INTO clase
            (
                inscripcion_id,
                fecha,
                hora_inicio,
                hora_fin,
                tema,
                observaciones
            )
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (
                inscripcion_id,
                fecha,
                hora_inicio,
                hora_fin,
                tema,
                observaciones
            )
        )

    @staticmethod
    def update(
        clase_id,
        fecha,
        hora_inicio,
        hora_fin,
        tema,
        observaciones
    ):

        return BaseRepository.execute_update(
            """
            UPDATE clase
            SET
                fecha = %s,
                hora_inicio = %s,
                hora_fin = %s,
                tema = %s,
                observaciones = %s
            WHERE id = %s
            AND activo = TRUE
            """,
            (
                fecha,
                hora_inicio,
                hora_fin,
                tema,
                observaciones,
                clase_id
            )
        )

    @staticmethod
    def deactivate(clase_id):

        return BaseRepository.execute_update(
            """
            UPDATE clase
            SET activo = FALSE
            WHERE id = %s
            AND activo = TRUE
            """,
            (clase_id,)
        )

    @staticmethod
    def belongs_to_profesor(
        clase_id: int,
        profesor_id: int
    ):
        result = BaseRepository.execute_query(
            """
            SELECT 1
            FROM clase c
            INNER JOIN inscripcion ins
                ON ins.id = c.inscripcion_id
            INNER JOIN profesor_instrumento pi
                ON pi.id = ins.profesor_instrumento_id
            WHERE c.id = %s
            AND pi.profesor_id = %s
            AND c.activo = TRUE
            AND ins.activo = TRUE
            AND pi.activo = TRUE
            LIMIT 1
            """,
            (clase_id, profesor_id),
            fetchone=True
        )

        return result is not None