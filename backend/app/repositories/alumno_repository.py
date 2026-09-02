from app.repositories.base_repository import BaseRepository

class AlumnoRepository:

    @staticmethod
    def get_all():

        return BaseRepository.execute_query(
            """
            SELECT
                a.id,
                a.nombre,
                a.apellido,
                a.fecha_nacimiento,
                a.celular,
                a.genero,
                a.imagen,
                a.iglesia_id,
                i.nombre AS iglesia_nombre,
                a.activo,
                a.created_at,
                a.updated_at
            FROM alumno a
            LEFT JOIN iglesia i
            ON i.id = a.iglesia_id
            WHERE a.activo = TRUE
            ORDER BY a.apellido ASC, a.nombre ASC
            """,
            fetchall=True
        )

    @staticmethod
    def get_by_id(alumno_id: int):

        return BaseRepository.execute_query(
            """
            SELECT
                a.id,
                a.nombre,
                a.apellido,
                a.fecha_nacimiento,
                a.celular,
                a.genero,
                a.imagen,
                a.iglesia_id,
                i.nombre AS iglesia_nombre,
                a.activo,
                a.created_at,
                a.updated_at
            FROM alumno a
            LEFT JOIN iglesia i
            ON i.id = a.iglesia_id
            WHERE a.id = %s
            AND a.activo = TRUE
            LIMIT 1
            """,
            (alumno_id,),
            fetchone=True
        )

    @staticmethod
    def create(
        nombre: str,
        apellido: str,
        fecha_nacimiento,
        celular: str | None,
        genero: str,
        imagen: str | None,
        iglesia_id: int | None
    ):

        return BaseRepository.execute_query(
            """
            INSERT INTO alumno
            (
                nombre,
                apellido,
                fecha_nacimiento,
                celular,
                genero,
                imagen,
                iglesia_id
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (
                nombre,
                apellido,
                fecha_nacimiento,
                celular,
                genero,
                imagen,
                iglesia_id
            )
        )

    @staticmethod
    def update(
        alumno_id: int,
        nombre: str,
        apellido: str,
        fecha_nacimiento,
        celular: str | None,
        genero: str,
        imagen: str | None,
        iglesia_id: int | None
    ):

        return BaseRepository.execute_update(
            """
            UPDATE alumno
            SET
                nombre = %s,
                apellido = %s,
                fecha_nacimiento = %s,
                celular = %s,
                genero = %s,
                imagen = %s,
                iglesia_id = %s
            WHERE id = %s
            AND activo = TRUE
            """,
            (
                nombre,
                apellido,
                fecha_nacimiento,
                celular,
                genero,
                imagen,
                iglesia_id,
                alumno_id
            )
        )

    @staticmethod
    def deactivate(alumno_id: int):

        return BaseRepository.execute_update(
            """
            UPDATE alumno
            SET activo = FALSE
            WHERE id = %s
            AND activo = TRUE
            """,
            (alumno_id,)
        )