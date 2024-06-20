import time
from flask import Flask, request, jsonify
from selenium import webdriver
from selenium.webdriver.common.by import By
from flask_cors import CORS, cross_origin

options = webdriver.ChromeOptions()
options.add_argument('--ignore-certificate-errors')
options.add_argument('--ignore-ssl-errors')

driver = webdriver.Chrome(options=options)

app = Flask(__name__)
cors = CORS(app)

# Initialize the Chrome driver
driver = webdriver.Chrome()

@app.route('/login', methods=['POST'])
def login():
    # Get the mobile number from the request
    mobile_number = request.json['mobile_number']
    print(mobile_number)

    # Navigate to the login page
    driver.get("http://34.93.189.73/")
    time.sleep(2)

    # Click on Sign In option
    driver.find_element(By.XPATH, '//*[@id="root-layout"]/div/header/div/nav/ul/li[2]/a').click()
    time.sleep(2)

    # Enter mobile number
    driver.find_element(By.XPATH, '/html/body/div[1]/div/div[1]/section/div/div[2]/div/form/div/div/div[1]/div/div[2]/input').send_keys(mobile_number)
    time.sleep(2)

    # Click on Get OTP button
    driver.find_element(By.CLASS_NAME, "j-JDSButton-container ").click()
    time.sleep(2)

    # Return a response to the user to enter the OTP
    return jsonify({'message': 'Enter the OTP sent to your mobile number'})

@app.route('/verify_otp', methods=['POST'])
def verify_otp():
    # Get the OTP from the request
    otp = request.json['otp']

    # Enter the OTP
    driver.find_element(By.XPATH, '//*[@id="input-container"]/div[1]/input').send_keys(otp[0])
    driver.find_element(By.XPATH, '//*[@id="input-container1"]/div[1]/input').send_keys(otp[1])
    driver.find_element(By.XPATH, '//*[@id="input-container2"]/div[1]/input').send_keys(otp[2])
    driver.find_element(By.XPATH, '//*[@id="input-container3"]/div[1]/input').send_keys(otp[3])
    driver.find_element(By.XPATH, '//*[@id="input-container4"]/div[1]/input').send_keys(otp[4])
    driver.find_element(By.XPATH, '//*[@id="input-container5"]/div[1]/input').send_keys(otp[5])

    time.sleep(2)

    # Click on Verify button
    driver.find_element(By.XPATH, '/html/body/div[1]/div/div[1]/section/div/div[2]/div/form/div/div[4]/button/div/div/div').click()
    time.sleep(8)

    # Check if the user is logged in successfully
    current_url = driver.current_url
    expected_url = "http://34.93.189.73/home"
    if current_url == expected_url:
        return jsonify({'message': 'Test case passed'})
    
    return jsonify({'message': 'Test case failed'})

if __name__ == '__main__':
    app.run(debug=True)