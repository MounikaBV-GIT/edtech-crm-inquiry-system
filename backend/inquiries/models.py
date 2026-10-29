from django.db import models

class Admin(models.Model):
    username = models.CharField(max_length=150, unique=True)
    password_hash = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "admins"

class Inquiry(models.Model):
    USER_TYPES = [
        ("Parent", "Parent"),
        ("Student", "Student"),
        ("School", "School"),
    ]
    CATEGORIES = [
        ("Scholarship", "Scholarship"),
        ("Concert", "Concert"),
        ("Admission", "Admission"),
        ("General Query", "General Query"),
    ]
    STATUSES = [
        ("New", "New"),
        ("In Progress", "In Progress"),
        ("Resolved", "Resolved"),
    ]
    user_type = models.CharField(max_length=20, choices=USER_TYPES)
    category = models.CharField(max_length=30, choices=CATEGORIES)
    name = models.CharField(max_length=150)
    email = models.EmailField(max_length=254)
    phone = models.CharField(max_length=30)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUSES, default="New")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "inquiries"
        ordering = ["-created_at"]
