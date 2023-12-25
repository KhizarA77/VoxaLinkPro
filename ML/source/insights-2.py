import torch
import docx
from PyPDF2 import PdfFileReader
from transformers import pipeline, LongformerTokenizer
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

# Helper function to chunk text
def chunk_text(text, max_length):
    tokens = text.split()
    return [' '.join(tokens[i:i + max_length]) for i in range(0, len(tokens), max_length)]

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
        min_length=30,  # Adjusted for a longer minimum length
        max_length=300,  # Adjusted for a longer maximum length
        no_repeat_ngram_size=4,  # To prevent repetition of 4-word phrases
        num_beams=6,  # Increased number of beams for better quality
        length_penalty=2.0,  # Adjusted length penalty for summary length control
        early_stopping=True,
    )
    return result[0]['summary_text']

# Function for keyword extraction
def extract_keywords(text):
    print("Extracting Keywords")
    stop_words = set(stopwords.words('english'))
    word_tokens = word_tokenize(text)
    keywords = [word for word in word_tokens if word.isalpha() and word not in stop_words]
    return keywords[:20]

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

    # Create a well-formatted PDF report
    create_pdf_report(summary, keywords, output_path=output_pdf_path)

# Example usage
if __name__ == "__main__":
    file_path = "D:\\Downloads\\OSproject.docx"  # Replace with your file path
    output_pdf_path = "C:\\Users\\zuhai\\Desktop\\analysis_report.pdf"  # Output PDF file
    analyze_text_and_generate_report(file_path, output_pdf_path)
    print(f"Analysis report saved to {output_pdf_path}")
