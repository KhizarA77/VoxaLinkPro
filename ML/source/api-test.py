import requests

url = 'http://localhost:5000/transcribe'
data = {
    'fileName': '1fe6d480-c9f7-471f-8bb2-888788bf1e46.mp3',
    'outputFormat': 'txt'
}

response = requests.post(url, json=data)
print(response.text)

#comment

