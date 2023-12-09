from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
import transcription
from flask_cors import CORS

# Load environment variable from .env file
load_dotenv()

app = Flask(__name__)
#CORS(app, resources={r"/*": {"origins": "http://localhost:4000"}})  # Whitelist localhost:4000

# Use environment variables for paths
UPLOAD_FOLDER_PATH = os.getenv('UPLOAD_FOLDER_PATH', 'default_upload_path')
OUTPUT_FOLDER_PATH = os.getenv('OUTPUT_FOLDER_PATH', 'default_output_path')

@app.route('/estimate-time', methods=['POST'])
def estimate_time():
    data = request.json
    file_name = data.get('fileName')

    if not file_name:
        return jsonify({'error': 'No file name provided'}), 400

    input_file_path = os.path.join(UPLOAD_FOLDER_PATH, file_name)

    # Check if file exists
    if not os.path.exists(input_file_path):
        return jsonify({'error': 'File not found'}), 404

    try:
        estimated_time = transcription.estimate_transcription_time(input_file_path)
        return jsonify({'estimatedTime': estimated_time}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    data = request.json
    file_name = data['fileName']
    output_format = data['outputFormat']

    input_file_path = os.path.join(UPLOAD_FOLDER_PATH, file_name)

    # Check file size (limit: 500MB)
    if os.path.getsize(input_file_path) > 500 * 1024 * 1024:
        return jsonify({'error': 'File too large'}), 413

    try:
        # Process the audio file
        output_file_path = transcription.process_audio_file(input_file_path, output_format)
        if not os.path.exists(output_file_path):
            raise FileNotFoundError(f"Output file not created: {output_file_path}")

        return jsonify({'fileName': output_file_path}), 200
    except FileNotFoundError as fnf_error:
        print(fnf_error)
        return jsonify({'error': str(fnf_error)}), 404
    except Exception as e:
        print(f"Error in transcription: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/test-output', methods=['GET'])
def test_output():
    try:
        test_file_path = os.path.join(OUTPUT_FOLDER_PATH, 'test.txt')
        with open(test_file_path, 'w') as test_file:
            test_file.write('This is a test.')
        return jsonify({'message': f'Test file written to {test_file_path}'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

#comment
