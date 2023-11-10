from transcription import process_audio_file
import sys
import time

sys.path.append('.')

# # Test 1

# # Start timing
# start_time = time.time()

# # Test the processing function
# output_file = process_audio_file("C:\\Users\\zuhai\\Desktop\\VoxaLink\\ML\\voice_datasets\\Sidd\\Sidd (3).m4a", output_format="txt")


# # End timing
# end_time = time.time()

# # Calculate the duration
# duration = end_time - start_time

# print(f"Transcription saved to: {output_file}")
# print(f"Time taken for the whole process: {duration:.2f} seconds")



# Test 2

# Start timing
start_time = time.time()

# Test the processing function
output_file = process_audio_file("C:\\Users\\xkens\\Desktop\\VoxaLink\\ML\\voice_datasets\\Shahrukh\\Recording_3.m4a", output_format="txt")

# End timing
end_time = time.time()

# Calculate the duration
duration = end_time - start_time

print(f"Transcription saved to: {output_file}")
print(f"Time taken for the whole process: {duration:.2f} seconds")