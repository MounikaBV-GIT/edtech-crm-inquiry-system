from rest_framework import serializers
from .models import Inquiry

class InquiryCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = ["id", "user_type", "category", "name", "email", "phone", "message", "status", "created_at"]
        read_only_fields = ["id", "status", "created_at"]

    def validate_name(self, value):
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError("Name must contain at least 2 characters.")
        return value

    def validate_phone(self, value):
        value = value.strip()
        digits = "".join(ch for ch in value if ch.isdigit())
        if len(digits) < 7 or len(digits) > 15:
            raise serializers.ValidationError("Enter a valid phone number (7–15 digits).")
        return value

    def validate_message(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Please enter your query.")
        return value

class InquiryAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = ["id", "user_type", "category", "name", "email", "phone", "message", "status", "created_at"]
