from app.repositories.base_repository import BaseRepository

class TareaRepository:

    @staticmethod
    def get_all():
        return BaseRepository.execute_query(
            """
            SELECT
                t.id,
                t.clase_id,
                CONCAT(a.nombre, ' ', a.apellido) AS alumno_nombre,
                CONCAT(p.nombre, ' ', p.apellido) AS profesor_nombre,
                i.nombre AS instrumento_nombre,
                c.fecha AS clase_fecha,
                c.hora_inicio,
                c.hora_fin,
                t.titulo,
                t.descripcion,
                t.fecha_entrega,
                t.estado,
                t.created_at,
                t.updated_at
            FROM tarea t
            INNER JOIN clase c
                ON c.id = t.clase_id
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
            ORDER BY
                t.fecha_entrega ASC,
                t.id DESC
            """,
            fetchall=True
        )

    @staticmethod
    def get_by_id(tarea_id):
        return BaseRepository.execute_query(
            """
            SELECT
                t.id,
                t.clase_id,
                CONCAT(a.nombre, ' ', a.apellido) AS alumno_nombre,
                CONCAT(p.nombre, ' ', p.apellido) AS profesor_nombre,
                i.nombre AS instrumento_nombre,
                c.fecha AS clase_fecha,
                c.hora_inicio,
                c.hora_fin,
                t.titulo,
                t.descripcion,
                t.fecha_entrega,
                t.estado,
                t.created_at,
                t.updated_at
            FROM tarea t
            INNER JOIN clase c
                ON c.id = t.clase_id
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
            WHERE t.id = %s
            LIMIT 1
            """,
            (tarea_id,),
            fetchone=True
        )

    @staticmethod
    def create(
        clase_id,
        titulo,
        descripcion,
        fecha_entrega,
        estado
    ):
        return BaseRepository.execute_query(
            """
            INSERT INTO tarea
            (
                clase_id,
                titulo,
                descripcion,
                fecha_entrega,
                estado
            )
            VALUES (%s, %s, %s, %s, %s)
            """,
            (
                clase_id,
                titulo,
                descripcion,
                fecha_entrega,
                estado
            )
        )

    @staticmethod
    def update(
        tarea_id,
        titulo,
        descripcion,
        fecha_entrega
    ):
        return BaseRepository.execute_update(
            """
            UPDATE tarea
            SET titulo = %s,
                descripcion = %s,
                fecha_entrega = %s
            WHERE id = %s
            """,
            (
                titulo,
                descripcion,
                fecha_entrega,
                tarea_id
            )
        )

    @staticmethod
    def update_estado(tarea_id, estado):
        return BaseRepository.execute_update(
            """
            UPDATE tarea
            SET estado = %s
            WHERE id = %s
            """,
            (
                estado,
                tarea_id
            )
        )

    @staticmethod
    def belongs_to_profesor(
        tarea_id: int,
        profesor_id: int
    ):
        result = BaseRepository.execute_query(
            """
            SELECT 1
            FROM tarea t
            INNER JOIN clase c
                ON c.id = t.clase_id
            INNER JOIN inscripcion ins
                ON ins.id = c.inscripcion_id
            INNER JOIN profesor_instrumento pi
                ON pi.id = ins.profesor_instrumento_id
            WHERE t.id = %s
            AND pi.profesor_id = %s
            AND c.activo = TRUE
            AND ins.activo = TRUE
            AND pi.activo = TRUE
            LIMIT 1
            """,
            (tarea_id, profesor_id),
            fetchone=True
        )

        return result is not None