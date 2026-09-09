from app.repositories.base_repository import BaseRepository

class AsistenciaRepository:

    @staticmethod
    def get_all():

        return BaseRepository.execute_query(
            """
            SELECT
                a.id,
                a.clase_id,
                a.inscripcion_id,
                CONCAT(al.nombre, ' ', al.apellido)
                    AS alumno_nombre,
                CONCAT(p.nombre, ' ', p.apellido)
                    AS profesor_nombre,
                i.nombre AS instrumento_nombre,
                c.fecha,
                c.hora_inicio,
                c.hora_fin,
                a.estado,
                a.created_at,
                a.updated_at
            FROM asistencia a
            INNER JOIN clase c
                ON c.id = a.clase_id
            INNER JOIN inscripcion ins
                ON ins.id = a.inscripcion_id
            INNER JOIN alumno al
                ON al.id = ins.alumno_id
            INNER JOIN profesor_instrumento pi
                ON pi.id = ins.profesor_instrumento_id
            INNER JOIN profesor p
                ON p.id = pi.profesor_id
            INNER JOIN instrumento i
                ON i.id = pi.instrumento_id
            ORDER BY
                c.fecha DESC,
                c.hora_inicio DESC,
                a.id DESC
            """,
            fetchall=True
        )

    @staticmethod
    def get_by_id(asistencia_id):

        return BaseRepository.execute_query(
            """
            SELECT
                a.id,
                a.clase_id,
                a.inscripcion_id,
                CONCAT(al.nombre, ' ', al.apellido)
                    AS alumno_nombre,
                CONCAT(p.nombre, ' ', p.apellido)
                    AS profesor_nombre,
                i.nombre AS instrumento_nombre,
                c.fecha,
                c.hora_inicio,
                c.hora_fin,
                a.estado,
                a.created_at,
                a.updated_at
            FROM asistencia a
            INNER JOIN clase c
                ON c.id = a.clase_id
            INNER JOIN inscripcion ins
                ON ins.id = a.inscripcion_id
            INNER JOIN alumno al
                ON al.id = ins.alumno_id
            INNER JOIN profesor_instrumento pi
                ON pi.id = ins.profesor_instrumento_id
            INNER JOIN profesor p
                ON p.id = pi.profesor_id
            INNER JOIN instrumento i
                ON i.id = pi.instrumento_id
            WHERE a.id = %s
            LIMIT 1
            """,
            (asistencia_id,),
            fetchone=True
        )

    @staticmethod
    def get_by_clase_and_inscripcion(
        clase_id,
        inscripcion_id
    ):

        return BaseRepository.execute_query(
            """
            SELECT
                id,
                clase_id,
                inscripcion_id,
                estado,
                created_at,
                updated_at
            FROM asistencia
            WHERE clase_id = %s
            AND inscripcion_id = %s
            LIMIT 1
            """,
            (
                clase_id,
                inscripcion_id
            ),
            fetchone=True
        )

    @staticmethod
    def create(
        clase_id,
        inscripcion_id,
        estado
    ):

        return BaseRepository.execute_query(
            """
            INSERT INTO asistencia
            (
                clase_id,
                inscripcion_id,
                estado
            )
            VALUES (%s, %s, %s)
            """,
            (
                clase_id,
                inscripcion_id,
                estado
            )
        )

    @staticmethod
    def update(
        asistencia_id,
        estado
    ):

        return BaseRepository.execute_update(
            """
            UPDATE asistencia
            SET estado = %s
            WHERE id = %s
            """,
            (
                estado,
                asistencia_id
            )
        )