from django.shortcuts import render
import json

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import os
from django.conf import settings
import subprocess

saved_codes_folder = os.path.join(settings.BASE_DIR, 'saved_codes')
scripts_list_file = os.path.join(saved_codes_folder, 'script_list.py')

os.makedirs(saved_codes_folder, exist_ok=True)

def json_to_py(json_data):      #converting json back to python scripts
    try:
        data = json.loads(json_data)
        lines = data.get('content', [])
        py_script = '\n'.join(lines)
        return py_script
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        return None

@api_view(['POST'])                #saving code from front end to saved_codes
def save_code(request):
    if request.method == 'POST':
        name = request.data.get('name')
        code = request.data.get('code')
        print(code)
        if not name:
            return JsonResponse({'error': 'Name is required'}, status=400)
        if not code:
            return JsonResponse({'error': 'Code is required'}, status=400)
        file_name = f"{name}.py"
        file_path = os.path.join(saved_codes_folder, file_name)

        # Ensure the directory exists
        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        with open(file_path, 'w') as file:
            file.write(code)

        # Append the script name to scripts_list.py
        try:
            scripts = []
            if os.path.exists(scripts_list_file):
                with open(scripts_list_file, 'r') as file:
                    exec(file.read(), globals())
                    scripts = globals().get('scripts', [])

            if name not in scripts:
                scripts.append(name)
                with open(scripts_list_file, 'w') as file:
                    file.write(f"scripts = {scripts}")

            return JsonResponse({'message': f'Code saved as {file_name}', 'scripts': scripts})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    

@api_view(['POST'])             #running scripts from saved_codes
def run_script(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            script_name = data.get('script_name')

            if not script_name:
                return JsonResponse({'status': 'error', 'message': 'No script name provided'}, status=400)

            script_path = os.path.join(saved_codes_folder, script_name)

            if not os.path.exists(script_path):
                return JsonResponse({'status': 'error', 'message': 'Script not found'}, status=404)

            result = subprocess.run(['pytest', script_path], capture_output=True, text=True)

            return JsonResponse({
                'status': 'success',
                'stdout': result.stdout,
                'stderr': result.stderr,
                'returncode': result.returncode
            })
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Invalid method'}, status=405)


@api_view(['GET'])              #sending scripts name to frontend
def get_script_list(request):
    if request.method == 'GET':
        try:
            scripts = []
            if os.path.exists(scripts_list_file):
                with open(scripts_list_file, 'r') as file:
                    exec(file.read(), globals())
                    scripts = globals().get('scripts', [])

            return JsonResponse({'status': 'success', 'scripts': scripts})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Invalid method'}, status=405)

@api_view(['POST'])
def delete_script(request):
    if request.method == 'POST':
        try:
            name = request.data.get('name')
            if not name:
                return JsonResponse({'error': 'Name is required'}, status=400)

            file_name = f"{name}.py"
            file_path = os.path.join(saved_codes_folder, file_name)

            # Delete the script file
            if os.path.exists(file_path):
                os.remove(file_path)
            else:
                return JsonResponse({'error': 'Script file not found'}, status=404)

            # Update the scripts_list.py file
            scripts = []
            if os.path.exists(scripts_list_file):
                with open(scripts_list_file, 'r') as file:
                    exec(file.read(), globals())
                    scripts = globals().get('scripts', [])

            if name in scripts:
                scripts.remove(name)
                with open(scripts_list_file, 'w') as file:
                    file.write(f"scripts = {scripts}\n")

            return JsonResponse({'message': f'Script {file_name} deleted', 'scripts': scripts})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=405)