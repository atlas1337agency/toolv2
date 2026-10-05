import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, Loader2, Download, Crop } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PDFDocument } from "pdf-lib";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

export function CropPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [cropRect, setCropRect] = useState<{x: number, y: number, width: number, height: number} | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setResultUrl(null);
      setNumPages(null);
      setCurrentPage(1);
      setCropRect(null);
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
    setCropRect({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = ((e.clientX - rect.left) / rect.width) * 100;
    const currentY = ((e.clientY - rect.top) / rect.height) * 100;
    
    setCropRect({
      x: Math.min(startPos.x, currentX),
      y: Math.min(startPos.y, currentY),
      width: Math.abs(currentX - startPos.x),
      height: Math.abs(currentY - startPos.y)
    });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const cropPdf = async () => {
    if (!file || !cropRect) return;
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      
      for (const page of pages) {
        const { width, height } = page.getSize();
        
        // Calculate crop box in PDF coordinates (bottom-left origin)
        const cropX = (cropRect.x / 100) * width;
        const cropY = height - ((cropRect.y / 100) * height) - ((cropRect.height / 100) * height);
        const cropWidth = (cropRect.width / 100) * width;
        const cropHeight = (cropRect.height / 100) * height;
        
        page.setCropBox(cropX, cropY, cropWidth, cropHeight);
      }
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error cropping PDF:", error);
      alert("Failed to crop PDF. Please try again.");
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
          <h1 className="text-3xl font-bold tracking-tight">Crop PDF</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Select an area to crop the margins of your PDF document.</p>
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
                  isDragActive ? 'border-fuchsia-500 bg-fuchsia-50/50 dark:bg-fuchsia-900/20' : 'border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
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
                    <span>Preview - Page {currentPage} of {numPages || '?'}</span>
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
                    
                    {/* Render current crop rectangle */}
                    {cropRect && (
                      <div 
                        className="absolute border-2 border-fuchsia-500 bg-fuchsia-500/10"
                        style={{
                          left: `${cropRect.x}%`,
                          top: `${cropRect.y}%`,
                          width: `${cropRect.width}%`,
                          height: `${cropRect.height}%`
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
                  <CardTitle>Crop Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    <p>Click and drag on the document preview to select the area you want to keep.</p>
                    <p className="mt-2 text-xs">Note: The crop will be applied to all pages in the document.</p>
                  </div>
                  
                  <div className="pt-4 border-t">
                    {!resultUrl ? (
                      <Button 
                        className="w-full" 
                        onClick={cropPdf} 
                        disabled={isProcessing || !cropRect || cropRect.width < 5 || cropRect.height < 5}
                      >
                        {isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Cropping...</> : <><Crop className="w-4 h-4 mr-2" /> Crop PDF</>}
                      </Button>
                    ) : (
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white" 
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = resultUrl;
                          link.download = `cropped_${file?.name || "document.pdf"}`;
                          link.click();
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" /> Download Cropped PDF
                      </Button>
                    )}
                  </div>
                  
                  <Button variant="ghost" className="w-full" onClick={() => { setFile(null); setResultUrl(null); setCropRect(null); }}>
                    Start Over
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
