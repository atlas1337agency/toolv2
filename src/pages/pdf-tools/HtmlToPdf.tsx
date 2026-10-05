import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Globe, Loader2, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function HtmlToPdf() {
  const [url, setUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const convertToPdf = async () => {
    if (!url) return;
    
    // Basic URL validation
    let validUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      validUrl = 'https://' + url;
    }
    
    try {
      new URL(validUrl);
    } catch (e) {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResultUrl(null);
    
    try {
      // Using Microlink API to convert URL to PDF
      const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(validUrl)}&pdf=true&meta=false`);
      
      if (!response.ok) {
        throw new Error("Failed to convert URL to PDF");
      }
      
      const data = await response.json();
      
      if (data.status === "success" && data.data?.pdf?.url) {
        setResultUrl(data.data.pdf.url);
      } else {
        throw new Error("Invalid response from conversion service");
      }
    } catch (err) {
      console.error("Error converting HTML to PDF:", err);
      setError("Failed to convert the webpage. Some websites block automated access.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-5xl mx-auto space-y-6 h-[calc(100vh-10rem)] flex flex-col">
        <Link to="/pdf-tools" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to PDF Tools
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">HTML to PDF</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Convert any public webpage to a PDF document.</p>
        </div>

        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader>
            <CardTitle>Enter Website URL</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-6 overflow-hidden">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <Input 
                  placeholder="https://example.com" 
                  className="pl-10"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && convertToPdf()}
                />
              </div>
              <Button onClick={convertToPdf} disabled={isProcessing || !url}>
                {isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Converting...</> : "Convert"}
              </Button>
            </div>
            
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {resultUrl ? (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-green-200 dark:border-green-900/50 rounded-xl p-12 bg-green-50/50 dark:bg-green-900/10">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <Download className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-medium text-center mb-2">PDF Generated Successfully!</h3>
                <p className="text-zinc-500 text-center mb-6 max-w-md">
                  Your webpage has been converted to a PDF document and is ready to download.
                </p>
                <div className="flex gap-4">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setResultUrl(null);
                      setUrl("");
                    }}
                  >
                    Convert Another URL
                  </Button>
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white" 
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = resultUrl;
                      link.download = `webpage_${new Date().getTime()}.pdf`;
                      link.target = "_blank";
                      link.click();
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" /> Download PDF
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-12 text-zinc-500">
                {isProcessing ? (
                  <>
                    <Loader2 className="w-12 h-12 mb-4 animate-spin text-zinc-400" />
                    <p className="text-lg font-medium">Converting webpage to PDF...</p>
                    <p className="text-sm mt-2">This might take a few seconds depending on the page size.</p>
                  </>
                ) : (
                  <>
                    <Globe className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-lg font-medium text-center">Enter a URL above to generate a PDF</p>
                    <p className="text-sm mt-2 text-center max-w-md">
                      The webpage must be publicly accessible. Pages requiring login or complex interactions may not render correctly.
                    </p>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
