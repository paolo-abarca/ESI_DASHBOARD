from flask_jwt_extended import get_jwt_identity

def get_current_profesor_id():
    identity = get_jwt_identity()

    if identity is None:
        return None

    return int(identity)

def is_current_profesor(profesor_id):
    current_profesor_id = get_current_profesor_id()

    return current_profesor_id == int(profesor_id)