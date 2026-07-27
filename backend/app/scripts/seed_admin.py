from app.config.database import get_connection
from app.utils.password import hash_password

connection = get_connection()
cursor = connection.cursor()
password_hash = hash_password("123456")

cursor.execute(
    """
    UPDATE profesor
    SET password_hash = %s
    WHERE email = %s
    """,
    (password_hash, "paolo@hotmail.com")
)

connection.commit()
cursor.close()
connection.close()

print("Administrador actualizado correctamente.")