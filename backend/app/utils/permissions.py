from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity

def own_profesor_required(function):

    @wraps(function)
    def wrapper(profesor_id, *args, **kwargs):
        current_profesor_id = int(get_jwt_identity())

        if current_profesor_id != int(profesor_id):
            return jsonify({
                "success": False,
                "error": "No tienes permiso para modificar este profesor."
            }), 403

        return function(profesor_id, *args, **kwargs)

    return wrapper