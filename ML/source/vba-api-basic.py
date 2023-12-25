from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from newvba import EnhancedSpeakerVerifier
import uvicorn


app = FastAPI()

# Initialize the verifier
verifier = EnhancedSpeakerVerifier()

# API endpoint for voice registration
@app.post('/register')
async def register(speaker_name: str = Form(...), audio: UploadFile = File(...)):
    try:
        # Save the uploaded audio file
        audio_path = f"registered_audio/{speaker_name}.wav"
        with open(audio_path, 'wb') as f:
            f.write(audio.file.read())

        # Add the speaker to the database
        verifier.add_speaker(speaker_name, audio_path)

        return JSONResponse(content={'message': 'Speaker registered successfully'}, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error registering speaker: {str(e)}")

# API endpoint for voice authentication
@app.post('/authenticate')
async def authenticate(speaker_name: str = Form(...), audio: UploadFile = File(...)):
    try:
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
    
    uvicorn.run(app, host="127.0.0.1", port=8000)
