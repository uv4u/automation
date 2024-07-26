import time
from selenium import webdriver
from selenium.webdriver.common.by import By


def test_login():
    driver = webdriver.Chrome()
    driver.get("https://jiosnap.com/")
    time.sleep(2)

    # Click on Sign In option
    driver.find_element(By.XPATH,
                        '//*[@id="root-layout"]/div[1]/header/div/nav/ul/li[2]/a').click()
    time.sleep(2)

    # Click on mobile number field and type mobile number
    driver.find_element(By.XPATH, '//*[@id="input-container"]/div[2]/input').send_keys("9412535907")
    time.sleep(2)

    # Click on Get OTP button
    driver.find_element(By.CLASS_NAME, "j-JDSButton-container ").click()
    time.sleep(2)

    # Enter OTP

    otp = input("Enter OTP: ")
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

    time.sleep(3)
    driver.quit()
