import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { Upload, Loader2, Image as ImageIcon, Wand2, ArrowLeft, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { GoogleGenAI } from "@google/genai";

export function ImageToPrompt() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setPrompt("");
      setIsMaintenance(false);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove the data:image/jpeg;base64, part
        const base64Data = base64String.split(',')[1];
        setBase64Image(base64Data);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const generatePrompt = async () => {
    if (!file || !base64Image) return;
    setIsGenerating(true);
    setPrompt("");
    setIsMaintenance(false);
    
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        setIsMaintenance(true);
        setIsGenerating(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview", // Free, fast model with no limits
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Image,
                mimeType: file.type,
              },
            },
            {
              text: "Analyze this image in extreme detail. Write a highly descriptive, comprehensive prompt that could be used to recreate this exact image using an AI image generator (like Midjourney or DALL-E). Include details about the subject, lighting, camera angle, style, mood, colors, and background.",
            },
          ],
        },
      });
      
      setPrompt(response.text || "Could not generate prompt.");
    } catch (error) {
      console.error("Error generating prompt:", error);
      setIsMaintenance(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/image-tools" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Image Tools
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Image to Prompt</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Generate a highly detailed AI prompt from any image using Gemini 3.1.</p>
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
                  <Button onClick={generatePrompt} disabled={isGenerating} className="w-full">
                    {isGenerating ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing Image...</>
                    ) : (
                      <><Wand2 className="w-4 h-4 mr-2" /> Generate Prompt</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Generated Prompt</CardTitle>
              </CardHeader>
              <CardContent>
                {isMaintenance ? (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Service in Maintenance</AlertTitle>
                    <AlertDescription>
                      The AI API is currently unavailable or the rate limit has been reached. 
                      <br /><br />
                      <strong>How to fix:</strong> You can add your own free Gemini API key in the AI Studio Settings menu to bypass these limits. We use the free `gemini-3-flash-preview` model which has very high limits when using your own key!
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <Textarea 
                      value={prompt} 
                      readOnly 
                      className="min-h-[200px] text-sm leading-relaxed" 
                      placeholder="The generated AI prompt will appear here..."
                    />
                    <div className="mt-4 flex justify-center">
                      <Button onClick={copyPrompt} disabled={!prompt} variant="secondary" className="w-full">
                        Copy Prompt
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
