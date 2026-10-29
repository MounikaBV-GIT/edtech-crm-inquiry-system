from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True
    dependencies = []
    operations = [
        migrations.CreateModel(
            name="Admin",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("username", models.CharField(max_length=150, unique=True)),
                ("password_hash", models.CharField(max_length=255)),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={"db_table": "admins"},
        ),
        migrations.CreateModel(
            name="Inquiry",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("user_type", models.CharField(choices=[("Parent", "Parent"), ("Student", "Student"), ("School", "School")], max_length=20)),
                ("category", models.CharField(choices=[("Scholarship", "Scholarship"), ("Concert", "Concert"), ("Admission", "Admission"), ("General Query", "General Query")], max_length=30)),
                ("name", models.CharField(max_length=150)),
                ("email", models.EmailField(max_length=254)),
                ("phone", models.CharField(max_length=30)),
                ("message", models.TextField()),
                ("status", models.CharField(choices=[("New", "New"), ("In Progress", "In Progress"), ("Resolved", "Resolved")], default="New", max_length=20)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={"db_table": "inquiries", "ordering": ["-created_at"]},
        ),
    ]
