import cloudinary.uploader

class CloudinaryService:

    @staticmethod
    def upload_profesor_photo(file):
        return cloudinary.uploader.upload(
            file,
            folder="esi_dashboard/profesores",
            resource_type="image",
            allowed_formats=["jpg", "jpeg", "png", "webp"]
        )

    @staticmethod
    def delete_photo(public_id):
        if public_id:
            return cloudinary.uploader.destroy(
                public_id,
                invalidate=True,
                resource_type="image"
            )