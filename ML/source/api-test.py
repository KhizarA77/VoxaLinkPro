import requests
import concurrent.futures

# The base URL of your FastAPI server
url = 'http://localhost:5000/transcribe'

# # Data for three different files
# files = ['4.mp3', '5.mp3', '6.mp3']
# Data for three different files
files = ['test.mp3']

def send_transcribe_request(file_name):
    data = {
        'fileName': file_name,
        'outputFormat': 'pdf'
    }
    response = requests.post(url, json=data)
    return f"Response for {file_name}: {response.text}"

# Use ThreadPoolExecutor to send requests in parallel
with concurrent.futures.ThreadPoolExecutor() as executor:
    futures = [executor.submit(send_transcribe_request, file_name) for file_name in files]
    for future in concurrent.futures.as_completed(futures):
        print(future.result())
