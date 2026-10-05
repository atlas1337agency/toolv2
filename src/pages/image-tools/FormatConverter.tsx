import React, { useState, useRef } from "react";
import { Upload, Download, ArrowLeft, Image as ImageIcon, FileImage } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FormatConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>("image/jpeg");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const convertAndDownload = () => {
    if (!preview || !file) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Fill background with white for transparent images converted to JPG
      if (targetFormat === "image/jpeg") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(img, 0, 0);
      
      const ext = targetFormat.split("/")[1];
      const link = document.createElement("a");
      link.download = `converted_${file.name.split('.')[0]}.${ext}`;
      link.href = canvas.toDataURL(targetFormat, 0.9);
      link.click();
    };
    img.src = preview;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/image-tools" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Image Tools
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Format Converter</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Convert images between JPG, PNG, WEBP, and more.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
              <Upload className="w-12 h-12 text-zinc-400 mb-4" />
              <p className="text-lg font-medium">Click to upload or drag and drop</p>
              <p className="text-sm text-zinc-500 mt-1">Any image format</p>
            </div>
          </CardContent>
        </Card>

        {file && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <label className="text-sm font-medium">Select Target Format</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "JPG", value: "image/jpeg" },
                      { label: "PNG", value: "image/png" },
                      { label: "WEBP", value: "image/webp" },
                    ].map((format) => (
                      <Button
                        key={format.value}
                        variant={targetFormat === format.value ? "default" : "outline"}
                        onClick={() => setTargetFormat(format.value)}
                        className="w-full"
                      >
                        {format.label}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button onClick={convertAndDownload} className="w-full">
                  <FileImage className="w-4 h-4 mr-2" /> Convert & Download
                </Button>
                <canvas ref={canvasRef} className="hidden" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-zinc-400" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
