from django.urls import path
from . import views

urlpatterns = [
    path("health/", views.health, name="health"),
    path("inquiries/", views.create_inquiry, name="create-inquiry"),
    path("auth/login/", views.admin_login, name="admin-login"),
    path("admin/inquiries/", views.list_inquiries, name="list-inquiries"),
    path("admin/inquiries/<int:inquiry_id>/", views.update_inquiry, name="update-inquiry"),
]
