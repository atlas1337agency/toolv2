import React, { useState, useRef, useEffect } from "react";
import { Upload, Download, ArrowLeft, RotateCw, RotateCcw, FlipHorizontal, FlipVertical, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RotateImage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
    }
  };

  const rotateLeft = () => setRotation((prev) => prev - 90);
  const rotateRight = () => setRotation((prev) => prev + 90);
  const toggleFlipH = () => setFlipH((prev) => !prev);
  const toggleFlipV = () => setFlipV((prev) => !prev);

  const downloadImage = () => {
    if (!preview) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Calculate new dimensions based on rotation
      const rad = (rotation * Math.PI) / 180;
      const sin = Math.abs(Math.sin(rad));
      const cos = Math.abs(Math.cos(rad));
      
      const newWidth = img.width * cos + img.height * sin;
      const newHeight = img.width * sin + img.height * cos;

      canvas.width = newWidth;
      canvas.height = newHeight;

      // Move to center
      ctx.translate(newWidth / 2, newHeight / 2);
      
      // Rotate
      ctx.rotate(rad);
      
      // Flip
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

      // Draw image centered
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      
      const link = document.createElement("a");
      link.download = `rotated_${file?.name || "image.png"}`;
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
          <h1 className="text-3xl font-bold tracking-tight">Rotate Image</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Rotate and flip your images easily.</p>
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
                <CardTitle>Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" onClick={rotateLeft} className="flex flex-col h-auto py-4 gap-2">
                    <RotateCcw className="w-6 h-6" />
                    <span>Rotate Left</span>
                  </Button>
                  <Button variant="outline" onClick={rotateRight} className="flex flex-col h-auto py-4 gap-2">
                    <RotateCw className="w-6 h-6" />
                    <span>Rotate Right</span>
                  </Button>
                  <Button variant={flipH ? "default" : "outline"} onClick={toggleFlipH} className="flex flex-col h-auto py-4 gap-2">
                    <FlipHorizontal className="w-6 h-6" />
                    <span>Flip Horizontal</span>
                  </Button>
                  <Button variant={flipV ? "default" : "outline"} onClick={toggleFlipV} className="flex flex-col h-auto py-4 gap-2">
                    <FlipVertical className="w-6 h-6" />
                    <span>Flip Vertical</span>
                  </Button>
                </div>
                <Button onClick={downloadImage} className="w-full">
                  <Download className="w-4 h-4 mr-2" /> Download Image
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
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="max-w-full max-h-full object-contain transition-transform duration-300"
                      style={{ 
                        transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})` 
                      }}
                    />
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
