import os
from transcription import (
    convert_audio_to_wav,
    transcribe_audio,
    save_as_txt,
    save_as_pdf,
    save_as_json,
    save_as_csv,
    process_audio_file,
    processor,
    model
)

# Sample audio file path - replace with the path to your test audio file
sample_audio_file = "C:\\Users\\zuhai\\Desktop\\VoxaLinkPro\\VoxaLinkPro\\Files\\uploads\\demo_360p.mp4"

# Output format for testing
output_format = "pdf"  # Change to "pdf", "json", "csv" as needed

def main():
    try:
        print("Starting test transcription process...")
        # Process the audio file and get the output file path
        output_file = process_audio_file(sample_audio_file, output_format)
        print(f"Transcription process completed. Output file: {output_file}")
    except Exception as e:
        print(f"An error occurred during the test: {e}")

if __name__ == "__main__":
    main()
