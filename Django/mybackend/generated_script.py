from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from elements_manager import get_xpath


service = Service(ChromeDriverManager().install())
options = webdriver.ChromeOptions()
driver = webdriver.Chrome(service=service, options=options)
# to click on the element(Phone number+91) found
driver.find_element(By.XPATH,get_xpath(driver,'mMzZyua3KebmTv_')).click()

# to type content in input field
driver.find_element(By.XPATH,get_xpath(driver,'DAsYukPaOyS0Nu9')).send_keys('9412535907')

# to click on the element(Loading...) found
driver.find_element(By.XPATH,get_xpath(driver,'MkIZd8bggXQvujd')).click()

# to click on input field
driver.find_element(By.XPATH,get_xpath(driver,'KNzddyXPEjN_KYu')).click()

# to type content in input field
driver.find_element(By.XPATH,get_xpath(driver,'jtr4O9P_ORcF07F')).send_keys('850492')

# to click on the element(Loading...) found
driver.find_element(By.XPATH,get_xpath(driver,'p_XT4WVbzOmbABB')).click()

# to fetch the text of element
text=driver.find_element(By.XPATH,get_xpath(driver,'J7HVdlBYZYnAWHN')).text

print(text)