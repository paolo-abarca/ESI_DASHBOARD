from flask import Blueprint
from flask_jwt_extended import jwt_required
from app.services.iglesia_service import IglesiaService
from flask import Blueprint, request

iglesia_bp = Blueprint("iglesias", __name__)

@iglesia_bp.get("/iglesias")
@jwt_required()
def get_all():

    iglesias = IglesiaService.get_all()

    return {
        "success": True,
        "data": iglesias
    }

@iglesia_bp.get("/iglesias/<int:iglesia_id>")
@jwt_required()
def get_by_id(iglesia_id):

    iglesia = IglesiaService.get_by_id(iglesia_id)

    return {
        "success": True,
        "data": iglesia
    }

@iglesia_bp.post("/iglesias")
@jwt_required()
def create():

    data = request.get_json() or {}

    iglesia = IglesiaService.create(
        nombre=data.get("nombre", ""),
        direccion=data.get("direccion"),
        contacto=data.get("contacto"),
        telefono=data.get("telefono")
    )

    return {
        "success": True,
        "message": "Iglesia creada correctamente.",
        "data": iglesia
    }, 201

@iglesia_bp.put("/iglesias/<int:iglesia_id>")
@jwt_required()
def update(iglesia_id):

    data = request.get_json() or {}

    iglesia = IglesiaService.update(
        iglesia_id=iglesia_id,
        nombre=data.get("nombre", ""),
        direccion=data.get("direccion"),
        contacto=data.get("contacto"),
        telefono=data.get("telefono")
    )

    return {
        "success": True,
        "message": "Iglesia actualizada correctamente.",
        "data": iglesia
    }

@iglesia_bp.patch("/iglesias/<int:iglesia_id>/desactivar")
@jwt_required()
def deactivate(iglesia_id):

    IglesiaService.deactivate(iglesia_id)

    return {
        "success": True,
        "message": "Iglesia desactivada correctamente."
    }