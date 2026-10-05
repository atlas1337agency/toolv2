import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, Loader2, Download, PenTool, Trash2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PDFDocument } from "pdf-lib";
import { Document, Page, pdfjs } from 'react-pdf';
import SignatureCanvas from 'react-signature-canvas';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

export function SignPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [signaturePos, setSignaturePos] = useState({ x: 50, y: 50 });
  const [signatureScale, setSignatureScale] = useState(0.5);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const sigCanvas = useRef<SignatureCanvas>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setResultUrl(null);
      setNumPages(null);
      setCurrentPage(1);
      setSignatureImage(null);
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

  const saveSignature = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      setSignatureImage(sigCanvas.current.getCanvas().toDataURL('image/png'));
      setIsDrawing(false);
    }
  };

  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
    setSignatureImage(null);
  };

  const signPdf = async () => {
    if (!file || !signatureImage) return;
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      const sigImageBytes = await fetch(signatureImage).then(res => res.arrayBuffer());
      const sigImage = await pdfDoc.embedPng(sigImageBytes);
      
      const pages = pdfDoc.getPages();
      const page = pages[currentPage - 1];
      
      // Calculate position (simplified, assuming standard page size)
      const { width, height } = page.getSize();
      
      // Scale signature based on user input
      const sigDims = sigImage.scale(signatureScale);
      
      // Draw signature
      page.drawImage(sigImage, {
        x: (signaturePos.x / 100) * width - (sigDims.width / 2),
        y: height - ((signaturePos.y / 100) * height) - (sigDims.height / 2),
        width: sigDims.width,
        height: sigDims.height,
      });
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error signing PDF:", error);
      alert("Failed to sign PDF. Please try again.");
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
          <h1 className="text-3xl font-bold tracking-tight">Sign PDF</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Draw your signature and add it to your PDF.</p>
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
                  isDragActive ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-900/20' : 'border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
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
                <CardContent className="flex justify-center bg-zinc-100 dark:bg-zinc-900 rounded-lg p-4 overflow-hidden relative min-h-[500px]">
                  <div className="relative inline-block shadow-lg" id="pdf-page-container">
                    <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                      <Page pageNumber={currentPage} width={500} renderTextLayer={false} renderAnnotationLayer={false} />
                    </Document>
                    
                    {/* Signature Overlay */}
                    {signatureImage && (
                      <div 
                        className="absolute border-2 border-dashed border-purple-500 bg-purple-500/10 cursor-move flex items-center justify-center"
                        style={{
                          left: `${signaturePos.x}%`,
                          top: `${signaturePos.y}%`,
                          transform: 'translate(-50%, -50%)',
                          width: `${200 * signatureScale}px`, // Approximate visual scaling
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          const container = document.getElementById('pdf-page-container');
                          if (!container) return;
                          
                          const rect = container.getBoundingClientRect();
                          
                          const onMouseMove = (moveEvent: MouseEvent) => {
                            const x = ((moveEvent.clientX - rect.left) / rect.width) * 100;
                            const y = ((moveEvent.clientY - rect.top) / rect.height) * 100;
                            
                            setSignaturePos({
                              x: Math.max(0, Math.min(100, x)),
                              y: Math.max(0, Math.min(100, y))
                            });
                          };
                          
                          const onMouseUp = () => {
                            document.removeEventListener('mousemove', onMouseMove);
                            document.removeEventListener('mouseup', onMouseUp);
                          };
                          
                          document.addEventListener('mousemove', onMouseMove);
                          document.addEventListener('mouseup', onMouseUp);
                        }}
                      >
                        <img src={signatureImage} alt="Signature" className="w-full h-auto pointer-events-none" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Signature</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!signatureImage || isDrawing ? (
                    <div className="space-y-4">
                      <div className="border rounded bg-white dark:bg-zinc-900">
                        <SignatureCanvas 
                          ref={sigCanvas} 
                          canvasProps={{ className: 'w-full h-40' }} 
                          backgroundColor="rgba(255,255,255,0)"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1" onClick={clearSignature}>Clear</Button>
                        <Button className="flex-1" onClick={saveSignature}>Save</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="border rounded p-4 bg-white dark:bg-zinc-900 flex justify-center">
                        <img src={signatureImage} alt="Signature" className="max-h-24" />
                      </div>
                      
                      <div className="space-y-2 pt-2">
                        <label className="text-sm font-medium">Signature Size</label>
                        <input 
                          type="range" 
                          min="0.1" 
                          max="1.5" 
                          step="0.05" 
                          value={signatureScale} 
                          onChange={(e) => setSignatureScale(parseFloat(e.target.value))}
                          className="w-full accent-purple-600"
                        />
                      </div>

                      <Button variant="outline" className="w-full" onClick={() => setIsDrawing(true)}>
                        <PenTool className="w-4 h-4 mr-2" /> Redraw Signature
                      </Button>
                      <p className="text-xs text-zinc-500 text-center">
                        Drag the signature on the document preview to position it.
                      </p>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t">
                    {!resultUrl ? (
                      <Button 
                        className="w-full" 
                        onClick={signPdf} 
                        disabled={isProcessing || !signatureImage}
                      >
                        {isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing...</> : <><PenTool className="w-4 h-4 mr-2" /> Sign Document</>}
                      </Button>
                    ) : (
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white" 
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = resultUrl;
                          link.download = `signed_${file?.name || "document.pdf"}`;
                          link.click();
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" /> Download Signed PDF
                      </Button>
                    )}
                  </div>
                  
                  <Button variant="ghost" className="w-full" onClick={() => { setFile(null); setResultUrl(null); setSignatureImage(null); }}>
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
