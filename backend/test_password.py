from app.utils.password import hash_password, verify_password

password = "123456"
password_hash = hash_password(password)

print(password_hash)
print(verify_password("123456", password_hash))
print(verify_password("abcdef", password_hash))