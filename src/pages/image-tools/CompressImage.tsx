import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { Upload, Download, Loader2, Image as ImageIcon, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import imageCompression from "browser-image-compression";

export function CompressImage() {
  const [file, setFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [compressedPreview, setCompressedPreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setCompressedFile(null);
      setCompressedPreview(null);
    }
  };

  const compressImage = async () => {
    if (!file) return;
    setIsCompressing(true);
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressed = await imageCompression(file, options);
      setCompressedFile(compressed);
      setCompressedPreview(URL.createObjectURL(compressed));
    } catch (error) {
      console.error("Error compressing image:", error);
    } finally {
      setIsCompressing(false);
    }
  };

  const downloadImage = () => {
    if (!compressedFile) return;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(compressedFile);
    link.download = `compressed_${file?.name || "image.jpg"}`;
    link.click();
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/image-tools" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Image Tools
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compress Image</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Reduce file size while maintaining quality.</p>
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
              <p className="text-sm text-zinc-500 mt-1">JPG, PNG, SVG, GIF up to 10MB</p>
            </div>
          </CardContent>
        </Card>

        {file && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Original</span>
                  <span className="text-sm font-normal text-zinc-500">{formatSize(file.size)}</span>
                </CardTitle>
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
                  <Button onClick={compressImage} disabled={isCompressing} className="w-full">
                    {isCompressing ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Compressing...</>
                    ) : (
                      "Compress Image"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Compressed</span>
                  {compressedFile && (
                    <span className="text-sm font-normal text-green-600 dark:text-green-400">
                      {formatSize(compressedFile.size)} (-{Math.round((1 - compressedFile.size / file.size) * 100)}%)
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  {compressedPreview ? (
                    <img src={compressedPreview} alt="Compressed" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-zinc-400 text-sm">Preview will appear here</span>
                  )}
                </div>
                <div className="mt-4 flex justify-center">
                  <Button onClick={downloadImage} disabled={!compressedFile} variant="secondary" className="w-full">
                    <Download className="w-4 h-4 mr-2" /> Download
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
