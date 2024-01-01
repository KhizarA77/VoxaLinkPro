import os
import torch
import subprocess
import time
from transformers import WhisperProcessor, WhisperForConditionalGeneration
import librosa
from fpdf import FPDF
from docx import Document
import json
import csv
import re
import concurrent.futures
from unidecode import unidecode
import logging

# from dotenv import load_dotenv
# Configure logging at the start of your script
logging.basicConfig(level=logging.INFO, filename='transcription.log', format='%(asctime)s - %(levelname)s - %(message)s')

# #hello world
# # Load environment variables from .env file
# load_dotenv()

# Determine the base directory (project root)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Combine base directory with relative paths from .env file
OUTPUT_FOLDER_PATH = "..\\..\\Files\\outputs"
UPLOAD_FOLDER_PATH = "..\\..\\Files\\uploads"

# Initialize the Whisper model and processor
processor = WhisperProcessor.from_pretrained("openai/whisper-medium")
model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-medium")
print(torch.cuda.is_available())


# Check if CUDA (GPU support) is available
if torch.cuda.is_available():
    device = "cuda"
else:
    device = "cpu"
    # Set the number of threads to the number of available CPU cores
    torch.set_num_threads(os.cpu_count())

logging.info(f"Using device: {device}")
# print(f"Using device: {device}")
model.to(device)


def remove_transcription_tags(transcription):
    # Tags to be removed
    tags_to_remove = ['<|startoftranscript|>', '<|en|>', '<|transcribe|>', '<|notimestamps|>', '<|endoftext|>']
    # Remove each tag by replacing it with an empty string
    for tag in tags_to_remove:
        transcription = transcription.replace(tag, '')
    # Remove any additional whitespace that may have been left as a result of tag removal
    transcription = re.sub(' +', ' ', transcription)  # Replace multiple spaces with a single space
    transcription = transcription.strip()  # Remove leading and trailing whitespaces
    return transcription


def convert_audio_to_wav(audio_file, output_file):
    print(f"Starting conversion of {audio_file} to WAV format with loudness normalization and dynamic range compression, please wait.")
    start_time = time.time()

    command = [
        'ffmpeg',
        '-i', audio_file,  # Input file
        '-filter_complex', '[0:a]loudnorm,compand',  # Apply loudness normalization and dynamic range compression
        '-ar', '16000',  # Set sample rate to 16000 Hz
        '-ac', '1',  # Set audio channels to 1 (mono)
        output_file  # Output file
    ]

    try:
        subprocess.run(command, check=True)
        end_time = time.time()
        print(f"Conversion, normalization, and compression completed in {end_time - start_time} seconds.")
    except subprocess.CalledProcessError as e:
        print(f"Error during conversion, normalization, and compression: {e}")
        raise


def transcribe_audio(audio_file, model, processor):
    if torch.cuda.is_available():
        device = "cuda"
    else:
        device = "cpu"
        torch.set_num_threads(os.cpu_count())

    print(f"Using device: {device}")
    model.to(device)
    
    try:
        logging.info(f"Starting transcription of {audio_file}")
        # print(f"Starting transcription of {audio_file}.")
        start_time = time.time()

        audio_data, sr = librosa.load(audio_file, sr=16000, mono=True)
        audio_data = librosa.util.normalize(audio_data)
        chunk_length_seconds = 30
        overlap_seconds = 10
        chunk_length_samples = chunk_length_seconds * sr
        overlap_samples = overlap_seconds * sr
        total_chunks = (len(audio_data) + overlap_samples - 1) // (chunk_length_samples - overlap_samples)
        transcription_segments = []
        current_chunk = 0

        start = 0
        while start < len(audio_data):
            current_chunk += 1
            chunk_start_time_seconds = start / sr
            chunk_start_time_formatted = f"{int(chunk_start_time_seconds // 60):02d}:{int(chunk_start_time_seconds % 60):02d}"
            percentage_complete = (current_chunk / total_chunks) * 100
            print(f"Transcribing chunk {current_chunk}/{total_chunks} ({percentage_complete:.2f}% complete)...")

            end = min(start + chunk_length_samples, len(audio_data))
            audio_chunk = audio_data[start:end]
            input_features = processor(audio_chunk, return_tensors="pt", sampling_rate=sr).input_features
            input_features = input_features.to(device)
            
            with torch.no_grad():
                predicted_ids = model.generate(input_features)
            chunk_transcription = processor.batch_decode(predicted_ids)[0]
            timestamped_transcription = f"[{chunk_start_time_formatted}] {chunk_transcription}"
            transcription_segments.append(timestamped_transcription)

            start += (chunk_length_samples - overlap_samples)

        full_transcription = " ".join(transcription_segments)
        full_transcription = remove_transcription_tags(full_transcription)

        end_time = time.time()
        logging.info(f"Transcription of {audio_file} completed in {end_time - start_time} seconds.")
        # print(f"Transcription completed in {end_time - start_time} seconds.")
        return full_transcription

    except Exception as e:
        logging.error(f"Error during transcription of {audio_file}: {e}")
        # print(f"Error during transcription: {e}")
        raise




