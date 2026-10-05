import React, { useState, useRef } from "react";
import { Upload, Download, Loader2, Image as ImageIcon, ArrowLeft, Eraser } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { removeBackground } from "@imgly/background-removal";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";

export function RemoveBackground() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setProgress(0);
    }
  };

  const processImage = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(0);
    
    // Suppress expected ONNX WASM warnings in this environment
    const originalWarn = console.warn;
    console.warn = (...args) => {
      const msg = args[0];
      if (typeof msg === 'string' && (msg.includes('env.wasm.numThreads') || msg.includes('multi-threading is not supported'))) {
        return;
      }
      originalWarn(...args);
    };

    try {
      const blob = await removeBackground(file, {
        model: "isnet_fp16", // Use fp16 model for faster, smarter processing
        debug: false,
        progress: (key, current, total) => {
          if (total > 0) {
            setProgress(Math.round((current / total) * 100));
          }
        }
      });
      setResult(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error removing background:", error);
      alert("Failed to remove background. Please try again.");
    } finally {
      console.warn = originalWarn;
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = result;
    link.download = `nobg_${file?.name || "image.png"}`;
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
          <h1 className="text-3xl font-bold tracking-tight">Remove Background</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Automatically remove the background from any image.</p>
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
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video max-w-3xl mx-auto rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  {result && preview ? (
                    <BeforeAfterSlider beforeImage={preview} afterImage={result} />
                  ) : preview ? (
                    <img src={preview} alt="Original" className="w-full h-full object-contain" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-zinc-400" />
                  )}
                </div>
                <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
                  <Button onClick={processImage} disabled={isProcessing} className="flex-1">
                    {isProcessing ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing ({progress}%)...</>
                    ) : (
                      <><Eraser className="w-4 h-4 mr-2" /> Remove Background</>
                    )}
                  </Button>
                  {result && (
                    <Button onClick={downloadImage} variant="secondary" className="flex-1">
                      <Download className="w-4 h-4 mr-2" /> Download PNG
                    </Button>
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
