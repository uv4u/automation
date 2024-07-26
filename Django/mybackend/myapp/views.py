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
from django.views.decorators.csrf import ensure_csrf_cookie

saved_codes_folder = os.path.join(settings.BASE_DIR, 'saved_codes')
scripts_list_file = os.path.join(saved_codes_folder, 'script_list.py')
session_file = os.path.join(saved_codes_folder, 'session.pkl')

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

            result = subprocess.run(['pytest', script_path, '-s'], capture_output=True, text=True)

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

# @csrf_exempt
# def start_login(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
#             mobile_number = data.get('mobile_number')

#             if not mobile_number:
#                 return JsonResponse({'status': 'error', 'message': 'No mobile number provided'}, status=400)
            
#             file_path = os.path.join(saved_codes_folder, "NewLogin.py")
#             print(file_path)

#             result = subprocess.run(['pytest', file_path, 'start', mobile_number], capture_output=True, text=True)

#             return JsonResponse({
#                 'status': 'success',
#                 'stdout': result.stdout,
#                 'stderr': result.stderr,
#                 'returncode': result.returncode
#             })
#         except json.JSONDecodeError:
#             return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
#         except Exception as e:
#             return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
#     return JsonResponse({'status': 'error', 'message': 'Invalid method'}, status=405)

# @csrf_exempt
# def complete_login(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
#             otp = data.get('otp')

#             if not otp:
#                 return JsonResponse({'status': 'error', 'message': 'No OTP provided'}, status=400)

#             result = subprocess.run(['pytest', 'NewLogin.py', 'complete', otp], capture_output=True, text=True)

#             return JsonResponse({
#                 'status': 'success',
#                 'stdout': result.stdout,
#                 'stderr': result.stderr,
#                 'returncode': result.returncode
#             })
#         except json.JSONDecodeError:
#             return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
#         except Exception as e:
#             return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
#     return JsonResponse({'status': 'error', 'message': 'Invalid method'}, status=405)

# @api_view(['POST'])
# def enter_mobile_number(request):
#     if request.method == 'POST':
#         data = json.loads(request.body)
#         mobile_number = data.get('mobile_number')




#         if not mobile_number:
#             return JsonResponse({'error': 'Mobile number is required'}, status=400)
        
#         script_path = os.path.join(saved_codes_folder, "Login.py")

#         try:
#             print("here")
#             result = subprocess.run(['python', script_path, mobile_number], capture_output=True, text=True)
#             if result.returncode == 0:
#                 return JsonResponse({'message': 'Mobile number entered successfully', 'output': result.stdout})
#             else:
#                 return JsonResponse({'error': 'Failed to enter mobile number', 'output': result.stderr}, status=500)
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)

#     return JsonResponse({'error': 'Invalid request method'}, status=400)

# @api_view(['POST'])
# def enter_otp_and_verify(request):
#     if request.method == 'POST':
#         data = json.loads(request.body)
#         otp = data.get('otp')

#         if not otp:
#             return JsonResponse({'error': 'OTP is required'}, status=400)
        
#         script_path = os.path.join(saved_codes_folder, "Login.py")

#         try:
#             result = subprocess.run(['python', script_path, otp], capture_output=True, text=True)
#             if result.returncode == 0:
#                 return JsonResponse({'message': 'OTP entered and verified successfully', 'output': result.stdout})
#             else:
#                 return JsonResponse({'error': 'Failed to enter OTP and verify', 'output': result.stderr}, status=500)
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)

#     return JsonResponse({'error': 'Invalid request method'}, status=400)



# def login():
#     # Get the mobile number from the request
#     mobile_number = request.json['mobile_number']
#     print(mobile_number)

#     # Navigate to the login page
#     driver.get("http://34.93.189.73/")
#     time.sleep(2)

#     # Click on Sign In option
#     driver.find_element(By.XPATH, '//*[@id="root-layout"]/div/header/div/nav/ul/li[2]/a').click()
#     time.sleep(2)

#     # Enter mobile number
#     driver.find_element(By.XPATH, '/html/body/div[1]/div/div[1]/section/div/div[2]/div/form/div/div/div[1]/div/div[2]/input').send_keys(mobile_number)
#     time.sleep(2)

#     # Click on Get OTP button
#     driver.find_element(By.CLASS_NAME, "j-JDSButton-container ").click()
#     time.sleep(2)

#     # Return a response to the user to enter the OTP
#     return jsonify({'message': 'Enter the OTP sent to your mobile number'})