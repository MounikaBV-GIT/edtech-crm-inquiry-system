import getpass
import bcrypt
from django.core.management.base import BaseCommand, CommandError
from inquiries.models import Admin

class Command(BaseCommand):
    help = "Create or update an admin login using a bcrypt password hash."

    def handle(self, *args, **options):
        username = input("Admin username: ").strip()
        if not username:
            raise CommandError("Username cannot be empty.")
        password = getpass.getpass("Admin password (minimum 10 characters): ")
        confirm = getpass.getpass("Confirm password: ")
        if len(password) < 10:
            raise CommandError("Use a password with at least 10 characters.")
        if password != confirm:
            raise CommandError("Passwords do not match.")
        hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        admin, created = Admin.objects.update_or_create(
            username=username,
            defaults={"password_hash": hashed, "is_active": True},
        )
        self.stdout.write(self.style.SUCCESS(
            f"Admin {'created' if created else 'updated'} successfully: {admin.username}"
        ))
