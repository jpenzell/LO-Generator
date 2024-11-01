import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type;

  try {
    // Text files
    if (fileType === 'text/plain' || fileType === 'text/markdown') {
      return await file.text();
    }

    // PDF files
    if (fileType === 'application/pdf') {
      return await extractTextFromPDF(file);
    }

    // Word documents
    if (fileType === 'word' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return await extractTextFromWord(file);
    }

    // HTML files
    if (fileType === 'text/html') {
      return await extractTextFromHTML(file);
    }

    throw new Error(`Unsupported file type: ${fileType}`);
  } catch (error) {
    console.error('File processing error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to process file');
  }
}

async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(new Uint8Array(arrayBuffer)).promise;
    
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    if (!fullText.trim()) {
      throw new Error('No text content found in PDF');
    }
    
    return fullText;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF. The file might be corrupted or password-protected.');
  }
}

async function extractTextFromWord(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    if (!result.value.trim()) {
      throw new Error('No text content found in Word document');
    }
    
    return result.value;
  } catch (error) {
    throw new Error('Failed to extract text from Word document. The file might be corrupted.');
  }
}

async function extractTextFromHTML(file: File): Promise<string> {
  try {
    const text = await file.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const content = doc.body.textContent || '';
    
    if (!content.trim()) {
      throw new Error('No text content found in HTML file');
    }
    
    return content;
  } catch (error) {
    throw new Error('Failed to extract text from HTML file. The file might be corrupted.');
  }
}