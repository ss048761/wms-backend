# D:\WMS\backend\urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView

# Remove the direct import of TokenObtainPairView from simplejwt.views
from rest_framework_simplejwt.views import (
    # TokenObtainPairView, # We are using our custom one from wms.views
    TokenRefreshView,
    TokenVerifyView,
)
# Import your custom view from the wms app


urlpatterns = [
    path('api/v1/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('admin/', admin.site.urls),

    # JWT Token Endpoints
    # Use your custom view for obtaining tokens
    path('api/v1/auth/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/v1/auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'), # Optional

    # WMS App specific API endpoints
    path('api/v1/wms/', include('wms.urls')),
]