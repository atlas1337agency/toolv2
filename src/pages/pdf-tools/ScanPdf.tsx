import React, { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Camera, Loader2, Download, Trash2, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Webcam from "react-webcam";
import { PDFDocument } from "pdf-lib";

export function ScanPdf() {
  const [images, setImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setImages(prev => [...prev, imageSrc]);
      }
    }
  }, [webcamRef]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImages(prev => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setResultUrl(null);
  };

  const createPdf = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    
    try {
      const pdfDoc = await PDFDocument.create();
      
      for (const imageSrc of images) {
        const imageBytes = await fetch(imageSrc).then(res => res.arrayBuffer());
        
        let image;
        if (imageSrc.startsWith('data:image/jpeg')) {
          image = await pdfDoc.embedJpg(imageBytes);
        } else {
          image = await pdfDoc.embedPng(imageBytes);
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
      console.error("Error creating PDF from scans:", error);
      alert("Failed to create PDF. Please try again.");
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
          <h1 className="text-3xl font-bold tracking-tight">Scan to PDF</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Capture documents with your camera and convert them to PDF.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center gap-2">
                <span>Add Pages</span>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-1.5" /> Upload
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setIsCameraOpen(!isCameraOpen)}>
                    {isCameraOpen ? "Close Camera" : "Camera"}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isCameraOpen ? (
                <div className="space-y-4">
                  <div className="rounded-lg overflow-hidden bg-black aspect-video relative">
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={{ facingMode: "environment" }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button className="w-full" size="lg" onClick={capture}>
                    <Camera className="w-5 h-5 mr-2" /> Capture Document
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-zinc-500 border-2 border-dashed rounded-xl gap-3">
                  <Upload className="w-10 h-10 opacity-30" />
                  <div className="text-center">
                    <p className="font-medium text-sm text-zinc-700 dark:text-zinc-300">Upload photos or scan with camera</p>
                    <p className="text-xs text-zinc-500">Camera permission is not required to upload photos.</p>
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()}>
                    <Plus className="w-4 h-4 mr-1.5" /> Select Photos / Scans
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Scanned Pages ({images.length})</span>
                {images.length > 0 && !resultUrl && (
                  <Button size="sm" onClick={createPdf} disabled={isProcessing}>
                    {isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</> : "Create PDF"}
                  </Button>
                )}
                {resultUrl && (
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => {
                    const link = document.createElement("a");
                    link.href = resultUrl;
                    link.download = "scanned_document.pdf";
                    link.click();
                  }}>
                    <Download className="w-4 h-4 mr-2" /> Download
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {images.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                  <p>No pages scanned yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
                  {images.map((img, index) => (
                    <div key={index} className="relative group border rounded-lg overflow-hidden">
                      <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded z-10">
                        {index + 1}
                      </div>
                      <img src={img} alt={`Scan ${index + 1}`} className="w-full h-32 object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="destructive" size="icon" onClick={() => removeImage(index)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
