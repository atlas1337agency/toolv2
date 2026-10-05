import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, Layers, Loader2, Download, Trash2, GripVertical } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PDFDocument } from "pdf-lib";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

export function OrganizePdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageOrder, setPageOrder] = useState<number[]>([]);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setResultUrl(null);
      setNumPages(null);
      setPageOrder([]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  } as any);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageOrder(Array.from({ length: numPages }, (_, i) => i));
  };

  const removePage = (indexToRemove: number) => {
    setPageOrder(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const movePage = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === pageOrder.length - 1)
    ) return;

    setPageOrder(prev => {
      const newOrder = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
      return newOrder;
    });
  };

  const organizePdf = async () => {
    if (!file || pageOrder.length === 0) return;
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();
      
      const copiedPages = await newPdf.copyPages(sourcePdf, pageOrder);
      copiedPages.forEach((page) => {
        newPdf.addPage(page);
      });
      
      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error organizing PDF:", error);
      alert("Failed to organize PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPdf = () => {
    if (!resultUrl) return;
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = `organized_${file?.name || "document.pdf"}`;
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
          <h1 className="text-3xl font-bold tracking-tight">Organize PDF</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Sort, delete, and reorder pages of your PDF file.</p>
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
                  isDragActive ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-900/20' : 'border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
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
                  <span>Organize Pages</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => { setFile(null); setResultUrl(null); }}>Change File</Button>
                    {!resultUrl && (
                      <Button onClick={organizePdf} disabled={isProcessing || pageOrder.length === 0}>
                        {isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</> : <><Layers className="w-4 h-4 mr-2" /> Apply Changes</>}
                      </Button>
                    )}
                    {resultUrl && (
                      <Button onClick={downloadPdf} variant="default" className="bg-green-600 hover:bg-green-700 text-white">
                        <Download className="w-4 h-4 mr-2" /> Download PDF
                      </Button>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="hidden">
                  <Document
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                  >
                  </Document>
                </div>

                {numPages === null ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
                    <span className="ml-2 text-zinc-500">Loading PDF...</span>
                  </div>
                ) : (
                  <Document file={file}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {pageOrder.map((originalPageIndex, currentIndex) => (
                        <div key={`${originalPageIndex}-${currentIndex}`} className="relative group border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow">
                          <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded z-10">
                            {currentIndex + 1}
                          </div>
                          
                          <div className="flex justify-center items-center h-40 bg-zinc-100 dark:bg-zinc-800 rounded overflow-hidden mb-2">
                            <Page 
                              pageNumber={originalPageIndex + 1} 
                              width={120} 
                              renderTextLayer={false} 
                              renderAnnotationLayer={false} 
                            />
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => movePage(currentIndex, 'up')} disabled={currentIndex === 0}>
                                ↑
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => movePage(currentIndex, 'down')} disabled={currentIndex === pageOrder.length - 1}>
                                ↓
                              </Button>
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50" onClick={() => removePage(currentIndex)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Document>
                )}
                
                {numPages !== null && pageOrder.length === 0 && (
                  <div className="text-center py-12 text-zinc-500">
                    <Trash2 className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p>All pages removed. Please add pages or upload a new file.</p>
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
