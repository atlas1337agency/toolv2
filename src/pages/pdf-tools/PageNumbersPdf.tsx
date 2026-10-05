import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, Hash, Loader2, Download, File as FileIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PDFDocument, rgb } from "pdf-lib";

export function PageNumbersPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [position, setPosition] = useState<"bottom-center" | "bottom-right">("bottom-center");

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setResultUrl(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  } as any);

  const addPageNumbers = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      
      pages.forEach((page, index) => {
        const { width, height } = page.getSize();
        const text = `${index + 1}`;
        
        let x = width / 2 - 5;
        let y = 30;
        
        if (position === "bottom-right") {
          x = width - 40;
        }
        
        page.drawText(text, {
          x,
          y,
          size: 12,
          color: rgb(0, 0, 0),
        });
      });
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error adding page numbers:", error);
      alert("Failed to add page numbers. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPdf = () => {
    if (!resultUrl) return;
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = `numbered_${file?.name || "document.pdf"}`;
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
          <h1 className="text-3xl font-bold tracking-tight">Add Page Numbers</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Add page numbers into PDFs with ease.</p>
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
                  isDragActive ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : 'border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 text-zinc-400 mb-4" />
                <p className="text-lg font-medium text-center">Drag & drop a PDF file here, or click to select</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Selected File</span>
                  <Button variant="ghost" size="sm" onClick={() => { setFile(null); setResultUrl(null); }}>Change File</Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-3 p-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                  <FileIcon className="w-8 h-8 text-red-500" />
                  <div className="overflow-hidden">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-xs text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium">Position</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant={position === "bottom-center" ? "default" : "outline"} 
                      onClick={() => setPosition("bottom-center")}
                    >
                      Bottom Center
                    </Button>
                    <Button 
                      variant={position === "bottom-right" ? "default" : "outline"} 
                      onClick={() => setPosition("bottom-right")}
                    >
                      Bottom Right
                    </Button>
                  </div>
                </div>

                <Button onClick={addPageNumbers} disabled={isProcessing} className="w-full">
                  {isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</> : <><Hash className="w-4 h-4 mr-2" /> Add Page Numbers</>}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Result</CardTitle>
              </CardHeader>
              <CardContent>
                {resultUrl ? (
                  <div className="h-full min-h-[200px] flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-2">
                      <Hash className="w-8 h-8" />
                    </div>
                    <p className="font-medium text-center">Page numbers added successfully!</p>
                    <Button onClick={downloadPdf} className="w-full sm:w-auto">
                      <Download className="w-4 h-4 mr-2" /> Download PDF
                    </Button>
                  </div>
                ) : (
                  <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-zinc-500">
                    <Hash className="w-12 h-12 mb-2 opacity-20" />
                    <p>Numbered file will appear here</p>
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
