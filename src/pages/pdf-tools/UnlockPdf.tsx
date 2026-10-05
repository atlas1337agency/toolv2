import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, Loader2, Download, Unlock } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PDFDocument } from "pdf-lib";

export function UnlockPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setResultUrl(null);
      setError(null);
      setPassword("");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  } as any);

  const unlockPdf = async () => {
    if (!file || !password) return;
    setIsProcessing(true);
    setError(null);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // Load the PDF with the provided password
      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        // @ts-ignore
        password: password,
      });
      
      // Save it without encryption
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
    } catch (err: any) {
      console.error("Error unlocking PDF:", err);
      if (err.message?.includes("password")) {
        setError("Incorrect password. Please try again.");
      } else {
        setError("Failed to unlock PDF. It might not be encrypted or the file is corrupted.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link to="/pdf-tools" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to PDF Tools
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Unlock PDF</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Remove password security from your PDF file.</p>
        </div>

        {!file ? (
          <Card>
            <CardHeader>
              <CardTitle>Upload Encrypted PDF</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20' : 'border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                }`}
              >
                <input {...getInputProps()} />
                <Unlock className="w-12 h-12 text-zinc-400 mb-4" />
                <p className="text-lg font-medium text-center">Drag & drop an encrypted PDF here, or click to select</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Unlock File</span>
                <Button variant="outline" size="sm" onClick={() => { setFile(null); setResultUrl(null); setError(null); }}>
                  Change File
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg flex items-center justify-between">
                <div className="truncate font-medium">{file.name}</div>
                <div className="text-sm text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
              </div>

              {!resultUrl ? (
                <div className="space-y-4 max-w-md mx-auto">
                  <div className="space-y-2">
                    <Label htmlFor="password">Document Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Enter the password to unlock..." 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={unlockPdf} 
                    disabled={isProcessing || !password}
                  >
                    {isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Unlocking...</> : <><Unlock className="w-4 h-4 mr-2" /> Unlock PDF</>}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-2">
                    <Unlock className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-medium text-center">PDF Unlocked Successfully!</h3>
                  <p className="text-zinc-500 text-center mb-4">The password has been removed from your document.</p>
                  
                  <Button 
                    size="lg" 
                    className="bg-green-600 hover:bg-green-700 text-white" 
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = resultUrl;
                      link.download = `unlocked_${file.name}`;
                      link.click();
                    }}
                  >
                    <Download className="w-5 h-5 mr-2" /> Download Unlocked PDF
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
