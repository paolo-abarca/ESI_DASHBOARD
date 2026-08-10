from flask import Flask

from app.exceptions.not_found import NotFoundError
from app.exceptions.validation import ValidationError

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