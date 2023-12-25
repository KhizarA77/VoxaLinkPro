from datasets import load_dataset

# Load the dataset
dataset = load_dataset("allenai/scico")

# Print the structure of the dataset
print("Dataset Structure:", dataset)
print("Features of Train Set:", dataset['train'].features)