# Old transcription code 
# def transcribe_audio(audio_file, model, processor):
#     # Check if CUDA (GPU support) is available
#     if torch.cuda.is_available():
#         device = "cuda"
#     else:
#         device = "cpu"
#         # Set the number of threads to the number of available CPU cores
#         torch.set_num_threads(os.cpu_count())
    
#     print(f"Using device: {device}")
#     model.to(device)
    
#     try:
#         print(f"Starting transcription of {audio_file}.")
#         start_time = time.time()

#         audio_data, sr = librosa.load(audio_file, sr=16000, mono=True)
#         audio_data = librosa.util.normalize(audio_data)
#         audio_length_seconds = librosa.get_duration(y=audio_data, sr=sr)
#         chunk_length_seconds = 30  # Length of each audio chunk in seconds
#         overlap_seconds = 10  # Overlap between chunks in seconds
#         chunk_length_samples = chunk_length_seconds * sr
#         overlap_samples = overlap_seconds * sr
#         transcription_segments = []

#         if audio_length_seconds <= chunk_length_seconds:
#             # If the audio is shorter than the chunk length, transcribe it in one go
#             input_features = processor(audio_data, return_tensors="pt", sampling_rate=sr).input_features
#             input_features = input_features.to(device)
#             with torch.no_grad():
#                 predicted_ids = model.generate(input_features)
#             transcription_segments.append(processor.batch_decode(predicted_ids)[0])
#         else:
#             # If the audio is longer, process it in chunks
#             start = 0
#             while start < len(audio_data):
#                 end = start + chunk_length_samples
#                 audio_chunk = audio_data[start:end]
#                 input_features = processor(audio_chunk, return_tensors="pt", sampling_rate=sr).input_features
#                 input_features = input_features.to(device)
                
#                 with torch.no_grad():
#                     predicted_ids = model.generate(input_features)
#                 chunk_transcription = processor.batch_decode(predicted_ids)
#                 transcription_segments.append(chunk_transcription[0])
#                 start += (chunk_length_samples - overlap_samples)  # Move start forward, minus overlap

#         full_transcription = " ".join(transcription_segments)
#         full_transcription = remove_transcription_tags(full_transcription)  # Clean the transcription

#         end_time = time.time()
#         print(f"Transcription completed in {end_time - start_time} seconds.")
#         return full_transcription

#     except Exception as e:
#         print(f"Error during transcription: {e}")
#         raise

def save_as_txt(transcription, output_file):
    try:
        with open(output_file, "w") as txt_file:
            txt_file.write(transcription)
        print(f"File saved at {output_file}")
    except Exception as e:
        print(f"Error saving TXT file: {e}")
        raise


def save_as_pdf(transcription, output_file):
    try:
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)

        # Replace non-Latin-1 characters
        transcription = unidecode(transcription)

        lines = transcription.split('\n')
        for line in lines:
            pdf.multi_cell(0, 10, line, 0, 1)

        pdf.output(output_file)
        print(f"PDF file saved at {output_file}")
    except Exception as e:
        print(f"Error saving PDF file: {e}")
        raise


def save_as_word(transcription, output_file):
    """Saves the transcription to a Word (DOCX) file."""
    doc = Document()
    doc.add_paragraph(transcription)
    doc.save(output_file)

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

def estimate_transcription_time(audio_file):
    """Estimate transcription time based on the audio file's size"""
    duration = librosa.get_duration(filename=audio_file)
    estimated_time = duration * 0.0615  # Adjust this factor based on your observations
    estimated_time_message = f"Estimated transcription time for {duration} seconds of audio: {estimated_time} seconds"
    print(estimated_time_message)
    return estimated_time_message

def process_audio_file(input_file, output_format="txt"):
    print(f"Processing audio file: {input_file}")

    # Generate a unique temporary file name based on the original file name
    base_name = os.path.basename(os.path.splitext(input_file)[0])
    temp_wav_file = os.path.join(BASE_DIR, f"{base_name}_temp_converted.wav")
    
    convert_audio_to_wav(input_file, temp_wav_file)

    estimate_transcription_time(temp_wav_file)
    transcription = transcribe_audio(temp_wav_file, model, processor)

    format_to_function = {
        "txt": save_as_txt,
        "pdf": save_as_pdf,
        "json": save_as_json,
        "csv": save_as_csv
    }

    if output_format not in format_to_function:
        raise ValueError(f"Unsupported output format: {output_format}")

    if not os.path.exists(OUTPUT_FOLDER_PATH):
        os.makedirs(OUTPUT_FOLDER_PATH)

    output_file_name = base_name + "." + output_format
    output_file = os.path.join(OUTPUT_FOLDER_PATH, output_file_name)
    format_to_function[output_format](transcription, output_file)

    os.remove(temp_wav_file)
    
    print(f"Output file saved at {output_file}")
    return output_file
