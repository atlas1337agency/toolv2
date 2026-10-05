import React, { useState, useRef, useEffect } from "react";
import { Upload, Download, ArrowLeft, Image as ImageIcon, Smile } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function MemeGenerator() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [topText, setTopText] = useState("TOP TEXT");
  const [bottomText, setBottomText] = useState("BOTTOM TEXT");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const drawMeme = () => {
    if (!preview || !file) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image
      ctx.drawImage(img, 0, 0);
      
      // Setup text style
      const fontSize = Math.max(20, Math.floor(img.width * 0.1));
      ctx.font = `bold ${fontSize}px Impact, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = Math.max(2, Math.floor(fontSize * 0.05));
      ctx.lineJoin = "round";
      
      // Draw top text
      if (topText) {
        ctx.textBaseline = "top";
        const text = topText.toUpperCase();
        ctx.strokeText(text, canvas.width / 2, 10);
        ctx.fillText(text, canvas.width / 2, 10);
      }
      
      // Draw bottom text
      if (bottomText) {
        ctx.textBaseline = "bottom";
        const text = bottomText.toUpperCase();
        ctx.strokeText(text, canvas.width / 2, canvas.height - 10);
        ctx.fillText(text, canvas.width / 2, canvas.height - 10);
      }
      
      const link = document.createElement("a");
      link.download = `meme_${file.name}`;
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
          <h1 className="text-3xl font-bold tracking-tight">Meme Generator</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Create custom memes with top and bottom text.</p>
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
                <CardTitle>Meme Text</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Top Text</label>
                  <Input 
                    value={topText} 
                    onChange={(e) => setTopText(e.target.value)}
                    placeholder="Enter top text..."
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bottom Text</label>
                  <Input 
                    value={bottomText} 
                    onChange={(e) => setBottomText(e.target.value)}
                    placeholder="Enter bottom text..."
                  />
                </div>

                <Button onClick={drawMeme} className="w-full">
                  <Smile className="w-4 h-4 mr-2" /> Generate & Download
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
                      <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
                        <div className="text-center w-full">
                          <span className="text-white font-black text-3xl sm:text-4xl uppercase tracking-wide" style={{ WebkitTextStroke: '2px black', textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000' }}>
                            {topText}
                          </span>
                        </div>
                        <div className="text-center w-full">
                          <span className="text-white font-black text-3xl sm:text-4xl uppercase tracking-wide" style={{ WebkitTextStroke: '2px black', textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000' }}>
                            {bottomText}
                          </span>
                        </div>
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
