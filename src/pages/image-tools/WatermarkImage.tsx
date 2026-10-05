import React, { useState, useRef, useEffect } from "react";
import { Upload, Download, ArrowLeft, Image as ImageIcon, Stamp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function WatermarkImage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState("© My Watermark");
  const [position, setPosition] = useState("bottom-right");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const drawWatermark = () => {
    if (!preview || !file) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw original image
      ctx.drawImage(img, 0, 0);
      
      // Setup watermark text
      const fontSize = Math.max(20, Math.floor(img.width * 0.05));
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
      ctx.lineWidth = Math.max(1, Math.floor(fontSize * 0.05));
      
      const metrics = ctx.measureText(watermarkText);
      const textWidth = metrics.width;
      const textHeight = fontSize;
      
      const padding = fontSize;
      let x = 0;
      let y = 0;
      
      switch (position) {
        case "top-left":
          x = padding;
          y = padding + textHeight;
          break;
        case "top-right":
          x = img.width - textWidth - padding;
          y = padding + textHeight;
          break;
        case "bottom-left":
          x = padding;
          y = img.height - padding;
          break;
        case "bottom-right":
          x = img.width - textWidth - padding;
          y = img.height - padding;
          break;
        case "center":
          x = (img.width - textWidth) / 2;
          y = (img.height + textHeight) / 2;
          break;
      }
      
      ctx.strokeText(watermarkText, x, y);
      ctx.fillText(watermarkText, x, y);
      
      const link = document.createElement("a");
      link.download = `watermarked_${file.name}`;
      link.href = canvas.toDataURL(file.type || "image/png");
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
          <h1 className="text-3xl font-bold tracking-tight">Watermark Image</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Add a text watermark to protect your images.</p>
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
                <CardTitle>Watermark Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Watermark Text</label>
                  <Input 
                    value={watermarkText} 
                    onChange={(e) => setWatermarkText(e.target.value)}
                    placeholder="Enter watermark text..."
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Position</label>
                  <select 
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                  >
                    <option value="top-left">Top Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="center">Center</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-right">Bottom Right</option>
                  </select>
                </div>

                <Button onClick={drawWatermark} className="w-full">
                  <Stamp className="w-4 h-4 mr-2" /> Apply & Download
                </Button>
                <canvas ref={canvasRef} className="hidden" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  {preview ? (
                    <>
                      <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                      {/* Simple visual preview overlaid on top */}
                      <div className={`absolute pointer-events-none text-white/70 font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] ${
                        position === 'top-left' ? 'top-4 left-4' :
                        position === 'top-right' ? 'top-4 right-4' :
                        position === 'bottom-left' ? 'bottom-4 left-4' :
                        position === 'bottom-right' ? 'bottom-4 right-4' :
                        'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl'
                      }`}>
                        {watermarkText}
                      </div>
                    </>
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
