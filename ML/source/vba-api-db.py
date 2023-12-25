# voice_authentication/main.py

from fastapi import FastAPI, Depends, HTTPException, Header, Form, UploadFile
from fastapi.responses import JSONResponse
from voice_authentication.newvba import EnhancedSpeakerVerifier
from typing import List

app = FastAPI()
verifier = EnhancedSpeakerVerifier()

# Dummy database (replace with a real database)
fake_api_db = {}

def get_api_key(api_key: str = Header(...)):
    if api_key not in fake_api_db:
        raise HTTPException(status_code=401, detail="Invalid API Key")
    return api_key

# Dummy payment processing function (replace with a real payment gateway)
def process_payment(user_id: str):
    return True

# API endpoint for user registration and payment
@app.post('/register')
async def register(
    username: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
):
    try:
        # Dummy user registration (replace with real user registration logic)
        user_id = username  # In this example, use username as user_id
        fake_api_db[user_id] = {'api_key': None, 'paid': False}

        # Dummy payment processing (replace with real payment processing logic)
        if process_payment(user_id):
            # Generate API key upon successful payment
            api_key = f"{user_id}_api_key"
            fake_api_db[user_id]['api_key'] = api_key
            fake_api_db[user_id]['paid'] = True
            return JSONResponse(content={'message': 'Registration and payment successful'}, status_code=200)

        raise HTTPException(status_code=500, detail="Payment processing failed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error registering user: {str(e)}")

# API endpoint for voice authentication
@app.post('/authenticate')
async def authenticate(api_key: str = Depends(get_api_key), speaker_name: str = Form(...), audio: UploadFile = File(...)):
    try:
        # Validate the API key
        if api_key not in fake_api_db or not fake_api_db[api_key]['paid']:
            raise HTTPException(status_code=401, detail="Invalid API Key or payment not completed")

        # Save the uploaded audio file
        audio_path = "temp.wav"
        with open(audio_path, 'wb') as f:
            f.write(audio.file.read())

        # Verify the speaker
        is_verified = verifier.verify(speaker_name, audio_path)

        # Reset failed attempts (optional)
        verifier.reset_failed_attempts(speaker_name)

        return JSONResponse(content={'is_verified': is_verified}, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error authenticating speaker: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
