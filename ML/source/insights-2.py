import torch
import io
import docx
from PyPDF2 import PdfFileReader
from transformers import pipeline, BartForConditionalGeneration, BartTokenizer
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

# Download necessary NLTK data
nltk.download('stopwords')
nltk.download('punkt')

# Check if CUDA is available and set the device accordingly
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

# Initialize BART model and tokenizer
bart_model = BartForConditionalGeneration.from_pretrained('facebook/bart-large-cnn').to(device)
bart_tokenizer = BartTokenizer.from_pretrained('facebook/bart-large-cnn')

# Function to read different file types
def read_file(file_path):
    print("reading file ... ")
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

# Function for sentiment analysis
def perform_sentiment_analysis(text):
    print("Performing Sentiment Analysis")
    sentiment_pipeline = pipeline("sentiment-analysis")
    return sentiment_pipeline(text)

# Function for theme detection using NER
def detect_themes(text):
    print("Detecting Themes")
    ner_pipeline = pipeline("ner", grouped_entities=True)
    return ner_pipeline(text)

# Function for keyword extraction
def extract_keywords(text):
    print("Extracting Keywords")
    stop_words = set(stopwords.words('english'))
    word_tokens = word_tokenize(text)
    keywords = [word for word in word_tokens if word.isalpha() and word not in stop_words]
    return keywords

# Function for text summarization
def summarize_text(text):
    print("Summarizing text")
    summarizer = pipeline("summarization")
    summary = summarizer(text, max_length=130, min_length=30, do_sample=False)
    return summary[0]['summary_text']

# Function to generate a report using BART with CUDA
def generate_report_with_bart(sentiment, themes, keywords, summary):
    print("Generating Report")
    input_text = f"Sentiment Analysis: {sentiment}\n\n"
    input_text += f"Themes: {themes}\n\n"
    input_text += f"Keywords: {', '.join(keywords)}\n\n"
    input_text += f"Summary: {summary}\n\n"
    input_text += "Generate a comprehensive report based on the above analysis."

    inputs = bart_tokenizer.encode("summarize: " + input_text, return_tensors="pt", max_length=1024, truncation=True).to(device)
    summary_ids = bart_model.generate(inputs, max_length=1024, min_length=80, length_penalty=2.0, num_beams=4, early_stopping=True)
    report = bart_tokenizer.decode(summary_ids[0], skip_special_tokens=True)

    return report

# Function to create a PDF report
def create_pdf_report(sentiment, themes, keywords, bart_summary, output_path):
    print("Creating PDF")
    c = canvas.Canvas(output_path, pagesize=letter)
    width, height = letter

    c.drawString(50, height - 50, "Text Analysis Report")
    c.drawString(50, height - 80, f"Sentiment Analysis: {sentiment}")

    c.drawString(50, height - 110, "Themes:")
    y_position = height - 130
    for theme in themes:
        c.drawString(50, y_position, theme)
        y_position -= 20

    c.drawString(50, y_position - 30, "Keywords:")
    c.drawString(50, y_position - 50, ', '.join(keywords))

    c.drawString(50, y_position - 80, "BART Summary:")
    y_position -= 100
    for line in bart_summary.split('\n'):
        c.drawString(50, y_position, line)
        y_position -= 20

    c.save()

# Main function to analyze text and generate a report
def analyze_text_and_generate_report(file_path, output_pdf_path):
    text = read_file(file_path)
    sentiment = perform_sentiment_analysis(text)
    themes = detect_themes(text)
    keywords = extract_keywords(text)
    summary = summarize_text(text)

    # Generate the report using BART
    bart_summary = generate_report_with_bart(
        sentiment=sentiment[0]['label'],
        themes=[theme['entity_group'] for theme in themes],
        keywords=keywords,
        summary=summary
    )

    # Create a well-formatted PDF report
    create_pdf_report(sentiment[0]['label'], [theme['entity_group'] for theme in themes], keywords, bart_summary, output_pdf_path)

# Example usage
if __name__ == "__main__":
    file_path = "path_to_your_file.txt"  # Replace with your file path
    output_pdf_path = "analysis_report.pdf"  # Output PDF file
    analyze_text_and_generate_report(file_path, output_pdf_path)
    print(f"Analysis report saved to {output_pdf_path}")
