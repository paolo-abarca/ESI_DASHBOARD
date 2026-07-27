from app.config.database import get_connection
from app.utils.password import hash_password

EMAIL = "paolo@hotmail.com"
PASSWORD = "123456"

connection = get_connection()
cursor = connection.cursor(dictionary=True)

cursor.execute(
    "SELECT id FROM profesor WHERE email = %s",
    (EMAIL,)
)

admin = cursor.fetchone()
password_hash = hash_password(PASSWORD)

if admin:
    cursor.execute(
        """
        UPDATE profesor
        SET password_hash = %s
        WHERE email = %s
        """,
        (password_hash, EMAIL)
    )

    print("Administrador actualizado.")

else:
    cursor.execute(
        """
        INSERT INTO profesor
        (
            nombre,
            apellido,
            email,
            password_hash
        )
        VALUES
        (
            %s,
            %s,
            %s,
            %s
        )
        """,
        (
            "Paolo",
            "Administrador",
            EMAIL,
            password_hash
        )
    )

    print("Administrador creado.")

connection.commit()

cursor.close()
connection.close()