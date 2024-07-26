import time
import pickle
from selenium import webdriver
from selenium.webdriver.common.by import By
import os

def start_login(mobile_number, session_file='session.pkl'):
    driver = webdriver.Chrome()
    driver.get("https://jiosnap.com/")
    time.sleep(2)

    # Click on Sign In option
    driver.find_element(By.XPATH, '//*[@id="root-layout"]/div[1]/header/div/nav/ul/li[2]/a').click()
    time.sleep(2)

    # Enter mobile number
    driver.find_element(By.XPATH, '//*[@id="input-container"]/div[2]/input').send_keys(mobile_number)
    time.sleep(2)

    # Click on Get OTP button
    driver.find_element(By.CLASS_NAME, "j-JDSButton-container ").click()
    time.sleep(2)

    # Save the browser session
    with open(session_file, 'wb') as f:
        pickle.dump(driver.get_cookies(), f)

    driver.quit()

def complete_login(otp, session_file='session.pkl'):
    driver = webdriver.Chrome()
    driver.get("https://jiosnap.com/")
    time.sleep(2)

    # Load the saved session
    with open(session_file, 'rb') as f:
        cookies = pickle.load(f)
        for cookie in cookies:
            driver.add_cookie(cookie)

    driver.refresh()
    time.sleep(2)

    # Enter OTP
    driver.find_element(By.XPATH, '//*[@id="input-container"]/div[1]/input').send_keys(otp[0])
    driver.find_element(By.XPATH, '//*[@id="input-container1"]/div[1]/input').send_keys(otp[1])
    driver.find_element(By.XPATH, '//*[@id="input-container2"]/div[1]/input').send_keys(otp[2])
    driver.find_element(By.XPATH, '//*[@id="input-container3"]/div[1]/input').send_keys(otp[3])
    driver.find_element(By.XPATH, '//*[@id="input-container4"]/div[1]/input').send_keys(otp[4])
    driver.find_element(By.XPATH, '//*[@id="input-container5"]/div[1]/input').send_keys(otp[5])

    time.sleep(3)

    # Click on Verify button
    driver.find_element(By.XPATH, '/html/body/div[1]/div/div[1]/section/div/div[2]/div/div/div/div[4]/button').click()
    time.sleep(8)

    def getCurrentURL():
        return "https://jiosnap.com/home"

    url = getCurrentURL()
    if driver.current_url == url:
        print("User navigated to Home page and logged in successfully.")
    else:
        print("Not logged in")

    assert driver.current_url == url, "Login unsuccessful"

    driver.quit()

if __name__ == "__main__":
    import sys
    action = sys.argv[1]
    if action == "start":
        mobile_number = sys.argv[2]
        start_login(mobile_number)
    elif action == "complete":
        otp = sys.argv[2]
        complete_login(otp)