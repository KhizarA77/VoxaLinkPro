import requests

url = 'http://localhost:5000/transcribe'
data = {
    'fileName': 'AUD-20231207-WA0003.m4a',
    'outputFormat': 'pdf'
}

response = requests.post(url, json=data)
print(response.text)

#comment

