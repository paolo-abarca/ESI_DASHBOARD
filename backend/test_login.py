from app.services.auth_service import AuthService

profesor = AuthService.login(
    "paolo@hotmail.com",
    "abcdef"
)

print(profesor)