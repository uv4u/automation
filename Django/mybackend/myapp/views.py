from django.shortcuts import render
import json

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import os
import ast
from django.conf import settings
import subprocess
from rest_framework import status
from datetime import datetime

saved_codes_folder = os.path.join(settings.BASE_DIR, 'saved_codes')
scripts_list_file = os.path.join(saved_codes_folder, 'script_list.py')
suites_list_file = os.path.join(saved_codes_folder, 'suites.py')
history_path = os.path.join(saved_codes_folder, 'history.py')

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
    
def save_run_history(run_type, name, results):
    # Define the directory and file path for history
    
    
    # Load existing history or create a new one
    if os.path.exists(history_path):
        with open(history_path, 'r') as f:
            try:
                history = ast.literal_eval(f.read().strip().replace('history=', ''))
            except Exception:
                history = []
    else:
        history = []

    # Create a history entry
    history_entry = {
        'run_type': run_type,  # 'script' or 'suite'
        'ename': name,          # script_name or suite_name
        'results': results,    # result details
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')  # Current date and time
    }

    # Append the new entry to the history
    history.append(history_entry)

    # Write the updated history back to the file
    with open(history_path, 'w') as f:
        f.write(f"history={history}")

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

            result = subprocess.run(['cmd.exe', '/c','pytest', script_path, "-s"], capture_output=True, text=True)

            run_results = {
                'stdout': result.stdout,
                'stderr': result.stderr,
                'returncode': result.returncode
            }

            run_results = ""
            if result.returncode==0:
                run_results="Pass"
            else:
                run_results="Fail"

            # Save history
            save_run_history('script', script_name, run_results)

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


@api_view(['POST'])
def save_suite(request):
    if request.method == 'POST':
        suite_name = request.data.get('suite_name')
        test_cases = request.data.get('test_cases')
        # results = request.data.get('results')  # Optional results data
        results = {}

        if not suite_name or not isinstance(test_cases, list) or not isinstance(results, dict):
            return Response(
                {"error": "Invalid data. 'suite_name' should be a string, 'test_cases' should be an array of strings, and 'results' should be a dictionary."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Define the directory and file path
        directory = os.path.join('saved_codes')
        if not os.path.exists(directory):
            os.makedirs(directory)

        file_path = os.path.join(directory, 'suites.py')

        # Initialize or update the dictionary
        if os.path.exists(file_path):
            with open(file_path, 'r') as f:
                try:
                    suites = ast.literal_eval(f.read().strip().replace('suites=', ''))
                except Exception:
                    suites = {}
        else:
            suites = {}

        # Add or update the suite in the dictionary
        if suite_name in suites:
            suites[suite_name]['test_cases'].extend(test_cases)  # Append test cases if suite already exists
            suites[suite_name]['results'].update(results)  # Update results if provided
        else:
            suites[suite_name] = {
                'test_cases': test_cases,
                'results': results
            }

        # Write the updated dictionary back to the file in the required format
        with open(file_path, 'w') as f:
            f.write(f"suites={suites}")

        return Response({"message": "Suite saved successfully"}, status=status.HTTP_201_CREATED)
    
    

@api_view(['GET'])              #sending scripts name to frontend
def get_suite_list(request):
    if request.method == 'GET':
        try:
            suites = {}
            if os.path.exists(suites_list_file):
                with open(suites_list_file, 'r') as file:
                    exec(file.read(), globals())
                    suites = globals().get('suites', {})

            return JsonResponse({'status': 'success', 'suites': suites})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Invalid method'}, status=405)


@api_view(['POST'])
def run_suite(request):
    if request.method == 'POST':
        suite_name = request.data.get('suite_name')
        test_cases = request.data.get('test_cases')['test_cases']
        # print(suite_name)
        print(test_cases)

        if not suite_name or not isinstance(test_cases, list):
            return Response(
                {"error": "Invalid data. 'suite_name' should be a string and 'test_cases' should be an array of strings."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Define the directory and file path
        # saved_codes_folder = 'saved_suites'
        if not os.path.exists(saved_codes_folder):
            os.makedirs(saved_codes_folder)

        file_path = os.path.join(saved_codes_folder, 'suites.py')

        # Load the existing suites dictionary
        if os.path.exists(file_path):
            with open(file_path, 'r') as f:
                try:
                    suites = ast.literal_eval(f.read().strip().replace('suites=', ''))
                except Exception:
                    suites = {}
        else:
            suites = {}

        # Run the test cases and collect results
        results = {}
        for test_case in test_cases:
            script_name = f"{test_case}.py"
            script_path = os.path.join(saved_codes_folder, script_name)
            result = subprocess.run(['pytest', script_path, "-s"], capture_output=True, text=True)
            results[test_case] = "Pass" if result.returncode == 0 else "Fail"

        # Store the results in the suites dictionary
        if suite_name in suites:
            suites[suite_name]['test_cases'] = test_cases
            suites[suite_name]['results'].update(results)
        else:
            suites[suite_name] = {
                'test_cases': test_cases,
                'results': results
            }

        # Write the updated dictionary back to the file
        with open(file_path, 'w') as f:
            f.write(f"suites={suites}")

        save_run_history('suite', suite_name, results)

        # Return the results in the response
        return JsonResponse({
            'status': 'success',
            'suite_name': suite_name,
            'test_cases': test_cases,
            'results': results
        }, status=status.HTTP_201_CREATED)
    
@api_view(['POST'])
def delete_suite(request):
    if request.method == 'POST':
        suite_name = request.data.get('suite_name')
        if not suite_name:
            return JsonResponse({'error': 'Name is required'}, status=400)
        suites = {}
        if os.path.exists(suites_list_file):
                with open(suites_list_file, 'r') as file:
                    exec(file.read(), globals())
                    suites = globals().get('suites', [])

        if suite_name in suites:
            suites.pop(suite_name)
            with open(suites_list_file, 'w') as file:
                    file.write(f"suites = {suites}\n")
        
        return JsonResponse({'message': 'Suite deleted',})
    

@api_view(['GET'])             
def get_history(request):
    if request.method == 'GET':
        try:
            history = {}
            if os.path.exists(history_path):
                with open(history_path, 'r') as file:
                    exec(file.read(), globals())
                    history = globals().get('history', {})

            return JsonResponse({'status': 'success', 'history': history})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Invalid method'}, status=405)

@api_view(['GET'])              #sending scripts name to frontend
def clear_history(request):
    if request.method == 'GET':
        try:
            history = {}
            if os.path.exists(history_path):
                with open(history_path, 'r') as file:
                    exec(file.read(), globals())
                    history = globals().get('history', {})
                    
            with open(history_path, 'w') as f:
                f.write(f"history=[]")
            

            return JsonResponse({'status': 'success', 'history': history})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Invalid method'}, status=405)
    

