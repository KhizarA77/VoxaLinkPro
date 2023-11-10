from flask import Flask, request, jsonify
import werkzeug
import os
from transcription import process_audio_file  # Adjusted import statement

app = Flask(__name__)
@app.route('/transcribe', methods=['POST'])
def transcribe():
    # Check if a file is part of the POST request
    if 'audio_file' not in request.files:
        return "No file part", 400
    
    file = request.files['audio_file']
    if file.filename == '':
        return "No selected file", 400

    if file and allowed_file(file.filename):
        # Secure the file name
        filename = werkzeug.utils.secure_filename(file.filename)
        
        # Save file to a temporary storage
        filepath = os.path.join('/tmp', filename)
        file.save(filepath)
        
        # Process the file
        try:
            output_format = request.args.get('format', default='txt', type=str)
            output_file = process_audio_file(filepath, output_format)
            # You can then send back the file or the path to the file
            return jsonify({
                'transcription': output_file
            })
        finally:
            # Make sure to remove the temporary file after processing
            os.remove(filepath)

    return "Error processing file", 500

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'.mp3', '.aac', '.wav', '.flac', '.m4a', '.ogg', '.opus', '.wma', '.mp4', '.mov', '.mkv', '.avi', '.wmv', '.flv', '.webm', '.m4v', '.mpg', '.mpeg', '.3gp'}

if __name__ == '__main__':
    app.run(debug=True)
