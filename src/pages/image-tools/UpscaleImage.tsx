import React, { useState, useRef } from "react";
import { Upload, Download, ArrowLeft, Image as ImageIcon, ZoomIn, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";

export function UpscaleImage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{width: number, height: number} | null>(null);
  const [scale, setScale] = useState<number>(2);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const generateUpscale = () => {
    if (!preview || !file) return;
    setIsProcessing(true);
    
    const canvas = canvasRef.current;
    if (!canvas) {
      setIsProcessing(false);
      return;
    }
    
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setIsProcessing(false);
      return;
    }

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      // Use high quality image smoothing for basic browser upscaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      setResult(canvas.toDataURL(file.type || "image/png", 1.0));
      setDimensions({ width: canvas.width, height: canvas.height });
      setIsProcessing(false);
    };
    img.onerror = () => setIsProcessing(false);
    img.src = preview;
  };

  const downloadImage = () => {
    if (!result) return;
    const link = document.createElement("a");
    link.download = `upscaled_${scale}x_${file?.name || "image.png"}`;
    link.href = result;
    link.click();
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/image-tools" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Image Tools
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upscale Image</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Increase the resolution of your images.</p>
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
                <CardTitle>Upscale Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <label className="text-sm font-medium">Select Scale Factor</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "2x", value: 2 },
                      { label: "3x", value: 3 },
                      { label: "4x", value: 4 },
                    ].map((factor) => (
                      <Button
                        key={factor.value}
                        variant={scale === factor.value ? "default" : "outline"}
                        onClick={() => setScale(factor.value)}
                        className="w-full"
                      >
                        {factor.label}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">
                    Note: This uses browser-based bicubic interpolation for fast, smart upscaling.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={generateUpscale} disabled={isProcessing} className="flex-1">
                    {isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Upscaling...</> : <><ZoomIn className="w-4 h-4 mr-2" /> Generate Preview</>}
                  </Button>
                  {result && (
                    <Button onClick={downloadImage} variant="secondary" className="flex-1">
                      <Download className="w-4 h-4 mr-2" /> Download
                    </Button>
                  )}
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview (Scroll to explore)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[500px] overflow-auto rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                  {result && preview && dimensions ? (
                    <div 
                      style={{ 
                        width: dimensions.width, 
                        height: dimensions.height 
                      }} 
                      className="relative m-auto"
                    >
                      <BeforeAfterSlider 
                        beforeImage={preview} 
                        afterImage={result} 
                        className="absolute inset-0 w-full h-full"
                        imageClassName="w-full h-full object-fill"
                      />
                    </div>
                  ) : preview ? (
                    <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain" />
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
