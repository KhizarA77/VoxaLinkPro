import pandas as pd
import pdfplumber
import torch
from transformers import BertTokenizer, BertModel, BartForConditionalGeneration, BartTokenizer
from docx import Document
from reportlab.pdfgen import canvas

# Check if CUDA is available and set the device accordingly
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

# Initialize tokenizer and models
bert_tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
bert_model = BertModel.from_pretrained('bert-base-uncased')
bart_tokenizer = BartTokenizer.from_pretrained('facebook/bart-large-cnn')
bart_model = BartForConditionalGeneration.from_pretrained('facebook/bart-large-cnn')

def read_text_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except Exception as e:
        return f"Error reading file: {e}"

def read_csv_file(file_path):
    try:
        df = pd.read_csv(file_path)
        return ' '.join(df.iloc[:,0])
    except Exception as e:
        return f"Error reading file: {e}"

def read_pdf_file(file_path):
    try:
        with pdfplumber.open(file_path) as pdf:
            return ' '.join(page.extract_text() for page in pdf.pages if page.extract_text())
    except Exception as e:
        return f"Error reading file: {e}"

def read_docx_file(file_path):
    try:
        doc = Document(file_path)
        return ' '.join(paragraph.text for paragraph in doc.paragraphs)
    except Exception as e:
        return f"Error reading file: {e}"

def chunk_text(text, max_length):
    tokens = bert_tokenizer.encode(text, add_special_tokens=True)
    if len(tokens) <= max_length:
        return [text]
    
    words = text.split()
    chunks = []
    current_chunk = []
    current_length = 0
    for word in words:
        current_chunk.append(word)
        current_length += len(bert_tokenizer.encode(word, add_special_tokens=False))
        if current_length >= max_length:
            chunks.append(' '.join(current_chunk))
            current_chunk = []
            current_length = 0
    if current_chunk:
        chunks.append(' '.join(current_chunk))
    return chunks

def bert_analyze(text):
    inputs = bert_tokenizer(text, return_tensors="pt", max_length=512, truncation=True)
    outputs = bert_model(**inputs)
    return outputs.last_hidden_state

def bart_summarize(text):
    inputs = bart_tokenizer.encode("summarize: " + text, return_tensors="pt", max_length=1024, truncation=True)
    summary_ids = bart_model.generate(inputs, max_length=200, min_length=30, length_penalty=2.0, num_beams=4, early_stopping=True)
    return bart_tokenizer.decode(summary_ids[0], skip_special_tokens=True)

def process_file(file_path):
    if file_path.endswith('.txt'):
        text = read_text_file(file_path)
    elif file_path.endswith('.csv'):
        text = read_csv_file(file_path)
    elif file_path.endswith('.pdf'):
        text = read_pdf_file(file_path)
    elif file_path.endswith('.docx'):
        text = read_docx_file(file_path)
    else:
        raise ValueError("Unsupported file format")

    max_token_length = 512
    text_chunks = chunk_text(text, max_token_length)

    all_bert_outputs = []
    all_summaries = []
    for chunk in text_chunks:
        bert_output = bert_analyze(chunk)
        all_bert_outputs.append(bert_output)

        summary = bart_summarize(chunk)
        all_summaries.append(summary)

    with open('analysis_results.txt', 'w') as file:
        for i, (bert_output, summary) in enumerate(zip(all_bert_outputs, all_summaries)):
            file.write(f"Chunk {i+1} - BERT Analysis:\n")
            file.write(str(bert_output))
            file.write("\n\nChunk {i+1} - BART Summary:\n")
            file.write(summary)
            file.write("\n\n")

    return "Analysis and summary saved to analysis_results.txt"

if __name__ == "__main__":
    file_path = 'path_to_your_transcript_file'
    result = process_file(file_path)
    print(result)
