import pandas as pd
from docx import Document
from fpdf import FPDF
from transformers import BartTokenizer, BartForConditionalGeneration

def read_tokenized_data(file_path):
    with open(file_path, 'r') as file:
        tokenized_text = file.read()
    return tokenized_text

def generate_insights(tokenized_text):
    tokenizer_bart = BartTokenizer.from_pretrained('facebook/bart-large-cnn')
    model_bart = BartForConditionalGeneration.from_pretrained('facebook/bart-large-cnn')
    text = tokenizer_bart.decode(eval(tokenized_text), skip_special_tokens=True)
    inputs = tokenizer_bart.encode("summarize: " + text, return_tensors='pt', max_length=1024, truncation=True)
    summary_ids = model_bart.generate(inputs, max_length=150, min_length=40, length_penalty=2.0, num_beams=4, early_stopping=True)
    return tokenizer_bart.decode(summary_ids[0], skip_special_tokens=True)

def save_output(output_text, output_format):
    if output_format == 'txt':
        with open('output.txt', 'w') as file:
            file.write(output_text)
    elif output_format == 'csv':
        df = pd.DataFrame({'Insights': [output_text]})
        df.to_csv('output.csv', index=False)
    elif output_format == 'docx':
        doc = Document()
        doc.add_paragraph(output_text)
        doc.save('output.docx')
    elif output_format == 'pdf':
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font('Arial', size=12)
        pdf.multi_cell(0, 10, output_text)
        pdf.output('output.pdf')

if __name__ == "__main__":
    tokenized_file_path = 'tokenized_text.txt'
    tokenized_text = read_tokenized_data(tokenized_file_path)
    insights = generate_insights(tokenized_text)
    output_format = 'txt'  # Choose from 'txt', 'csv', 'docx', 'pdf'
    save_output(insights, output_format)
    print(f"Insights saved in {output_format} format.")
