import jwt
from datetime import datetime, timedelta, timezone
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

class AdminPrincipal:
    is_authenticated = True
    is_anonymous = False

    def __init__(self, admin_id, username):
        self.id = admin_id
        self.username = username

class JWTAdminAuthentication(BaseAuthentication):
    def authenticate(self, request):
        header = request.headers.get("Authorization", "")
        if not header:
            return None
        parts = header.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            raise AuthenticationFailed("Use Authorization: Bearer <token>.")
        try:
            payload = jwt.decode(header.split()[1], settings.JWT_SECRET, algorithms=["HS256"])
            if payload.get("type") != "admin":
                raise AuthenticationFailed("Invalid token type.")
            return (AdminPrincipal(payload["sub"], payload["username"]), None)
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Session expired. Please log in again.")
        except (jwt.InvalidTokenError, KeyError, TypeError):
            raise AuthenticationFailed("Invalid authentication token.")

def create_admin_token(admin):
    now = datetime.now(timezone.utc)
    expiry = now + timedelta(hours=settings.JWT_EXPIRY_HOURS)
    return jwt.encode(
        {"sub": str(admin.id), "username": admin.username, "type": "admin", "iat": now, "exp": expiry},
        settings.JWT_SECRET,
        algorithm="HS256",
    )
