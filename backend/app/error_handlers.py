from flask import Flask

from app.exceptions.not_found import NotFoundError
from app.exceptions.validation import ValidationError
from app.exceptions.forbidden import ForbiddenError

def register_error_handlers(app: Flask):

    @app.errorhandler(NotFoundError)
    def handle_not_found_error(error):
        return {
            "success": False,
            "message": str(error)
        }, 404

    @app.errorhandler(ValidationError)
    def handle_validation_error(error):
        return {
            "success": False,
            "message": str(error)
        }, 400

    @app.errorhandler(ForbiddenError)
    def handle_forbidden_error(error):
        return {
            "success": False,
            "message": str(error)
        }, 403