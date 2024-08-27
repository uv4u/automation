
from django.contrib import admin
from django.urls import path
from django.contrib import admin
from django.urls import path

from django.urls import path
from myapp.views import (   save_code, run_script,
                            get_script_list, delete_script, 
                            save_suite,
                            get_suite_list,run_suite,
                            delete_suite,
                            get_history,clear_history,
                            get_file_content, save_file_content)


urlpatterns = [
    path('api/savecode/',save_code, name='save_code'),
    path('api/run-script/',run_script, name='run_script'),
    path('api/get-script-list/',get_script_list, name='script_list'),
    path('api/delete-script/', delete_script, name='delete_script'),
    path('api/save-suite/', save_suite, name='save_suite'),
    path('api/get-suites/', get_suite_list, name='suite_list'),
    path('api/run-suite/', run_suite, name='run-suite'),
    path('api/delete-suite/', delete_suite, name='delete_suite'),
    path('api/get-history/', get_history, name='get_history'),
    path('api/clear-history/', clear_history, name='clear_history'),
    path('api/get-file-content/', get_file_content, name='get_file_content'),
    path('api/save-file-content/', save_file_content, name='save_file_content'),
]

