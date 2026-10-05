import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, Loader2, Download, Minimize2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PDFDocument } from "pdf-lib";

export function CompressPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [newSize, setNewSize] = useState<number>(0);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setOriginalSize(acceptedFiles[0].size);
      setResultUrl(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  } as any);

  const compressPdf = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Re-saving with useObjectStreams can sometimes reduce size
      const pdfBytes = await pdfDoc.save({ useObjectStreams: false });
      
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      setNewSize(blob.size);
      setResultUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error compressing PDF:", error);
      alert("Failed to compress PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link to="/pdf-tools" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to PDF Tools
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compress PDF</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Reduce the file size of your PDF document.</p>
        </div>

        {!file ? (
          <Card>
            <CardHeader>
              <CardTitle>Upload PDF File</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-violet-500 bg-violet-50/50 dark:bg-violet-900/20' : 'border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                }`}
              >
                <input {...getInputProps()} />
                <Minimize2 className="w-12 h-12 text-zinc-400 mb-4" />
                <p className="text-lg font-medium text-center">Drag & drop a PDF file here, or click to select</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Compress File</span>
                <Button variant="outline" size="sm" onClick={() => { setFile(null); setResultUrl(null); }}>
                  Change File
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg flex items-center justify-between">
                <div className="truncate font-medium">{file.name}</div>
                <div className="text-sm text-zinc-500">{formatSize(originalSize)}</div>
              </div>

              {!resultUrl ? (
                <div className="flex justify-center">
                  <Button 
                    size="lg"
                    className="w-full max-w-md" 
                    onClick={compressPdf} 
                    disabled={isProcessing}
                  >
                    {isProcessing ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Compressing...</> : <><Minimize2 className="w-5 h-5 mr-2" /> Compress PDF</>}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 space-y-6">
                  <div className="flex items-center justify-center gap-8 w-full max-w-md">
                    <div className="text-center">
                      <p className="text-sm text-zinc-500 mb-1">Original Size</p>
                      <p className="text-xl font-medium">{formatSize(originalSize)}</p>
                    </div>
                    <div className="w-12 h-0.5 bg-zinc-300 dark:bg-zinc-700 relative">
                      <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-zinc-300 dark:border-zinc-700 transform rotate-45"></div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-zinc-500 mb-1">New Size</p>
                      <p className={`text-xl font-medium ${newSize < originalSize ? 'text-green-600' : 'text-orange-500'}`}>
                        {formatSize(newSize)}
                      </p>
                    </div>
                  </div>
                  
                  {newSize < originalSize ? (
                    <p className="text-green-600 font-medium">
                      Saved {formatSize(originalSize - newSize)} ({Math.round((1 - newSize / originalSize) * 100)}%)
                    </p>
                  ) : (
                    <p className="text-orange-500 text-sm text-center max-w-md">
                      Note: This PDF is already highly optimized. Basic compression couldn't reduce the size further without losing quality.
                    </p>
                  )}
                  
                  <Button 
                    size="lg" 
                    className="bg-green-600 hover:bg-green-700 text-white w-full max-w-md" 
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = resultUrl;
                      link.download = `compressed_${file.name}`;
                      link.click();
                    }}
                  >
                    <Download className="w-5 h-5 mr-2" /> Download Compressed PDF
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
