import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, Loader2, GitCompare } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as pdfjsLib from "pdfjs-dist";
import pixelmatch from 'pixelmatch';

// Set up pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

export function ComparePdf() {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [diffUrl, setDiffUrl] = useState<string | null>(null);
  const [diffPixels, setDiffPixels] = useState<number | null>(null);
  
  const canvas1Ref = useRef<HTMLCanvasElement>(null);
  const canvas2Ref = useRef<HTMLCanvasElement>(null);
  const diffCanvasRef = useRef<HTMLCanvasElement>(null);

  const onDrop1 = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile1(acceptedFiles[0]);
      setDiffUrl(null);
    }
  };

  const onDrop2 = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile2(acceptedFiles[0]);
      setDiffUrl(null);
    }
  };

  const { getRootProps: getRootProps1, getInputProps: getInputProps1, isDragActive: isDragActive1 } = useDropzone({
    onDrop: onDrop1,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  } as any);

  const { getRootProps: getRootProps2, getInputProps: getInputProps2, isDragActive: isDragActive2 } = useDropzone({
    onDrop: onDrop2,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  } as any);

  const comparePdfs = async () => {
    if (!file1 || !file2 || !canvas1Ref.current || !canvas2Ref.current || !diffCanvasRef.current) return;
    setIsProcessing(true);
    setDiffUrl(null);
    
    try {
      // Load both PDFs
      const arrayBuffer1 = await file1.arrayBuffer();
      const arrayBuffer2 = await file2.arrayBuffer();
      
      const pdf1 = await pdfjsLib.getDocument({ data: arrayBuffer1 }).promise;
      const pdf2 = await pdfjsLib.getDocument({ data: arrayBuffer2 }).promise;
      
      // Compare only the first page for simplicity
      const page1 = await pdf1.getPage(1);
      const page2 = await pdf2.getPage(1);
      
      const viewport1 = page1.getViewport({ scale: 1.5 });
      const viewport2 = page2.getViewport({ scale: 1.5 });
      
      // Use the max dimensions
      const width = Math.max(viewport1.width, viewport2.width);
      const height = Math.max(viewport1.height, viewport2.height);
      
      const canvas1 = canvas1Ref.current;
      const canvas2 = canvas2Ref.current;
      const diffCanvas = diffCanvasRef.current;
      
      canvas1.width = width;
      canvas1.height = height;
      canvas2.width = width;
      canvas2.height = height;
      diffCanvas.width = width;
      diffCanvas.height = height;
      
      const ctx1 = canvas1.getContext('2d');
      const ctx2 = canvas2.getContext('2d');
      const diffCtx = diffCanvas.getContext('2d');
      
      if (!ctx1 || !ctx2 || !diffCtx) throw new Error("Could not get canvas context");
      
      // Fill with white background
      ctx1.fillStyle = 'white';
      ctx1.fillRect(0, 0, width, height);
      ctx2.fillStyle = 'white';
      ctx2.fillRect(0, 0, width, height);
      
      // Render pages
      // @ts-ignore
      await page1.render({ canvasContext: ctx1, viewport: viewport1 }).promise;
      // @ts-ignore
      await page2.render({ canvasContext: ctx2, viewport: viewport2 }).promise;
      
      // Get image data
      const img1 = ctx1.getImageData(0, 0, width, height);
      const img2 = ctx2.getImageData(0, 0, width, height);
      const diffImg = diffCtx.createImageData(width, height);
      
      // Compare
      const numDiffPixels = pixelmatch(img1.data, img2.data, diffImg.data, width, height, { threshold: 0.1 });
      
      // Draw diff
      diffCtx.putImageData(diffImg, 0, 0);
      
      setDiffPixels(numDiffPixels);
      setDiffUrl(diffCanvas.toDataURL('image/png'));
      
    } catch (error) {
      console.error("Error comparing PDFs:", error);
      alert("Failed to compare PDFs. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-6xl mx-auto space-y-6">
        <Link to="/pdf-tools" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to PDF Tools
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compare PDF</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Visually compare the first page of two PDF documents.</p>
        </div>

        {/* Hidden canvases for rendering */}
        <div style={{ display: 'none' }}>
          <canvas ref={canvas1Ref} />
          <canvas ref={canvas2Ref} />
          <canvas ref={diffCanvasRef} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Original PDF</CardTitle>
            </CardHeader>
            <CardContent>
              {!file1 ? (
                <div 
                  {...getRootProps1()} 
                  className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    isDragActive1 ? 'border-pink-500 bg-pink-50/50 dark:bg-pink-900/20' : 'border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                  }`}
                >
                  <input {...getInputProps1()} />
                  <Upload className="w-12 h-12 text-zinc-400 mb-4" />
                  <p className="text-lg font-medium text-center">Upload Original PDF</p>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                  <div className="truncate pr-4 font-medium">{file1.name}</div>
                  <Button variant="outline" size="sm" onClick={() => { setFile1(null); setDiffUrl(null); }}>Change</Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Modified PDF</CardTitle>
            </CardHeader>
            <CardContent>
              {!file2 ? (
                <div 
                  {...getRootProps2()} 
                  className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    isDragActive2 ? 'border-pink-500 bg-pink-50/50 dark:bg-pink-900/20' : 'border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                  }`}
                >
                  <input {...getInputProps2()} />
                  <Upload className="w-12 h-12 text-zinc-400 mb-4" />
                  <p className="text-lg font-medium text-center">Upload Modified PDF</p>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                  <div className="truncate pr-4 font-medium">{file2.name}</div>
                  <Button variant="outline" size="sm" onClick={() => { setFile2(null); setDiffUrl(null); }}>Change</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {file1 && file2 && !diffUrl && (
          <div className="flex justify-center">
            <Button size="lg" onClick={comparePdfs} disabled={isProcessing} className="w-full max-w-md">
              {isProcessing ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Comparing...</> : <><GitCompare className="w-5 h-5 mr-2" /> Compare Documents</>}
            </Button>
          </div>
        )}

        {diffUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Comparison Result</span>
                <span className={`text-sm px-3 py-1 rounded-full ${diffPixels === 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {diffPixels === 0 ? 'Identical' : `${diffPixels} pixels different`}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg p-4 flex justify-center overflow-auto">
                <img src={diffUrl} alt="Diff" className="max-w-full border shadow-sm" style={{ maxHeight: '70vh' }} />
              </div>
              <p className="text-center text-sm text-zinc-500 mt-4">
                Differences are highlighted in red.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
