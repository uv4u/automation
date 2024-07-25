
from django.contrib import admin
from django.urls import path
from django.contrib import admin
from django.urls import path, include
from myapp import views
# urls.py

from django.urls import path
from myapp.views import save_code, run_script, get_script_list, delete_script

urlpatterns = [
    path('api/savecode/',save_code, name='save_code'),
    path('api/run-script/',run_script, name='run_script'),
    path('api/get-script-list/',get_script_list, name='script_list'),
    path('api/delete-script/', delete_script, name='delete_script'),
]


# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('api/recorded-actions/', views.recorded_actions, name='recorded_actions'),
#     path('api/generate-script/', views.generate_script_endpoint, name='generate_script_endpoint'),
# ]
