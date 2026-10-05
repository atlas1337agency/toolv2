import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, Loader2, Search, FileText } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import * as pdfjsLib from "pdfjs-dist";
import Tesseract from 'tesseract.js';

// Set up pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

export function OcrPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<{status: string, progress: number} | null>(null);
  const [resultText, setResultText] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setResultText("");
      setProgress(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  } as any);

  const performOcr = async () => {
    if (!file || !canvasRef.current) return;
    setIsProcessing(true);
    setResultText("");
    setProgress({ status: "Loading PDF...", progress: 0 });
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      
      let fullText = "";
      
      for (let i = 1; i <= numPages; i++) {
        setProgress({ status: `Rendering page ${i} of ${numPages}...`, progress: 0 });
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better OCR
        
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) continue;
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        
        // @ts-ignore
        await page.render(renderContext).promise;
        
        setProgress({ status: `Extracting text from page ${i}...`, progress: 0 });
        
        const { data: { text } } = await Tesseract.recognize(
          canvas,
          'eng',
          {
            logger: m => {
              if (m.status === 'recognizing text') {
                setProgress({ status: `Extracting text from page ${i}...`, progress: Math.round(m.progress * 100) });
              }
            }
          }
        );
        
        fullText += `--- Page ${i} ---\n\n${text}\n\n`;
      }
      
      setResultText(fullText);
      setProgress(null);
    } catch (error) {
      console.error("Error performing OCR:", error);
      alert("Failed to extract text. Please try again.");
      setProgress(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadText = () => {
    if (!resultText) return;
    const blob = new Blob([resultText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${file?.name.replace('.pdf', '')}_ocr.txt`;
    link.click();
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/pdf-tools" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to PDF Tools
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">OCR PDF</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Extract text from scanned PDF documents.</p>
        </div>

        {/* Hidden canvas for rendering */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {!file ? (
          <Card>
            <CardHeader>
              <CardTitle>Upload PDF File</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-violet-500 bg-violet-50/50 dark:bg-violet-900/20' : 'border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 text-zinc-400 mb-4" />
                <p className="text-lg font-medium text-center">Drag & drop a PDF file here, or click to select</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Extract Text</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => { setFile(null); setResultText(""); }}>Change File</Button>
                    {!resultText && (
                      <Button onClick={performOcr} disabled={isProcessing}>
                        {isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</> : <><Search className="w-4 h-4 mr-2" /> Start OCR</>}
                      </Button>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isProcessing && progress && (
                  <div className="py-8 flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-violet-500" />
                    <div className="text-center">
                      <p className="font-medium">{progress.status}</p>
                      {progress.progress > 0 && (
                        <div className="w-64 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
                          <div 
                            className="h-full bg-violet-500 transition-all duration-300" 
                            style={{ width: `${progress.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {resultText && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-lg">Extracted Text</h3>
                      <Button onClick={downloadText} variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" /> Download as TXT
                      </Button>
                    </div>
                    <Textarea 
                      value={resultText} 
                      readOnly 
                      className="min-h-[400px] font-mono text-sm"
                    />
                  </div>
                )}
                
                {!isProcessing && !resultText && (
                  <div className="text-center py-12 text-zinc-500">
                    <Search className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p>Click "Start OCR" to extract text from this document.</p>
                    <p className="text-sm mt-2">Note: This happens entirely in your browser and may take a few minutes for large documents.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
