import React, { useState, useRef, useEffect } from "react";
import { Upload, Download, Image as ImageIcon, ArrowLeft, Maximize } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ResizeImage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [maintainRatio, setMaintainRatio] = useState(true);
  const [originalRatio, setOriginalRatio] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
      
      const img = new Image();
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
        setOriginalRatio(img.width / img.height);
      };
      img.src = url;
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value) || 0;
    setWidth(newWidth);
    if (maintainRatio && newWidth > 0) {
      setHeight(Math.round(newWidth / originalRatio));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value) || 0;
    setHeight(newHeight);
    if (maintainRatio && newHeight > 0) {
      setWidth(Math.round(newHeight * originalRatio));
    }
  };

  const downloadImage = () => {
    if (!preview || width <= 0 || height <= 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      const link = document.createElement("a");
      link.download = `resized_${file?.name || "image.png"}`;
      link.href = canvas.toDataURL(file?.type || "image/png");
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
          <h1 className="text-3xl font-bold tracking-tight">Resize Image</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Change the dimensions of your image.</p>
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
              <p className="text-sm text-zinc-500 mt-1">JPG, PNG, WEBP</p>
            </div>
          </CardContent>
        </Card>

        {file && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Resize Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Width (px)</label>
                    <input 
                      type="number" 
                      value={width || ""} 
                      onChange={handleWidthChange}
                      className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Height (px)</label>
                    <input 
                      type="number" 
                      value={height || ""} 
                      onChange={handleHeightChange}
                      className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="maintainRatio" 
                    checked={maintainRatio}
                    onChange={(e) => setMaintainRatio(e.target.checked)}
                    className="rounded border-zinc-300"
                  />
                  <label htmlFor="maintainRatio" className="text-sm">Maintain aspect ratio</label>
                </div>
                <Button onClick={downloadImage} className="w-full mt-4">
                  <Download className="w-4 h-4 mr-2" /> Download Resized Image
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
