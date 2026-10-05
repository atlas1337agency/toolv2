import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, File as FileIcon, Trash2, Loader2, Download, Image as ImageIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PDFDocument } from "pdf-lib";

export function JpgToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    setResultUrl(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }
  } as any);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setResultUrl(null);
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === files.length - 1)
    ) return;

    setFiles(prev => {
      const newFiles = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
      return newFiles;
    });
    setResultUrl(null);
  };

  const convertToPdf = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    
    try {
      const pdfDoc = await PDFDocument.create();
      
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        let image;
        
        if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          image = await pdfDoc.embedJpg(arrayBuffer);
        } else if (file.type === 'image/png') {
          image = await pdfDoc.embedPng(arrayBuffer);
        } else {
          // For webp or others, we'd need to convert to canvas then to PNG/JPG first
          // This is a simplified version assuming JPG/PNG
          continue;
        }
        
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error converting images to PDF:", error);
      alert("Failed to convert images to PDF. Please ensure you are using JPG or PNG files.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPdf = () => {
    if (!resultUrl) return;
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = "converted_images.pdf";
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
          <h1 className="text-3xl font-bold tracking-tight">JPG to PDF</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Convert JPG and PNG images to PDF in seconds.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload Images</CardTitle>
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
              <p className="text-lg font-medium text-center">Drag & drop images here, or click to select</p>
              <p className="text-sm text-zinc-500 mt-1">Supports JPG and PNG</p>
            </div>
          </CardContent>
        </Card>

        {files.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Selected Images ({files.length})</span>
                {!resultUrl && (
                  <Button onClick={convertToPdf} disabled={isProcessing}>
                    {isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Converting...</> : <><FileIcon className="w-4 h-4 mr-2" /> Convert to PDF</>}
                  </Button>
                )}
                {resultUrl && (
                  <Button onClick={downloadPdf} variant="default" className="bg-green-600 hover:bg-green-700 text-white">
                    <Download className="w-4 h-4 mr-2" /> Download PDF
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={`${file.name}-${index}`} className="flex items-center justify-between p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <ImageIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <span className="font-medium truncate">{file.name}</span>
                      <span className="text-xs text-zinc-500 flex-shrink-0">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => moveFile(index, 'up')} disabled={index === 0} className="h-8 w-8">
                        ↑
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => moveFile(index, 'down')} disabled={index === files.length - 1} className="h-8 w-8">
                        ↓
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => removeFile(index)} className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
