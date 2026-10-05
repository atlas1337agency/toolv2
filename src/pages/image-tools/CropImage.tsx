import React, { useState, useRef, useCallback } from "react";
import { Upload, Download, ArrowLeft, Crop as CropIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export function CropImage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 50,
    height: 50,
    x: 25,
    y: 25,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setCompletedCrop(null);
    }
  };

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop({
      unit: "%",
      width: 50,
      height: 50,
      x: 25,
      y: 25,
    });
  }, []);

  const downloadCroppedImage = async () => {
    if (!completedCrop || !imgRef.current || !preview) return;

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    ctx.imageSmoothingQuality = "high";

    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;

    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `cropped_${file?.name || "image.png"}`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }, file?.type || "image/png");
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/image-tools" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Image Tools
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Crop Image</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Select an area to crop your image.</p>
        </div>

        {!file ? (
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
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Crop Editor</CardTitle>
                <Button variant="outline" onClick={() => setFile(null)}>Change Image</Button>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="max-w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                  >
                    <img
                      ref={imgRef}
                      alt="Crop me"
                      src={preview!}
                      onLoad={onImageLoad}
                      className="max-h-[60vh] object-contain"
                    />
                  </ReactCrop>
                </div>
                <div className="mt-6 flex justify-center w-full max-w-sm">
                  <Button onClick={downloadCroppedImage} disabled={!completedCrop?.width || !completedCrop?.height} className="w-full">
                    <CropIcon className="w-4 h-4 mr-2" /> Crop & Download
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
