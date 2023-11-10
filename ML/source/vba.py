import numpy as np
from resemblyzer import VoiceEncoder, preprocess_wav
from pathlib import Path
from pydub import AudioSegment

class SimpleSpeakerVerifier:
    def __init__(self):
        self.encoder = VoiceEncoder()
        self.embeddings = {}

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

        # The verification code is incomplete, but you would typically compare the 
        # generated embedding to the stored embedding for the speaker.
        # For simplicity, let's use cosine similarity.

        # Calculate cosine similarity
        similarity = np.dot(embedding, self.embeddings[speaker_name]) / \
                     (np.linalg.norm(embedding) * np.linalg.norm(self.embeddings[speaker_name]))

        # Adjust the threshold as per requirements
        threshold = 0.8
        return similarity > threshold

# Example of using the above code

if __name__ == "__main__":
    verifier = SimpleSpeakerVerifier()

     # Add speakers to the database
    verifier.add_speaker("Shahrukh", "C:\\Users\\zuhai\\Desktop\\VoxaLink\\ML\\voice_datasets\\Shahrukh\\Recording_2.m4a")
    verifier.add_speaker("Humayun", "C:\\Users\\zuhai\\Desktop\\VoxaLink\\ML\\voice_datasets\\Humayun\\Recording_2.m4a")
    verifier.add_speaker("Shahrukh", "C:\\Users\\zuhai\\Desktop\\VoxaLink\\ML\\voice_datasets\\Shahrukh\\Recording_3.m4a")
    verifier.add_speaker("Humayun", "C:\\Users\\zuhai\\Desktop\\VoxaLink\\ML\\voice_datasets\\Humayun\\Recording_3.m4a")

    # Verify an unknown audio
    is_user = verifier.verify("Humayun", "C:\\Users\\zuhai\\Desktop\\VoxaLink\\ML\\voice_datasets\\Shahrukh\\Recording.m4a")
    if is_user:
        print("The unknown audio belongs to Humayun!")
    else:
        print("The unknown audio does NOT belong to Humayun!")

 # Verify an unknown audio
    is_srk = verifier.verify("Shahrukh", "C:\\Users\\zuhai\\Desktop\\VoxaLink\\ML\\voice_datasets\\Humayun\\Recording_4.m4a")
    if is_srk:
        print("The unknown audio belongs to Shahrukh!")
    else:
        print("The unknown audio does NOT belong to Shahrukh!")
