from django import views
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JerseyViewSet, OrderViewSet
from django.conf import settings
from .views import PredictWinnerAPIView



router = DefaultRouter()
router.register(r'jerseys', JerseyViewSet)
router.register(r'orders', OrderViewSet)  

urlpatterns = [
    path('', include(router.urls)),
    path('predict/', PredictWinnerAPIView.as_view(), name='predict_winner'),


]