from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash

def hash_password(password: str) -> str:
    """
    Genera el hash seguro de una contraseña.
    """
    return generate_password_hash(password)

def verify_password(password: str, password_hash: str) -> bool:
    """
    Verifica si la contraseña proporcionada coincide con el hash almacenado.
    """
    return check_password_hash(password_hash, password)