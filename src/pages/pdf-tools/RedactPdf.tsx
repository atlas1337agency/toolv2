import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, Loader2, Download, ShieldAlert, Trash2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PDFDocument, rgb } from "pdf-lib";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

interface Redaction {
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
}

export function RedactPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [redactions, setRedactions] = useState<Redaction[]>([]);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentRect, setCurrentRect] = useState<{x: number, y: number, width: number, height: number} | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setResultUrl(null);
      setNumPages(null);
      setCurrentPage(1);
      setRedactions([]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  } as any);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setIsDrawing(true);
    setStartPos({ x, y });
    setCurrentRect({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = ((e.clientX - rect.left) / rect.width) * 100;
    const currentY = ((e.clientY - rect.top) / rect.height) * 100;
    
    setCurrentRect({
      x: Math.min(startPos.x, currentX),
      y: Math.min(startPos.y, currentY),
      width: Math.abs(currentX - startPos.x),
      height: Math.abs(currentY - startPos.y)
    });
  };

  const handleMouseUp = () => {
    if (isDrawing && currentRect && currentRect.width > 1 && currentRect.height > 1) {
      setRedactions(prev => [...prev, { ...currentRect, page: currentPage }]);
    }
    setIsDrawing(false);
    setCurrentRect(null);
  };

  const removeRedaction = (index: number) => {
    setRedactions(prev => prev.filter((_, i) => i !== index));
  };

  const redactPdf = async () => {
    if (!file || redactions.length === 0) return;
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      
      for (const redaction of redactions) {
        const page = pages[redaction.page - 1];
        const { width, height } = page.getSize();
        
        page.drawRectangle({
          x: (redaction.x / 100) * width,
          y: height - ((redaction.y / 100) * height) - ((redaction.height / 100) * height),
          width: (redaction.width / 100) * width,
          height: (redaction.height / 100) * height,
          color: rgb(0, 0, 0),
        });
      }
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error redacting PDF:", error);
      alert("Failed to redact PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/pdf-tools" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to PDF Tools
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Redact PDF</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Permanently remove sensitive information by drawing black boxes over text and images.</p>
        </div>

        {!file ? (
          <Card>
            <CardHeader>
              <CardTitle>Upload PDF File</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20' : 'border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 text-zinc-400 mb-4" />
                <p className="text-lg font-medium text-center">Drag & drop a PDF file here, or click to select</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Page {currentPage} of {numPages || '?'}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1}>Prev</Button>
                      <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(numPages || 1, p + 1))} disabled={currentPage >= (numPages || 1)}>Next</Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center bg-zinc-100 dark:bg-zinc-900 rounded-lg p-4 overflow-hidden relative">
                  <div 
                    ref={containerRef}
                    className="relative cursor-crosshair inline-block"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                      <Page pageNumber={currentPage} width={500} renderTextLayer={false} renderAnnotationLayer={false} />
                    </Document>
                    
                    {/* Render existing redactions for current page */}
                    {redactions.filter(r => r.page === currentPage).map((redaction, index) => (
                      <div 
                        key={index}
                        className="absolute bg-black/80 border border-black group"
                        style={{
                          left: `${redaction.x}%`,
                          top: `${redaction.y}%`,
                          width: `${redaction.width}%`,
                          height: `${redaction.height}%`
                        }}
                      >
                        <button 
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          onClick={(e) => { e.stopPropagation(); removeRedaction(redactions.indexOf(redaction)); }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    
                    {/* Render current drawing rectangle */}
                    {isDrawing && currentRect && (
                      <div 
                        className="absolute bg-black/40 border-2 border-black"
                        style={{
                          left: `${currentRect.x}%`,
                          top: `${currentRect.y}%`,
                          width: `${currentRect.width}%`,
                          height: `${currentRect.height}%`
                        }}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Redactions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    <p>Click and drag on the document preview to draw redaction boxes.</p>
                    <p className="mt-2 font-medium text-zinc-900 dark:text-zinc-100">Total redactions: {redactions.length}</p>
                  </div>
                  
                  <div className="pt-4 border-t">
                    {!resultUrl ? (
                      <Button 
                        className="w-full" 
                        onClick={redactPdf} 
                        disabled={isProcessing || redactions.length === 0}
                      >
                        {isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Redacting...</> : <><ShieldAlert className="w-4 h-4 mr-2" /> Apply Redactions</>}
                      </Button>
                    ) : (
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white" 
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = resultUrl;
                          link.download = `redacted_${file?.name || "document.pdf"}`;
                          link.click();
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" /> Download Redacted PDF
                      </Button>
                    )}
                  </div>
                  
                  <Button variant="ghost" className="w-full" onClick={() => { setFile(null); setResultUrl(null); setRedactions([]); }}>
                    <Trash2 className="w-4 h-4 mr-2" /> Start Over
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
