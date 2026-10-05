import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, Stamp, Loader2, Download, File as FileIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PDFDocument, rgb, degrees } from "pdf-lib";

export function WatermarkPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState<string>("CONFIDENTIAL");

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

  const addWatermark = async () => {
    if (!file || !watermarkText) return;
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      
      pages.forEach((page) => {
        const { width, height } = page.getSize();
        page.drawText(watermarkText, {
          x: width / 2 - (watermarkText.length * 15),
          y: height / 2,
          size: 60,
          color: rgb(0.8, 0.2, 0.2),
          opacity: 0.3,
          rotate: degrees(45),
        });
      });
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error adding watermark:", error);
      alert("Failed to add watermark. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPdf = () => {
    if (!resultUrl) return;
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = `watermarked_${file?.name || "document.pdf"}`;
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
          <h1 className="text-3xl font-bold tracking-tight">Watermark PDF</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Stamp an image or text over your PDF in seconds.</p>
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
                  isDragActive ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-900/20' : 'border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
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

                <div className="space-y-2">
                  <label className="text-sm font-medium">Watermark Text</label>
                  <Input 
                    value={watermarkText} 
                    onChange={(e) => setWatermarkText(e.target.value)} 
                    placeholder="e.g. CONFIDENTIAL"
                  />
                  <p className="text-xs text-zinc-500">
                    This text will be stamped diagonally across every page.
                  </p>
                </div>

                <Button onClick={addWatermark} disabled={isProcessing || !watermarkText} className="w-full">
                  {isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</> : <><Stamp className="w-4 h-4 mr-2" /> Add Watermark</>}
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
                      <Stamp className="w-8 h-8" />
                    </div>
                    <p className="font-medium text-center">Watermark added successfully!</p>
                    <Button onClick={downloadPdf} className="w-full sm:w-auto">
                      <Download className="w-4 h-4 mr-2" /> Download PDF
                    </Button>
                  </div>
                ) : (
                  <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-zinc-500">
                    <Stamp className="w-12 h-12 mb-2 opacity-20" />
                    <p>Watermarked file will appear here</p>
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
