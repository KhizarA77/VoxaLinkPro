import requests

url = 'http://localhost:5000/transcribe'
data = {
    'fileName': 'Standup_4.mp4',
    'outputFormat': 'pdf'
}

response = requests.post(url, json=data)
print(response.text)

#comment

