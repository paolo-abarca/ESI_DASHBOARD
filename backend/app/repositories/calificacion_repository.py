from app.repositories.base_repository import BaseRepository

class CalificacionRepository:

    @staticmethod
    def get_all():
        return BaseRepository.execute_query(
            """
            SELECT
                c.id,
                c.clase_id,
                c.inscripcion_id,
                CONCAT(al.nombre, ' ', al.apellido) AS alumno_nombre,
                CONCAT(p.nombre, ' ', p.apellido) AS profesor_nombre,
                i.nombre AS instrumento_nombre,
                cl.fecha,
                cl.hora_inicio,
                cl.hora_fin,
                c.tipo,
                c.nota,
                c.created_at,
                c.updated_at
            FROM calificacion c
            INNER JOIN clase cl
                ON cl.id = c.clase_id
            INNER JOIN inscripcion ins
                ON ins.id = c.inscripcion_id
            INNER JOIN alumno al
                ON al.id = ins.alumno_id
            INNER JOIN profesor_instrumento pi
                ON pi.id = ins.profesor_instrumento_id
            INNER JOIN profesor p
                ON p.id = pi.profesor_id
            INNER JOIN instrumento i
                ON i.id = pi.instrumento_id
            ORDER BY
                cl.fecha DESC,
                cl.hora_inicio DESC,
                c.id DESC
            """,
            fetchall=True
        )

    @staticmethod
    def get_by_id(calificacion_id):
        return BaseRepository.execute_query(
            """
            SELECT
                c.id,
                c.clase_id,
                c.inscripcion_id,
                CONCAT(al.nombre, ' ', al.apellido) AS alumno_nombre,
                CONCAT(p.nombre, ' ', p.apellido) AS profesor_nombre,
                i.nombre AS instrumento_nombre,
                cl.fecha,
                cl.hora_inicio,
                cl.hora_fin,
                c.tipo,
                c.nota,
                c.created_at,
                c.updated_at
            FROM calificacion c
            INNER JOIN clase cl
                ON cl.id = c.clase_id
            INNER JOIN inscripcion ins
                ON ins.id = c.inscripcion_id
            INNER JOIN alumno al
                ON al.id = ins.alumno_id
            INNER JOIN profesor_instrumento pi
                ON pi.id = ins.profesor_instrumento_id
            INNER JOIN profesor p
                ON p.id = pi.profesor_id
            INNER JOIN instrumento i
                ON i.id = pi.instrumento_id
            WHERE c.id = %s
            LIMIT 1
            """,
            (calificacion_id,),
            fetchone=True
        )

    @staticmethod
    def get_by_clase_inscripcion_tipo(
        clase_id,
        inscripcion_id,
        tipo
    ):
        return BaseRepository.execute_query(
            """
            SELECT
                id,
                clase_id,
                inscripcion_id,
                tipo,
                nota,
                created_at,
                updated_at
            FROM calificacion
            WHERE clase_id = %s
            AND inscripcion_id = %s
            AND tipo = %s
            LIMIT 1
            """,
            (clase_id, inscripcion_id, tipo),
            fetchone=True
        )

    @staticmethod
    def create(
        clase_id,
        inscripcion_id,
        tipo,
        nota
    ):
        return BaseRepository.execute_query(
            """
            INSERT INTO calificacion
            (
                clase_id,
                inscripcion_id,
                tipo,
                nota
            )
            VALUES (%s, %s, %s, %s)
            """,
            (
                clase_id,
                inscripcion_id,
                tipo,
                nota
            )
        )

    @staticmethod
    def update(calificacion_id, tipo, nota):
        return BaseRepository.execute_update(
            """
            UPDATE calificacion
            SET tipo = %s,
                nota = %s
            WHERE id = %s
            """,
            (
                tipo,
                nota,
                calificacion_id
            )
        )