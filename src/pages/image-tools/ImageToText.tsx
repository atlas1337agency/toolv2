import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { Upload, Download, Loader2, Image as ImageIcon, Type, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Tesseract from "tesseract.js";

export function ImageToText() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [text, setText] = useState<string>("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setText("");
      setProgress(0);
    }
  };

  const extractText = async () => {
    if (!file) return;
    setIsExtracting(true);
    setProgress(0);
    try {
      const result = await Tesseract.recognize(
        file,
        'eng',
        { logger: m => {
            if(m.status === 'recognizing text') {
                setProgress(Math.round(m.progress * 100));
            }
        }}
      );
      setText(result.data.text);
    } catch (error) {
      console.error("Error extracting text:", error);
      setText("Error extracting text. Please try again.");
    } finally {
      setIsExtracting(false);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/image-tools" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Image Tools
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Image to Text</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Extract text from images using OCR.</p>
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
              <p className="text-sm text-zinc-500 mt-1">JPG, PNG, BMP</p>
            </div>
          </CardContent>
        </Card>

        {file && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Original Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  {preview ? (
                    <img src={preview} alt="Original" className="w-full h-full object-contain" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-zinc-400" />
                  )}
                </div>
                <div className="mt-4 flex justify-center">
                  <Button onClick={extractText} disabled={isExtracting} className="w-full">
                    {isExtracting ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Extracting ({progress}%)...</>
                    ) : (
                      <><Type className="w-4 h-4 mr-2" /> Extract Text</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Extracted Text</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={text} 
                  readOnly 
                  className="min-h-[200px] font-mono text-sm" 
                  placeholder="Extracted text will appear here..."
                />
                <div className="mt-4 flex justify-center">
                  <Button onClick={copyText} disabled={!text} variant="secondary" className="w-full">
                    Copy Text
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
