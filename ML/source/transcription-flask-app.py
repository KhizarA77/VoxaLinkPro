from flask import Flask, request, jsonify
import os
import transcription

app = Flask(__name__)

UPLOAD_FOLDER_PATH = "C:\\Users\\khiza\\OneDrive\\Desktop\\AI Project\\VoxaLink\\Files\\uploads"
OUTPUT_FOLDER_PATH = "C:\\Users\\khiza\\OneDrive\\Desktop\\AI Project\\VoxaLink\\Files\\outputs"

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    data = request.json
    file_name = data['fileName']
    output_format = data['outputFormat']

    input_file_path = os.path.join(UPLOAD_FOLDER_PATH, file_name)

    try:
        output_file_path = transcription.process_audio_file(input_file_path, output_format)
        print(f"Input file path: {input_file_path}")
        print(f"Output file path: {output_file_path}")
        return jsonify({'fileName': output_file_path}), 200
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

