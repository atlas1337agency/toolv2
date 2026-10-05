import React, { useState } from "react";
import { Download, Loader2, Globe, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function HtmlToImage() {
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImage = async () => {
    if (!url) return;
    
    // Simple URL validation
    let finalUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      finalUrl = "http://" + url;
    }

    setIsGenerating(true);
    setImageUrl(null);
    
    try {
      // Using Microlink API for full-page website screenshots
      const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(finalUrl)}&screenshot=true&meta=false&fullPage=true`;
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (data.status === 'success' && data.data?.screenshot?.url) {
        // Preload the image to ensure it's ready before showing
        const img = new Image();
        img.onload = () => {
          setImageUrl(data.data.screenshot.url);
          setIsGenerating(false);
        };
        img.onerror = () => {
          throw new Error("Failed to load the generated screenshot image.");
        };
        img.src = data.data.screenshot.url;
      } else {
        throw new Error(data.message || "Failed to generate screenshot.");
      }
    } catch (error) {
      console.error("Screenshot error:", error);
      alert("Failed to generate full-page image from URL. Please ensure the URL is correct and publicly accessible.");
      setIsGenerating(false);
    }
  };

  const downloadImage = async () => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `screenshot_${new URL(url.startsWith('http') ? url : 'http://'+url).hostname}.jpg`;
      link.click();
    } catch (error) {
      // Fallback if CORS prevents fetch
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/image-tools" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Image Tools
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">HTML to Image</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Convert any public webpage into an image by pasting its URL.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Enter Website URL</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input 
                type="url" 
                placeholder="https://example.com" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && generateImage()}
                className="flex-1"
              />
              <Button onClick={generateImage} disabled={!url || isGenerating}>
                {isGenerating ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Capturing...</>
                ) : (
                  <><Globe className="w-4 h-4 mr-2" /> Capture</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {imageUrl && (
          <Card>
            <CardHeader>
              <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
                <img src={imageUrl} alt="Website Screenshot" className="w-full h-auto" />
              </div>
              <div className="mt-4 flex justify-center">
                <Button onClick={downloadImage} variant="secondary" className="w-full sm:w-auto">
                  <Download className="w-4 h-4 mr-2" /> Download Screenshot
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
