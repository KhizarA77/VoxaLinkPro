import os
import torch
from transformers import WhisperProcessor, WhisperForConditionalGeneration
from pydub import AudioSegment
import librosa
from fpdf import FPDF
import json
import csv
from concurrent.futures import ProcessPoolExecutor

# Initialize the Whisper model and processor
processor = WhisperProcessor.from_pretrained("openai/whisper-large-v2")
model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-large-v2")

# Check if CUDA (GPU support) is available and move the model to GPU if it is
device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)

def convert_audio_to_wav(audio_file, output_file):
    """Converts audio files of different formats to WAV format."""
    audio = AudioSegment.from_file(audio_file)
    audio.export(output_file, format="wav")

# Make sure transcribe_chunk is a top-level function to be picklable
def transcribe_chunk(audio_chunk, sr, device):
    # Initialize model and processor inside the function
    processor = WhisperProcessor.from_pretrained("openai/whisper-large-v2")
    model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-large-v2")
    model.to(device)
    
    # Get the input features from the current chunk of audio data
    input_features = processor(audio_chunk, return_tensors="pt", sampling_rate=sr).input_features
    input_features = input_features.to(device)
    
    # Generate the predictions
    with torch.no_grad():  # Disable gradient calculation for inference
        predicted_ids = model.generate(input_features)
    
    # Decode the predicted ids to text
    chunk_transcription = processor.batch_decode(predicted_ids)
    return chunk_transcription[0]

# Adjusted transcribe_audio function
def transcribe_audio(audio_file, device):
    """Transcribes the audio file using the Whisper model with parallel processing."""
    # Load the audio file fully
    audio_data, sr = librosa.load(audio_file, sr=16000, mono=True)
    
    # Decide on the number of chunks based on the file length
    chunk_length_minutes = 1  # Use 1 minute chunks for simplicity
    max_seconds = chunk_length_minutes * 60

    # Prepare for parallel processing of chunks
    chunks = [(audio_data[i:i + max_seconds * sr], sr, device)
              for i in range(0, len(audio_data), max_seconds * sr)]
    
    # Process audio chunks in parallel
    with ProcessPoolExecutor() as executor:
        transcription_segments = list(executor.map(transcribe_chunk, chunks))

    # Combine transcriptions from all chunks
    full_transcription = " ".join(transcription_segments)
    return full_transcription


def save_as_txt(transcription, output_file):
    """Saves the transcription to a TXT file."""
    with open(output_file, "w") as txt_file:
        txt_file.write(transcription)


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
    
    # Transcribe the WAV file, only pass the file and device
    transcription = transcribe_audio(temp_wav_file, device)
    
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
    output_file = os.path.splitext(input_file)[0] + "." + output_format
    format_to_function[output_format](transcription, output_file)

    # Clean up temporary files
    os.remove(temp_wav_file)
    
    return output_file
