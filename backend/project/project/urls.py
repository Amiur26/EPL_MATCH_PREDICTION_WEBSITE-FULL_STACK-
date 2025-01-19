
from django.contrib import admin
from django.urls import path,include
from app import urls
from django.conf import settings
from django.conf.urls.static import static

from app.views import *

#for images
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('user-profile/',UserProfileView.as_view(),name='user-profile'),
    path('app/', include('app.urls')), 
  
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)