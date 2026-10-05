import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, SplitSquareHorizontal, Loader2, Download, File as FileIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PDFDocument } from "pdf-lib";

export function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrls, setResultUrls] = useState<{url: string, name: string}[]>([]);
  const [splitRanges, setSplitRanges] = useState<string>("1-2, 3-5");
  const [totalPages, setTotalPages] = useState<number>(0);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setResultUrls([]);
      
      // Get total pages
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        setTotalPages(pdf.getPageCount());
        setSplitRanges(`1-${Math.min(2, pdf.getPageCount())}`);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  } as any);

  const parseRanges = (rangesStr: string, maxPages: number) => {
    const ranges: {start: number, end: number}[] = [];
    const parts = rangesStr.split(',').map(p => p.trim());
    
    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr);
        const end = parseInt(endStr);
        if (!isNaN(start) && !isNaN(end) && start > 0 && end >= start && start <= maxPages) {
          ranges.push({ start: start - 1, end: Math.min(end - 1, maxPages - 1) });
        }
      } else {
        const page = parseInt(part);
        if (!isNaN(page) && page > 0 && page <= maxPages) {
          ranges.push({ start: page - 1, end: page - 1 });
        }
      }
    }
    return ranges;
  };

  const splitPdf = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const maxPages = sourcePdf.getPageCount();
      
      const ranges = parseRanges(splitRanges, maxPages);
      if (ranges.length === 0) {
        alert("Invalid page ranges. Please check your input.");
        setIsProcessing(false);
        return;
      }

      const newUrls: {url: string, name: string}[] = [];
      
      for (let i = 0; i < ranges.length; i++) {
        const range = ranges[i];
        const newPdf = await PDFDocument.create();
        
        const pageIndices = [];
        for (let p = range.start; p <= range.end; p++) {
          pageIndices.push(p);
        }
        
        const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);
        copiedPages.forEach((page) => {
          newPdf.addPage(page);
        });
        
        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        newUrls.push({
          url: URL.createObjectURL(blob),
          name: `${file.name.replace('.pdf', '')}_part${i+1}_pages${range.start+1}-${range.end+1}.pdf`
        });
      }
      
      setResultUrls(newUrls);
    } catch (error) {
      console.error("Error splitting PDF:", error);
      alert("Failed to split PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/pdf-tools" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to PDF Tools
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Split PDF</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Separate one page or a whole set for easy conversion into independent PDF files.</p>
        </div>

        {!file ? (
          <Card>
            <CardHeader>
              <CardTitle>Upload PDF File</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20' : 'border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 text-zinc-400 mb-4" />
                <p className="text-lg font-medium text-center">Drag & drop a PDF file here, or click to select</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Selected File</span>
                  <Button variant="ghost" size="sm" onClick={() => { setFile(null); setResultUrls([]); }}>Change File</Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                  <FileIcon className="w-8 h-8 text-red-500" />
                  <div className="overflow-hidden">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-xs text-zinc-500">{totalPages} pages • {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Custom Ranges</label>
                  <Input 
                    value={splitRanges} 
                    onChange={(e) => setSplitRanges(e.target.value)} 
                    placeholder="e.g. 1-3, 5, 8-10"
                  />
                  <p className="text-xs text-zinc-500">
                    Enter page ranges separated by commas. Each range will be a separate PDF file.
                  </p>
                </div>

                <Button onClick={splitPdf} disabled={isProcessing || !splitRanges} className="w-full">
                  {isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Splitting...</> : <><SplitSquareHorizontal className="w-4 h-4 mr-2" /> Split PDF</>}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Result Files</CardTitle>
              </CardHeader>
              <CardContent>
                {resultUrls.length > 0 ? (
                  <div className="space-y-3">
                    {resultUrls.map((res, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                        <span className="text-sm font-medium truncate mr-2" title={res.name}>{res.name}</span>
                        <Button size="sm" variant="secondary" onClick={() => {
                          const link = document.createElement("a");
                          link.href = res.url;
                          link.download = res.name;
                          link.click();
                        }}>
                          <Download className="w-4 h-4 mr-2" /> Save
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-zinc-500">
                    <SplitSquareHorizontal className="w-12 h-12 mb-2 opacity-20" />
                    <p>Split files will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
