import os
import torch
from transformers import WhisperProcessor, WhisperForConditionalGeneration
from pydub import AudioSegment
import librosa
from fpdf import FPDF
# from docx import Document
import json
import csv

# Initialize the Whisper model and processor
processor = WhisperProcessor.from_pretrained("openai/whisper-medium")
model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-medium")

# Check if CUDA (GPU support) is available and move the model to GPU if it is
device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)

def convert_audio_to_wav(audio_file, output_file):
    """Converts audio files of different formats to WAV format."""
    audio = AudioSegment.from_file(audio_file)
    audio.export(output_file, format="wav")


def transcribe_audio(audio_file, model, processor):
    try:
        # Load the audio file fully
        audio_data, sr = librosa.load(audio_file, sr=16000, mono=True)
        audio_length_seconds = librosa.get_duration(y=audio_data, sr=sr)

        # Decide on the number of chunks based on the file length
        chunk_length_minutes = max(1, audio_length_seconds / 1800)
        max_seconds = int(chunk_length_minutes * 60)

        # Initialize an empty list to collect transcriptions
        transcription_segments = []

        # Process audio in chunks
        for start in range(0, len(audio_data), max_seconds * sr):
            end = start + (max_seconds * sr)
            audio_chunk = audio_data[start:end]

            # Get the input features from the current chunk of audio data
            input_features = processor(audio_chunk, return_tensors="pt", sampling_rate=sr).input_features
            input_features = input_features.to(device)

            # Generate the predictions
            with torch.no_grad():
                predicted_ids = model.generate(input_features)

            # Decode the predicted ids to text
            chunk_transcription = processor.batch_decode(predicted_ids)
            transcription_segments.append(chunk_transcription[0])

        # Combine transcriptions from all chunks
        full_transcription = " ".join(transcription_segments)
        return full_transcription

    except Exception as e:
        print(f"Error during transcription: {e}")
        raise

def save_as_txt(transcription, output_file):
    try:
        with open(output_file, "w") as txt_file:
            txt_file.write(transcription)
        print(f"File saved at {output_file}")
    except Exception as e:
        print(f"Error saving TXT file: {e}")
        raise

def save_as_pdf(transcription, output_file):
    """Saves the transcription to a PDF file."""
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 10, transcription)
    pdf.output(output_file)

# def save_as_word(transcription, output_file):
#     """Saves the transcription to a Word (DOCX) file."""
#     doc = Document()
#     doc.add_paragraph(transcription)
#     doc.save(output_file)

def save_as_json(transcription, output_file):
    """Saves the transcription to a JSON file."""
    with open(output_file, "w") as json_file:
        json.dump({"transcription": transcription}, json_file)

def save_as_csv(transcription, output_file):
    """Saves the transcription to a CSV file."""
    with open(output_file, "w", newline='') as csv_file:
        writer = csv.writer(csv_file)
        writer.writerow(["Transcription"])
        writer.writerow([transcription])

def process_audio_file(input_file, output_format="txt"):
    """Main function to process the audio file and save the transcription in the desired format."""

    # Convert the audio file to WAV format
    temp_wav_file = "temp_converted.wav"
    convert_audio_to_wav(input_file, temp_wav_file)
    
    # Transcribe the WAV file
    transcription = transcribe_audio(temp_wav_file, model, processor)
    
    # Mapping of output formats to their respective saving functions
    format_to_function = {
        "txt": save_as_txt,
        "pdf": save_as_pdf,
        # "docx": save_as_word,
        "json": save_as_json,
        "csv": save_as_csv
    }
    
    # Check if the desired output format is supported
    if output_format not in format_to_function:
        raise ValueError(f"Unsupported output format: {output_format}")
    
    # Save the transcription in the desired format
    OUTPUT_FOLDER_PATH = "C:\\Users\\xkens\\Desktop\\VoxaLink\\VoxaLinkPro\\Files\\outputs"
    output_file_name = os.path.basename(os.path.splitext(input_file)[0]) + "." + output_format
    output_file = os.path.join(OUTPUT_FOLDER_PATH, output_file_name)
    # Clean up temporary files
    os.remove(temp_wav_file)
    
    return output_file


