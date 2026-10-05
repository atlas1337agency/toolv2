import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Wand2, Copy, Check, Loader2, Download, Sparkles } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';

interface Color {
  hex: string;
  name: string;
  reasoning: string;
}

const SUGGESTIONS = [
  "Cyberpunk neon city at night",
  "Minimalist scandinavian living room",
  "Vintage 1970s retro diner",
  "Deep ocean bioluminescence",
  "Autumn forest in morning mist",
  "Vaporwave aesthetic sunset"
];

export function AIPaletteGenerator() {
  const [prompt, setPrompt] = useState('');
  const [palette, setPalette] = useState<Color[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    
    setLoading(true);
    setError('');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a color palette of 5 colors based on this prompt: "${prompt}". Return a JSON array of objects, each with 'hex' (the hex color code starting with #), 'name' (a creative name for the color), and 'reasoning' (why it fits the prompt).`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                hex: { type: Type.STRING, description: "Hex color code, e.g., #FF5733" },
                name: { type: Type.STRING, description: "Creative name for the color" },
                reasoning: { type: Type.STRING, description: "Why this color fits the theme" }
              },
              required: ["hex", "name", "reasoning"]
            }
          }
        }
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        setPalette(parsed);
      } else {
        throw new Error("No response from AI");
      }
    } catch (err) {
      console.error(err);
      setError('Failed to generate palette. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (hex: string, index: number) => {
    navigator.clipboard.writeText(hex);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    const cssVars = palette.map((color, i) => `--color-${color.name.toLowerCase().replace(/\s+/g, '-')}: ${color.hex};`).join('\n');
    navigator.clipboard.writeText(cssVars);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 md:px-6 lg:px-8">
      <Link to="/color-tools" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
        <ArrowLeft className="h-4 w-4" />
        Back to Color Tools
      </Link>
      
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">AI Color Palette Generator</h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Craft perfect color palettes effortlessly with AI-driven creativity. Describe a mood, scene, or theme.
          </p>
        </div>
        {palette.length > 0 && (
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700"
          >
            {copiedAll ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
            {copiedAll ? 'Copied CSS' : 'Export CSS'}
          </button>
        )}
      </div>

      <div className="mb-10">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Sparkles className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="e.g., Cyberpunk neon city at night, Sunset over the ocean..."
              className="h-14 w-full rounded-xl border border-zinc-200 bg-white pl-12 pr-4 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={!prompt || loading}
            className="flex h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-zinc-900 px-8 font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5" />}
            Generate
          </button>
        </div>
        
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Try:</span>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setPrompt(s)}
              className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-8 rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {palette.length > 0 && (
        <div className="space-y-8">
          <div className="flex h-48 w-full overflow-hidden rounded-2xl shadow-sm">
            {palette.map((color, idx) => (
              <div
                key={idx}
                className="group relative flex-1 transition-all hover:flex-[1.5]"
                style={{ backgroundColor: color.hex }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 bg-black/20 backdrop-blur-[2px]">
                  <button
                    onClick={() => handleCopy(color.hex, idx)}
                    className="flex items-center gap-2 rounded-lg bg-white/90 px-3 py-1.5 text-sm font-medium text-zinc-900 shadow-sm hover:bg-white"
                  >
                    {copiedIndex === idx ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {color.hex}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {palette.map((color, idx) => (
              <div key={idx} className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-full shadow-inner border border-zinc-200 dark:border-zinc-800" style={{ backgroundColor: color.hex }} />
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{color.name}</h3>
                    <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">{color.hex}</p>
                  </div>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{color.reasoning}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
