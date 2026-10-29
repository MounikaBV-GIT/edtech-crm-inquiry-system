import bcrypt
from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .authentication import JWTAdminAuthentication, create_admin_token
from .models import Admin, Inquiry
from .serializers import InquiryAdminSerializer, InquiryCreateSerializer

@api_view(["GET"])
@permission_classes([AllowAny])
def health(request):
    return Response({"status": "ok", "service": "EdTech CRM API"})

@api_view(["POST"])
@permission_classes([AllowAny])
def create_inquiry(request):
    serializer = InquiryCreateSerializer(data=request.data)
    if serializer.is_valid():
        inquiry = serializer.save()
        return Response(
            {"message": "Inquiry submitted successfully.", "inquiry": InquiryAdminSerializer(inquiry).data},
            status=status.HTTP_201_CREATED,
        )
    return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([AllowAny])
def admin_login(request):
    username = str(request.data.get("username", "")).strip()
    password = request.data.get("password", "")
    if not username or not isinstance(password, str) or not password:
        return Response({"message": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)
    admin = Admin.objects.filter(username=username, is_active=True).first()
    if not admin or not bcrypt.checkpw(password.encode("utf-8"), admin.password_hash.encode("utf-8")):
        return Response({"message": "Invalid username or password."}, status=status.HTTP_401_UNAUTHORIZED)
    return Response({"token": create_admin_token(admin), "username": admin.username, "expires_in_hours": 8})

@api_view(["GET"])
@authentication_classes([JWTAdminAuthentication])
@permission_classes([IsAuthenticated])
def list_inquiries(request):
    queryset = Inquiry.objects.all()
    category = request.query_params.get("category", "").strip()
    user_type = request.query_params.get("user_type", "").strip()
    search = request.query_params.get("search", "").strip()
    if category:
        queryset = queryset.filter(category=category)
    if user_type:
        queryset = queryset.filter(user_type=user_type)
    if search:
        queryset = queryset.filter(Q(name__icontains=search) | Q(phone__icontains=search))
    return Response(InquiryAdminSerializer(queryset, many=True).data)

@api_view(["PATCH"])
@authentication_classes([JWTAdminAuthentication])
@permission_classes([IsAuthenticated])
def update_inquiry(request, inquiry_id):
    inquiry = Inquiry.objects.filter(id=inquiry_id).first()
    if not inquiry:
        return Response({"message": "Inquiry not found."}, status=status.HTTP_404_NOT_FOUND)
    new_status = request.data.get("status")
    allowed = [value for value, _ in Inquiry.STATUSES]
    if new_status not in allowed:
        return Response({"message": f"Status must be one of: {', '.join(allowed)}."}, status=status.HTTP_400_BAD_REQUEST)
    inquiry.status = new_status
    inquiry.save(update_fields=["status"])
    return Response({"message": "Status updated.", "inquiry": InquiryAdminSerializer(inquiry).data})
