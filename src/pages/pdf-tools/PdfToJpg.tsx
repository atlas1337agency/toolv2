import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, Image as ImageIcon, Loader2, Download, File as FileIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as pdfjsLib from "pdfjs-dist";

// Set up pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

export function PdfToJpg() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrls, setResultUrls] = useState<{url: string, name: string}[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setResultUrls([]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  } as any);

  const convertToJpg = async () => {
    if (!file || !canvasRef.current) return;
    setIsProcessing(true);
    setResultUrls([]);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      
      const urls: {url: string, name: string}[] = [];
      
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality
        
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
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        urls.push({
          url: dataUrl,
          name: `${file.name.replace('.pdf', '')}_page_${i}.jpg`
        });
      }
      
      setResultUrls(urls);
    } catch (error) {
      console.error("Error converting PDF to JPG:", error);
      alert("Failed to convert PDF to JPG. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadAll = () => {
    resultUrls.forEach((result, index) => {
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = result.url;
        link.download = result.name;
        link.click();
      }, index * 200); // Stagger downloads slightly
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/pdf-tools" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to PDF Tools
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">PDF to JPG</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Convert each PDF page into a JPG image.</p>
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
                  isDragActive ? 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/20' : 'border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
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
                  <span>Selected File</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => { setFile(null); setResultUrls([]); }}>Change File</Button>
                    {resultUrls.length === 0 && (
                      <Button onClick={convertToJpg} disabled={isProcessing}>
                        {isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Converting...</> : <><ImageIcon className="w-4 h-4 mr-2" /> Convert to JPG</>}
                      </Button>
                    )}
                    {resultUrls.length > 0 && (
                      <Button onClick={downloadAll} variant="default" className="bg-green-600 hover:bg-green-700 text-white">
                        <Download className="w-4 h-4 mr-2" /> Download All Images
                      </Button>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg mb-6">
                  <FileIcon className="w-8 h-8 text-red-500" />
                  <div className="overflow-hidden">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-xs text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>

                {resultUrls.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {resultUrls.map((result, index) => (
                      <div key={index} className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-900">
                        <div className="aspect-[3/4] bg-zinc-100 dark:bg-zinc-800 relative">
                          <img 
                            src={result.url} 
                            alt={`Page ${index + 1}`} 
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            Page {index + 1}
                          </div>
                        </div>
                        <div className="p-2">
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="w-full"
                            onClick={() => {
                              const link = document.createElement("a");
                              link.href = result.url;
                              link.download = result.name;
                              link.click();
                            }}
                          >
                            <Download className="w-3 h-3 mr-2" /> Download
                          </Button>
                        </div>
                      </div>
                    ))}
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
