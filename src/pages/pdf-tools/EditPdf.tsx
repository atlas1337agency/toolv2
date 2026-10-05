import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, Loader2, Download, Edit3, Type, Trash2, Eraser } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

interface TextAnnotation {
  id: string;
  type: 'text' | 'whiteout';
  text?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  page: number;
  fontSize?: number;
  color?: string;
}

export function EditPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [annotations, setAnnotations] = useState<TextAnnotation[]>([]);
  
  const [mode, setMode] = useState<'view' | 'text' | 'whiteout'>('view');
  const [currentText, setCurrentText] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [textColor, setTextColor] = useState("#000000");
  const [whiteoutSize, setWhiteoutSize] = useState({ width: 100, height: 20 });
  
  const containerRef = useRef<HTMLDivElement>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setResultUrl(null);
      setNumPages(null);
      setCurrentPage(1);
      setAnnotations([]);
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

  const handleContainerClick = (e: React.MouseEvent) => {
    if ((mode !== 'text' && mode !== 'whiteout') || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const newAnnotation: TextAnnotation = mode === 'text' ? {
      id: Math.random().toString(36).substring(7),
      type: 'text',
      text: currentText || "New Text",
      x,
      y,
      page: currentPage,
      fontSize,
      color: textColor
    } : {
      id: Math.random().toString(36).substring(7),
      type: 'whiteout',
      x,
      y,
      width: whiteoutSize.width,
      height: whiteoutSize.height,
      page: currentPage,
    };
    
    setAnnotations(prev => [...prev, newAnnotation]);
    setMode('view');
  };

  const removeAnnotation = (id: string) => {
    setAnnotations(prev => prev.filter(a => a.id !== id));
  };

  const updateAnnotationText = (id: string, text: string) => {
    setAnnotations(prev => prev.map(a => a.id === id ? { ...a, text } : a));
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : { r: 0, g: 0, b: 0 };
  };

  const saveEditedPdf = async () => {
    if (!file || annotations.length === 0) return;
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();
      
      for (const annotation of annotations) {
        const page = pages[annotation.page - 1];
        const { width, height } = page.getSize();
        
        if (annotation.type === 'text' && annotation.text && annotation.color && annotation.fontSize) {
          const color = hexToRgb(annotation.color);
          page.drawText(annotation.text, {
            x: (annotation.x / 100) * width,
            y: height - ((annotation.y / 100) * height) - annotation.fontSize, // Adjust for font baseline
            size: annotation.fontSize,
            font: helveticaFont,
            color: rgb(color.r, color.g, color.b),
          });
        } else if (annotation.type === 'whiteout' && annotation.width && annotation.height) {
          page.drawRectangle({
            x: (annotation.x / 100) * width,
            y: height - ((annotation.y / 100) * height) - annotation.height,
            width: annotation.width,
            height: annotation.height,
            color: rgb(1, 1, 1), // White
          });
        }
      }
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error editing PDF:", error);
      alert("Failed to edit PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link to="/pdf-tools" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to PDF Tools
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit PDF</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Add text annotations to your PDF document.</p>
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
                  isDragActive ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 text-zinc-400 mb-4" />
                <p className="text-lg font-medium text-center">Drag & drop a PDF file here, or click to select</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <span>Page {currentPage} of {numPages || '?'}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1}>Prev</Button>
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(numPages || 1, p + 1))} disabled={currentPage >= (numPages || 1)}>Next</Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant={mode === 'text' ? 'default' : 'outline'} 
                        size="sm" 
                        onClick={() => setMode(mode === 'text' ? 'view' : 'text')}
                      >
                        <Type className="w-4 h-4 mr-2" /> Add Text
                      </Button>
                      <Button 
                        variant={mode === 'whiteout' ? 'default' : 'outline'} 
                        size="sm" 
                        onClick={() => setMode(mode === 'whiteout' ? 'view' : 'whiteout')}
                        className={mode === 'whiteout' ? 'bg-red-600 hover:bg-red-700' : ''}
                      >
                        <Eraser className="w-4 h-4 mr-2" /> Whiteout
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center bg-zinc-100 dark:bg-zinc-900 rounded-lg p-4 overflow-hidden relative">
                  <div 
                    ref={containerRef}
                    className={`relative inline-block ${mode === 'text' ? 'cursor-crosshair' : mode === 'whiteout' ? 'cursor-crosshair' : ''}`}
                    onClick={handleContainerClick}
                  >
                    <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                      <Page pageNumber={currentPage} width={600} renderTextLayer={false} renderAnnotationLayer={false} />
                    </Document>
                    
                    {/* Render annotations for current page */}
                    {annotations.filter(a => a.page === currentPage).map((annotation) => (
                      <div 
                        key={annotation.id}
                        className="absolute group"
                        style={{
                          left: `${annotation.x}%`,
                          top: `${annotation.y}%`,
                          transform: annotation.type === 'text' ? 'translateY(-100%)' : 'translateY(-100%)', // Align bottom to click point
                          width: annotation.type === 'whiteout' ? `${annotation.width}px` : 'auto',
                          height: annotation.type === 'whiteout' ? `${annotation.height}px` : 'auto',
                          backgroundColor: annotation.type === 'whiteout' ? 'white' : 'transparent',
                          border: annotation.type === 'whiteout' ? '1px solid #e5e7eb' : 'none',
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {annotation.type === 'text' ? (
                          <input 
                            type="text"
                            value={annotation.text}
                            onChange={(e) => updateAnnotationText(annotation.id, e.target.value)}
                            className="bg-transparent border border-transparent hover:border-indigo-500 focus:border-indigo-500 focus:bg-white/90 dark:focus:bg-zinc-900/90 outline-none px-1 rounded"
                            style={{
                              fontSize: `${annotation.fontSize}px`,
                              color: annotation.color,
                              minWidth: '100px'
                            }}
                            autoFocus
                          />
                        ) : (
                          <div className="w-full h-full bg-white flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity">
                            <Eraser className="w-4 h-4 text-zinc-400 opacity-0 group-hover:opacity-100" />
                          </div>
                        )}
                        <button 
                          className="absolute -top-6 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          onClick={() => removeAnnotation(annotation.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {mode === 'text' && (
                    <div className="space-y-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
                      <h3 className="font-medium text-indigo-900 dark:text-indigo-100 flex items-center">
                        <Type className="w-4 h-4 mr-2" /> Text Settings
                      </h3>
                      <p className="text-xs text-indigo-700 dark:text-indigo-300">Click anywhere on the document to add text.</p>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Default Text</label>
                        <Input 
                          value={currentText} 
                          onChange={(e) => setCurrentText(e.target.value)} 
                          placeholder="Enter text..."
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Size</label>
                          <Input 
                            type="number" 
                            value={fontSize} 
                            onChange={(e) => setFontSize(Number(e.target.value))} 
                            min={8} max={72}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Color</label>
                          <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                            <input 
                              type="color" 
                              value={textColor} 
                              onChange={(e) => setTextColor(e.target.value)} 
                              className="w-full h-full border-0 p-0 bg-transparent cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {mode === 'whiteout' && (
                    <div className="space-y-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
                      <h3 className="font-medium text-red-900 dark:text-red-100 flex items-center">
                        <Eraser className="w-4 h-4 mr-2" /> Whiteout Settings
                      </h3>
                      <p className="text-xs text-red-700 dark:text-red-300">Click anywhere to place a white box over existing text.</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Width</label>
                          <Input 
                            type="number" 
                            value={whiteoutSize.width} 
                            onChange={(e) => setWhiteoutSize(prev => ({ ...prev, width: Number(e.target.value) }))} 
                            min={10} max={500}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Height</label>
                          <Input 
                            type="number" 
                            value={whiteoutSize.height} 
                            onChange={(e) => setWhiteoutSize(prev => ({ ...prev, height: Number(e.target.value) }))} 
                            min={10} max={500}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Annotations ({annotations.length})</h3>
                    {annotations.length === 0 ? (
                      <p className="text-sm text-zinc-500">No annotations added yet.</p>
                    ) : (
                      <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2">
                        {annotations.map(a => (
                          <div key={a.id} className="flex items-center justify-between text-sm p-2 bg-zinc-100 dark:bg-zinc-900 rounded">
                            <span className="truncate max-w-[120px]">
                              {a.type === 'text' ? `"${a.text}"` : 'Whiteout Box'}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-zinc-500">Pg {a.page}</span>
                              <button 
                                onClick={() => removeAnnotation(a.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t">
                    {!resultUrl ? (
                      <Button 
                        className="w-full" 
                        onClick={saveEditedPdf} 
                        disabled={isProcessing || annotations.length === 0}
                      >
                        {isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Edit3 className="w-4 h-4 mr-2" /> Save PDF</>}
                      </Button>
                    ) : (
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white" 
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = resultUrl;
                          link.download = `edited_${file?.name || "document.pdf"}`;
                          link.click();
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" /> Download Edited PDF
                      </Button>
                    )}
                  </div>
                  
                  <Button variant="ghost" className="w-full" onClick={() => { setFile(null); setResultUrl(null); setAnnotations([]); }}>
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
