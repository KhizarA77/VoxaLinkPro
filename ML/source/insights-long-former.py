import torch
import docx
from PyPDF2 import PdfFileReader
from transformers import pipeline, LongformerTokenizer, AutoTokenizer, AutoModelForTokenClassification
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from textwrap import wrap

# Download necessary NLTK data
nltk.download('stopwords')
nltk.download('punkt')

# Check if CUDA is available and set the device accordingly
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

# Initialize the Longformer model for summarization
summarization_model = pipeline(
    "summarization",
    "pszemraj/led-large-book-summary",
    device=0 if torch.cuda.is_available() else -1
)

# Initialize the model and tokenizer for keyword extraction
keyword_extraction_tokenizer = AutoTokenizer.from_pretrained("valurank/MiniLM-L6-Keyword-Extraction")
keyword_extraction_model = AutoModelForTokenClassification.from_pretrained("valurank/MiniLM-L6-Keyword-Extraction")

# Helper function to chunk tokenized text
def chunk_tokenize(text, max_length):
    tokenized_text = keyword_extraction_tokenizer.encode(text, add_special_tokens=True)
    max_chunk_size = max_length - 2
    return [tokenized_text[i: i + max_chunk_size] for i in range(0, len(tokenized_text), max_chunk_size)]

# Function to read different file types
def read_file(file_path):
    print("Reading file ... ")
    if file_path.endswith('.txt'):
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    elif file_path.endswith('.pdf'):
        with open(file_path, 'rb') as file:
            reader = PdfFileReader(file)
            text = [reader.getPage(i).extractText() for i in range(reader.numPages)]
            return '\n'.join(text)
    elif file_path.endswith('.docx'):
        doc = docx.Document(file_path)
        text = [p.text for p in doc.paragraphs]
        return '\n'.join(text)
    else:
        raise ValueError("Unsupported file format")

# Function for text summarization
def summarize_text(text):
    print("Summarizing text")
    result = summarization_model(
        text,
        min_length=16,
        max_length=256,
        no_repeat_ngram_size=3,
        encoder_no_repeat_ngram_size=3,
        repetition_penalty=3.5,
        num_beams=4,
        early_stopping=True,
    )
    return result[0]['summary_text']


# Function for keyword extraction
def extract_keywords(text):
    print("Extracting Keywords")
    # Tokenize the text and split into chunks
    tokenized_text = keyword_extraction_tokenizer.encode(text, add_special_tokens=True, truncation=True, max_length=512)
    chunked_tokenized_texts = [tokenized_text[i: i + 512] for i in range(0, len(tokenized_text), 512)]

    keywords = []
    for token_chunk in chunked_tokenized_texts:
        # Convert token chunk to its corresponding text chunk
        chunk_text = keyword_extraction_tokenizer.decode(token_chunk, skip_special_tokens=True)
        # Process the text chunk with the model
        inputs = keyword_extraction_tokenizer(chunk_text, return_tensors="pt")
        outputs = keyword_extraction_model(**inputs)
        predictions = outputs.logits

        # Handle 0-d tensor for predictions
        if predictions.ndim == 0:
            predictions = predictions.unsqueeze(0)

        predictions = torch.argmax(predictions, dim=-1)

        # Ensure input_ids is suitable for iteration
        input_ids = inputs["input_ids"]
        if input_ids.ndim == 0:
            input_ids = input_ids.unsqueeze(0)

        # Convert ids to tokens and extract keywords
        tokens = [keyword_extraction_tokenizer.convert_ids_to_tokens(id) for id in input_ids[0]]
        extracted_keywords = [tokens[i] for i in range(len(tokens)) if predictions[0][i] == 1]
        keywords.extend(extracted_keywords)

    return list(set(keywords))[:20]


# Function to create a multi-page, wrapped text PDF report
def create_pdf_report(summary, keywords, output_path):
    print("Creating PDF")
    c = canvas.Canvas(output_path, pagesize=letter)
    margin = 50
    y_position = letter[1] - margin
    line_height = 15

    def draw_line(text):
        nonlocal y_position
        wrapped_text = wrap(text, 80)
        for line in wrapped_text:
            if y_position < margin + line_height:
                c.showPage()
                y_position = letter[1] - margin
            c.drawString(margin, y_position, line)
            y_position -= line_height

    draw_line("Text Analysis Report")
    draw_line("Summary:")
    draw_line(summary)
    draw_line("Keywords:")
    draw_line(', '.join(keywords))

    c.save()

# Main function to analyze text and generate a report
def analyze_text_and_generate_report(file_path, output_pdf_path):
    text = read_file(file_path)
    summary = summarize_text(text)
    keywords = extract_keywords(text)

    create_pdf_report(summary, keywords, output_path=output_pdf_path)

# Example usage
if __name__ == "__main__":
    file_path = "D:\\Downloads\\OSproject.docx"  # Replace with your file path
    output_pdf_path = "C:\\Users\\zuhai\\Desktop\\analysis_report.pdf"  # Output PDF file
    analyze_text_and_generate_report(file_path, output_pdf_path)
    print(f"Analysis report saved to {output_pdf_path}")
