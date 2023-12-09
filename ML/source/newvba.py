import numpy as np
from resemblyzer import VoiceEncoder, preprocess_wav
from pathlib import Path
from pydub import AudioSegment
from scipy.spatial import distance
import os
import tensorflow_datasets as tfds

#comment
class EnhancedSpeakerVerifier:
    def __init__(self):
        self.encoder = VoiceEncoder()
        self.embeddings = {}
        self.failed_attempts = {}
        self.MAX_ATTEMPTS = 3  # Adjust as needed

    def convert_to_wav(self, input_file, output_file, input_format):
        """Convert a given audio format to WAV."""
        audio = AudioSegment.from_file(input_file, format=input_format)
        audio.export(output_file, format="wav")
        return output_file

    def convert_mp4_to_wav(self, mp4_file, wav_file):
        """Convert MP4 audio to WAV format."""
        return self.convert_to_wav(mp4_file, wav_file, "mp4")
    
    def convert_m4a_to_wav(self, m4a_file, wav_file):
        """Convert MP4 audio to WAV format."""
        return self.convert_to_wav(m4a_file, wav_file, "m4a")
    
    def convert_mp3_to_wav(self, mp3_file, wav_file):
        """Convert MP4 audio to WAV format."""
        return self.convert_to_wav(mp3_file, wav_file, "mp3")
    
    def convert_aac_to_wav(self, aac_file, wav_file):
        """Convert MP4 audio to WAV format."""
        return self.convert_to_wav(aac_file, wav_file, "aac")
    
    def convert_flac_to_wav(self, flac_file, wav_file):
        """Convert MP4 audio to WAV format."""
        return self.convert_to_wav(flac_file, wav_file, "flac")

    def vox_test_dataset(self, dataset_path):
        """Test the verifier on a dataset."""
        wav_dir = Path(dataset_path) / "wav"
        total_tests = 0
        correct_verifications = 0

        # Add each speaker's embeddings to the database
        for speaker_dir in wav_dir.iterdir():
            if speaker_dir.is_dir():
                speaker_name = speaker_dir.name
                for session_dir in speaker_dir.iterdir():
                    for audio_file in session_dir.iterdir():
                        if audio_file.suffix == '.wav':
                            self.add_speaker(speaker_name, str(audio_file))

        # Verify each speaker's audio
        for speaker_dir in wav_dir.iterdir():
            if speaker_dir.is_dir():
                speaker_name = speaker_dir.name
                for session_dir in speaker_dir.iterdir():
                    for audio_file in session_dir.iterdir():
                        if audio_file.suffix == '.wav':
                            is_verified = self.verify(speaker_name, str(audio_file))
                            total_tests += 1
                            if is_verified:
                                correct_verifications += 1

        accuracy = (correct_verifications / total_tests) * 100
        print(f"Accuracy on the dataset: {accuracy:.2f}%")

    def test_dataset(self, dataset_path):
        """Test the verifier on a dataset."""
        dataset_dir = Path(dataset_path)
        total_tests = 0
        correct_verifications = 0
        correct_predictions = []
        incorrect_predictions = []

        # Add each speaker's embeddings to the database
        for speaker_dir in dataset_dir.iterdir():
            if speaker_dir.is_dir():
                speaker_name = speaker_dir.name
                for audio_file in speaker_dir.iterdir():
                    if audio_file.suffix in ['.wav', '.mp4', '.m4a', '.mp3', '.aac', '.flac']:
                        self.add_speaker(speaker_name, str(audio_file))

        # Verify each speaker's audio
        for speaker_dir in dataset_dir.iterdir():
            if speaker_dir.is_dir():
                speaker_name = speaker_dir.name
                for audio_file in speaker_dir.iterdir():
                    if audio_file.suffix in ['.wav', '.mp4', '.m4a', '.mp3', '.aac', '.flac']:
                        is_verified = self.verify(speaker_name, str(audio_file))
                        total_tests += 1
                        if is_verified:
                            correct_verifications += 1
                            correct_predictions.append(str(audio_file))
                        else:
                            incorrect_predictions.append(str(audio_file))

        accuracy = (correct_verifications / total_tests) * 100
        print(f"Accuracy on the dataset: {accuracy:.2f}%")
        print("\nCorrect Predictions:")
        for path in correct_predictions:
            print(path)
        print("\nIncorrect Predictions:")
        for path in incorrect_predictions:
            print(path)


    def add_speaker(self, speaker_name, audio_path):
        """Add a speaker's embedding to the database."""
        if audio_path.endswith(".mp4"):
            audio_path = self.convert_mp4_to_wav(audio_path, audio_path.replace(".mp4", ".wav"))
        if audio_path.endswith(".m4a"):
            audio_path = self.convert_m4a_to_wav(audio_path, audio_path.replace(".m4a", ".wav"))
        if audio_path.endswith(".mp3"):
            audio_path = self.convert_mp3_to_wav(audio_path, audio_path.replace(".mp3", ".wav"))
        if audio_path.endswith(".aac"):
            audio_path = self.convert_mp4_to_wav(audio_path, audio_path.replace(".aac", ".wav"))
        if audio_path.endswith(".flac"):
            audio_path = self.convert_mp4_to_wav(audio_path, audio_path.replace(".flac", ".wav"))
        
        wav = preprocess_wav(Path(audio_path))
        embedding = self.encoder.embed_utterance(wav)
    
        # If the speaker already exists, average the embeddings
        if speaker_name in self.embeddings:
            avg_embedding = np.mean([embedding, self.embeddings[speaker_name]], axis=0)
            self.embeddings[speaker_name] = avg_embedding
        else:
            self.embeddings[speaker_name] = embedding

            

    def verify(self, speaker_name, audio_path):
        """Verify if the audio belongs to the given speaker."""
        if speaker_name not in self.embeddings:
            print(f"{speaker_name} not found in database.")
            return False
        
        if audio_path.endswith(".mp4"):
            audio_path = self.convert_mp4_to_wav(audio_path, audio_path.replace(".mp4", ".wav"))
        if audio_path.endswith(".m4a"):
            audio_path = self.convert_m4a_to_wav(audio_path, audio_path.replace(".m4a", ".wav"))
        if audio_path.endswith(".mp3"):
            audio_path = self.convert_mp3_to_wav(audio_path, audio_path.replace(".mp3", ".wav"))
        if audio_path.endswith(".aac"):
            audio_path = self.convert_mp4_to_wav(audio_path, audio_path.replace(".aac", ".wav"))
        if audio_path.endswith(".flac"):
            audio_path = self.convert_mp4_to_wav(audio_path, audio_path.replace(".flac", ".wav"))
            
            
        wav = preprocess_wav(Path(audio_path))
        embedding = self.encoder.embed_utterance(wav)

        # Normalize the embeddings before calculating cosine similarity
        norm_test_embedding = embedding / np.linalg.norm(embedding)
        norm_stored_embedding = self.embeddings[speaker_name] / np.linalg.norm(self.embeddings[speaker_name])
        
        similarity = 1 - distance.cosine(norm_stored_embedding, norm_test_embedding)
        
        threshold = 0.7  # Adjusted threshold
        is_verified = similarity > threshold

        # Implement rate limiting
        if not is_verified:
            self.failed_attempts[speaker_name] = self.failed_attempts.get(speaker_name, 0) + 1
            if self.failed_attempts[speaker_name] > self.MAX_ATTEMPTS:
                # print(f"Too many failed attempts for {speaker_name}. Account locked.")
                return False

        return is_verified

    def reset_failed_attempts(self, speaker_name):
        """Reset the failed attempts for a speaker."""
        self.failed_attempts[speaker_name] = 0

if __name__ == "__main__":
    verifier = EnhancedSpeakerVerifier()

    # Path to the VoxCeleb1 dataset (adjust this to your actual path)
    dataset_path = "C:\\Users\\zuhai\\Desktop\\VoxaLink\\ML\\voxceleb"
    
    # Ensure the dataset directory exists
    if not os.path.exists(dataset_path):
        print(f"Error: The directory {dataset_path} does not exist. Please check the path.")
    else:
        # Test the verifier on the VoxCeleb1 dataset
        verifier.vox_test_dataset(dataset_path)

    # dataset_path = "C:\\Users\\zuhai\\Desktop\\VoxaLink\\ML\\voice_datasets"  # Replace with your dataset directory path
    # verifier.test_dataset(dataset_path)
